// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IPremiumMembershipNFT {
    function balanceOf(address owner) external view returns (uint256);
}

interface IAnoProVerifier {
    function isVerified(address anoPro) external view returns (bool);
}

interface IAnoProContract {
    function isActiveCase(
        uint256 caseId,
        address anoPro,
        address patient
    ) external view returns (bool);

    function consultationFee() external view returns (uint256);
    function anoProFeePercentage() external view returns (uint256);

    function getAnoPro(address _anoPro) external view returns (
        address wallet,
        uint256 rating,
        uint256 totalCases,
        uint256 totalRatings,
        uint256 earnings,
        string memory specialization
    );
}

contract AnoProRewardPool {
    address public owner;
    IPremiumMembershipNFT public premiumNFT;
    IAnoProVerifier public anoProVerifier;
    IAnoProContract public anoProContract;

    uint256 public totalDeposited;

    mapping(address => uint256) public anoProPremiumRewards;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyVerifiedAnoPro() {
        require(anoProVerifier.isVerified(msg.sender), "Not a verified AnoPro");
        _;
    }

    event RewardDeposited(address indexed from, uint256 amount);
    event PremiumConsultRecorded(address indexed anoPro, address indexed premiumUser, uint256 reward);
    event RewardClaimed(address indexed anoPro, uint256 amount);

    constructor(address _nft, address _verifier, address _anoProContract) {
        require(_nft != address(0), "Invalid NFT address");
        require(_verifier != address(0), "Invalid verifier address");
        require(_anoProContract != address(0), "Invalid contract address");

        owner = msg.sender;
        premiumNFT = IPremiumMembershipNFT(_nft);
        anoProVerifier = IAnoProVerifier(_verifier);
        anoProContract = IAnoProContract(_anoProContract);
    }

    receive() external payable {
        totalDeposited += msg.value;
        emit RewardDeposited(msg.sender, msg.value);
    }

    function recordConsult(uint256 caseId, address anoPro, address premiumUser) external {
        require(premiumNFT.balanceOf(premiumUser) > 0, "User is not premium");
        require(anoProVerifier.isVerified(anoPro), "AnoPro not verified");
        require(anoProContract.isActiveCase(caseId, anoPro, premiumUser), "No active case found");

        uint256 rewardPerConsult = (anoProContract.consultationFee() * anoProContract.anoProFeePercentage()) / 100;
        anoProPremiumRewards[anoPro] += rewardPerConsult;

        emit PremiumConsultRecorded(anoPro, premiumUser, rewardPerConsult);
    }

    function claimReward() external onlyVerifiedAnoPro {
        uint256 amount = anoProPremiumRewards[msg.sender];
        require(amount > 0, "No rewards available");
        require(address(this).balance >= amount, "Insufficient contract balance");

        anoProPremiumRewards[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit RewardClaimed(msg.sender, amount);
    }

    function withdrawUnused(address to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Not enough balance");
        payable(to).transfer(amount);
    }
}
