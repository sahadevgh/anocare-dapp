// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IAnoPassNFT {
    function balanceOf(address owner) external view returns (uint256);
}

interface IVerifiedAnoProNFT {
    function isVerified(address anoPro) external view returns (bool);
}

interface IAnocareContract {
    function isActiveCase(
        uint256 caseId,
        address anoPro,
        address patient
    ) external view returns (bool);

    function consultationFeeInTokens() external view returns (uint256);
    function anoProFeePercentage() external view returns (uint256);

    function getAnoPro(address _anoPro) external view returns (
        address wallet,
        uint256 rating,
        uint256 totalCases,
        uint256 totalRatings,
        uint256 earnings
    );
}

contract AnoProRewardPool {
    address public owner;
    IAnoPassNFT public anoPassNFT;
    IVerifiedAnoProNFT public verifiedAnoProNFT;
    IAnocareContract public anocareContract;

    uint256 public totalDeposited;

    mapping(address => uint256) public anoProPremiumRewards;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyVerifiedAnoPro() {
        require(verifiedAnoProNFT.isVerified(msg.sender), "Not a verified AnoPro");
        _;
    }

    event RewardDeposited(address indexed from, uint256 amount);
    event PremiumConsultRecorded(address indexed anoPro, address indexed premiumUser, uint256 reward);
    event RewardClaimed(address indexed anoPro, uint256 amount);

    constructor(address _anoPassNFT, address _verifiedAnoProNFT, address _anocareContract) {
        require(_anoPassNFT != address(0), "Invalid NFT address");
        require(_verifiedAnoProNFT != address(0), "Invalid verifier address");
        require(_anocareContract != address(0), "Invalid contract address");

        owner = msg.sender;
        anoPassNFT = IAnoPassNFT(_anoPassNFT);
        verifiedAnoProNFT = IVerifiedAnoProNFT(_verifiedAnoProNFT);
        anocareContract = IAnocareContract(_anocareContract);
    }

    receive() external payable {
        totalDeposited += msg.value;
        emit RewardDeposited(msg.sender, msg.value);
    }

    function recordConsult(uint256 caseId, address anoPro, address premiumUser) external {
        require(anoPassNFT.balanceOf(premiumUser) > 0, "User is not premium");
        require(verifiedAnoProNFT.isVerified(anoPro), "AnoPro not verified");
        require(anocareContract.isActiveCase(caseId, anoPro, premiumUser), "No active case found");

        uint256 rewardPerConsult = (anocareContract.consultationFeeInTokens() * anocareContract.anoProFeePercentage()) / 100;
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
