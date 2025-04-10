// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Import the AnoPassNFT contract
import "./AnoPassNFT.sol";
import "./VerifiedAnoProNFT.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ANOCARE CONTRACT
 * @notice Manages AnoPro registration, case tracking, payments and ratings
 */
contract AnocareContract {
    VerifiedAnoProNFT public nft;
    AnoPassNFT public membershipNFT;

    IERC20 public paymentToken;
    address public owner;

    uint256 private _caseIdCounter;

    uint256 public consultationFee = 0.01 ether;
    uint256 public platformFeePercentage = 10;
    address public platformWallet;
    uint256 public anoProFeePercentage = 90;

    enum CaseStatus {
        Pending,
        Accepted,
        Rejected,
        Closed
    }

    struct Case {
        uint256 caseId;
        address anoPro;
        address patient;
        uint256 consultationFee;
        CaseStatus status;
        bool patientClosed;
        bool anoProClosed;
        uint256 timestamp;
        string description;
    }

    struct AnoPro {
        address wallet;
        uint256 rating;
        uint256 totalCases;
        uint256 totalRatings;
        uint256 earnings;
    }

    mapping(address => AnoPro) public anoPros;
    mapping(uint256 => Case) public cases;
    mapping(address => uint256[]) public anoProCaseIds;
    mapping(address => uint256[]) public patientCaseIds;
    mapping(uint256 => bool) public casePaid;
    mapping(address => bool) public admins;

    event AnoProRegistered(address indexed anoPro, AnoPro details);
    event CaseRequested(
        uint256 indexed caseId,
        address indexed patient,
        address indexed anoPro,
        uint256 fee,
        string description
    );
    event CaseAccepted(uint256 indexed caseId);
    event CaseRejected(uint256 indexed caseId);
    event CaseClosed(uint256 indexed caseId);
    event RatingSubmitted(
        address indexed patient,
        address indexed anoPro,
        uint256 rating
    );
    event PaymentProcessed(
        uint256 indexed caseId,
        address indexed patient,
        address indexed anoPro,
        uint256 amount
    );
    event RefundIssued(
        uint256 indexed caseId,
        address indexed patient,
        uint256 amount
    );

    constructor(
        address _nftAddress,
        address _paymentToken,
        address _membershipNFT
    ) {
        require(_membershipNFT != address(0), "Invalid membership NFT address");
        require(_nftAddress != address(0), "Invalid NFT address");
        require(_paymentToken != address(0), "Invalid token address");
        require(msg.sender != address(0), "Invalid owner address");

        nft = VerifiedAnoProNFT(_nftAddress);
        paymentToken = IERC20(_paymentToken);
        membershipNFT = AnoPassNFT(_membershipNFT);
        platformWallet = msg.sender;
        owner = msg.sender;
    }

    function registerAnoPro() external {
        require(nft.balanceOf(msg.sender) > 0, "NFT required to register");
        require(anoPros[msg.sender].wallet == address(0), "Already registered");

        AnoPro memory newAnoPro = AnoPro({
            wallet: msg.sender,
            rating: 0,
            totalCases: 0,
            totalRatings: 0,
            earnings: 0
        });

        anoPros[msg.sender] = newAnoPro;

        emit AnoProRegistered(msg.sender, newAnoPro);
    }

    function requestCase(address _anoPro, string memory _description) external returns (uint256) {
        require(_anoPro != address(0), "Invalid address");
        require(anoPros[_anoPro].wallet == _anoPro, "Not registered");
        require(msg.sender != _anoPro, "Self-case not allowed");
        require(
            membershipNFT.balanceOf(msg.sender) > 0 ||
            paymentToken.balanceOf(msg.sender) >= consultationFee,
            "Insufficient balance"
        );
        require(bytes(_description).length > 0, "Description required");

        _caseIdCounter++;
        uint256 newCaseId = _caseIdCounter;

        if (membershipNFT.balanceOf(msg.sender) == 0) {
            require(paymentToken.allowance(msg.sender, address(this)) >= consultationFee, "Insufficient allowance");
        }

        cases[newCaseId] = Case({
            caseId: newCaseId,
            anoPro: _anoPro,
            patient: msg.sender,
            consultationFee: consultationFee,
            status: CaseStatus.Pending,
            patientClosed: false,
            anoProClosed: false,
            timestamp: block.timestamp,
            description: _description
        });

        patientCaseIds[msg.sender].push(newCaseId);
        anoProCaseIds[_anoPro].push(newCaseId);

        emit CaseRequested(newCaseId, msg.sender, _anoPro, consultationFee, _description);
        return newCaseId;
    }

    function acceptCase(uint256 _caseId) external {
        Case storage currentCase = cases[_caseId];
        require(currentCase.status == CaseStatus.Pending, "Not pending");
        require(msg.sender == currentCase.anoPro, "Unauthorized");

        currentCase.status = CaseStatus.Accepted;
        anoPros[msg.sender].totalCases++;

        _processPayment(_caseId);
        emit CaseAccepted(_caseId);
    }

    function rejectCase(uint256 _caseId) external {
        Case storage currentCase = cases[_caseId];
        require(currentCase.status == CaseStatus.Pending, "Not pending");
        require(msg.sender == currentCase.anoPro, "Unauthorized");

        currentCase.status = CaseStatus.Rejected;
        _issueRefund(_caseId);
        emit CaseRejected(_caseId);
    }

    function _processPayment(uint256 _caseId) private {
        Case storage currentCase = cases[_caseId];
        require(!casePaid[_caseId], "Already paid");

        uint256 platformFee = (currentCase.consultationFee * platformFeePercentage) / 100;
        uint256 anoProFee = (currentCase.consultationFee * anoProFeePercentage) / 100;

        require(paymentToken.transfer(platformWallet, platformFee), "Platform fee failed");
        require(paymentToken.transfer(currentCase.anoPro, anoProFee), "AnoPro payment failed");

        anoPros[currentCase.anoPro].earnings += anoProFee;
        casePaid[_caseId] = true;

        emit PaymentProcessed(_caseId, currentCase.patient, currentCase.anoPro, currentCase.consultationFee);
    }

    function _issueRefund(uint256 _caseId) private {
        Case storage currentCase = cases[_caseId];
        require(!casePaid[_caseId], "Already paid");

        require(paymentToken.transfer(currentCase.patient, currentCase.consultationFee), "Refund failed");
        casePaid[_caseId] = true;
        emit RefundIssued(_caseId, currentCase.patient, currentCase.consultationFee);
    }

    function submitRating(uint256 _caseId, uint256 _rating) external {
        require(_rating > 0 && _rating <= 5, "Invalid rating");
        Case memory currentCase = cases[_caseId];
        require(currentCase.status == CaseStatus.Closed, "Case not closed");
        require(msg.sender == currentCase.patient, "Only patient");

        AnoPro storage anoPro = anoPros[currentCase.anoPro];
        anoPro.totalRatings++;
        anoPro.rating = (anoPro.rating * (anoPro.totalRatings - 1) + _rating) / anoPro.totalRatings;

        emit RatingSubmitted(msg.sender, currentCase.anoPro, _rating);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid");
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) external onlyOwner {
        require(admins[_admin], "Not admin");
        admins[_admin] = false;
    }

    function isAdmin(address _user) external view returns (bool) {
        return admins[_user];
    }

    function updateConsultationFee(uint256 _consultationFee) external onlyOwner {
        require(_consultationFee > 0, "Invalid");
        consultationFee = _consultationFee;
    }

    function updatePlatformFeePercentage(uint256 _fee) external onlyOwner {
        require(_fee > 0 && _fee < 100, "Invalid");
        require(_fee + anoProFeePercentage <= 100, "Total too high");
        platformFeePercentage = _fee;
    }

    function updateAnoProFeePercentage(uint256 _fee) external onlyOwner {
        require(_fee > 0 && _fee < 100, "Invalid");
        require(_fee + platformFeePercentage <= 100, "Total too high");
        anoProFeePercentage = _fee;
    }

    function getAnoPro(address _anoPro) external view returns (
        address wallet,
        uint256 rating,
        uint256 totalCases,
        uint256 totalRatings,
        uint256 earnings
    ) {
        require(anoPros[_anoPro].wallet != address(0), "Not registered");
        AnoPro memory a = anoPros[_anoPro];
        return (a.wallet, a.rating, a.totalCases, a.totalRatings, a.earnings);
    }

    function totalCases() public view returns (uint256) {
        return _caseIdCounter;
    }

    function isActiveCase(uint256 _caseId, address _anoPro, address _patient) public view returns (bool) {
        Case memory c = cases[_caseId];
        return c.anoPro == _anoPro && c.patient == _patient && (c.status == CaseStatus.Accepted || c.status == CaseStatus.Pending);
    }
}