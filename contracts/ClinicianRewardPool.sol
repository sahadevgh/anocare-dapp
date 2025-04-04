// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IPremiumMembershipNFT {
    function balanceOf(address owner) external view returns (uint256);
}

interface IClinicianVerifier {
    function isVerified(address clinician) external view returns (bool);
}

interface IAnocareContract {
    function isActiveCase(
        uint256 caseId,
        address clinician,
        address patient
    ) external view returns (bool);

    function consultationFee() external view returns (uint256);
    function clinicianFeePercentage() external view returns (uint256);

    function getClinician(address _clinician) external view returns (
        address wallet,
        uint256 rating,
        uint256 totalCases,
        uint256 totalRatings,
        uint256 earnings,
        string memory specialization
    );
}

contract ClinicianRewardPool {
    address public owner;
    IPremiumMembershipNFT public premiumNFT;
    IClinicianVerifier public clinicianVerifier;
    IAnocareContract public anocareContract;

    uint256 public totalDeposited;

    mapping(address => uint256) public clinicianPremiumRewards;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyVerifiedClinician() {
        require(clinicianVerifier.isVerified(msg.sender), "Not a verified clinician");
        _;
    }

    event RewardDeposited(address indexed from, uint256 amount);
    event PremiumConsultRecorded(address indexed clinician, address indexed premiumUser, uint256 reward);
    event RewardClaimed(address indexed clinician, uint256 amount);

    constructor(address _nft, address _verifier, address _anocareContract) {
        require(_nft != address(0), "Invalid NFT address");
        require(_verifier != address(0), "Invalid verifier address");
        require(_anocareContract != address(0), "Invalid Anocare address");

        owner = msg.sender;
        premiumNFT = IPremiumMembershipNFT(_nft);
        clinicianVerifier = IClinicianVerifier(_verifier);
        anocareContract = IAnocareContract(_anocareContract);
    }

    receive() external payable {
        totalDeposited += msg.value;
        emit RewardDeposited(msg.sender, msg.value);
    }

    function recordConsult(uint256 caseId, address clinician, address premiumUser) external {
        require(premiumNFT.balanceOf(premiumUser) > 0, "User is not premium");
        require(clinicianVerifier.isVerified(clinician), "Clinician not verified");
        require(anocareContract.isActiveCase(caseId, clinician, premiumUser), "No active case found");

        uint256 rewardPerConsult = (anocareContract.consultationFee() * anocareContract.clinicianFeePercentage()) / 100;
        clinicianPremiumRewards[clinician] += rewardPerConsult;

        emit PremiumConsultRecorded(clinician, premiumUser, rewardPerConsult);
    }

    function claimReward() external onlyVerifiedClinician {
        uint256 amount = clinicianPremiumRewards[msg.sender];
        require(amount > 0, "No rewards available");
        require(address(this).balance >= amount, "Insufficient contract balance");

        clinicianPremiumRewards[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        // Update the total clinician earnings in Anocare contract
        ( , , , , uint256 earnings,) = anocareContract.getClinician(msg.sender);
        earnings += amount;

        emit RewardClaimed(msg.sender, amount);
    }

    function withdrawUnused(address to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Not enough balance");
        payable(to).transfer(amount);
    }
}
