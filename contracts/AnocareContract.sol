// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./AnoPassNFT.sol";
import "./VerifiedAnoProNFT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ANOCARE CONTRACT
 * @notice Manages AnoPro registration, case tracking, payments and ratings
 */
contract AnocareContract {
    VerifiedAnoProNFT public verifiedAnoProNFT;
    AnoPassNFT public anoPassNFT;

    IERC20 public paymentToken;
    address public owner;
    address public platformWallet;

    uint256 private _caseIdCounter;
    uint256 public consultationFeeInTokens = 100 * 10 ** 18; // e.g., 100 ANO tokens
    uint256 public platformFeePercentage = 10;
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
        uint256 scheduleDate;
        uint256 completionDate;
        uint256 rejectionDate;
        uint256 paymentDate;
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
    mapping(address => bool) public isAdmin;
    address[] public adminList;

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
        address _verifiedAnoProNFT,
        address _anoPassNFT,
        address _paymentToken
    ) {
        require(_anoPassNFT != address(0), "Invalid membership NFT address");
        require(_verifiedAnoProNFT != address(0), "Invalid NFT address");
        require(_paymentToken != address(0), "Invalid token address");
        require(msg.sender != address(0), "Invalid owner address");

        verifiedAnoProNFT = VerifiedAnoProNFT(_verifiedAnoProNFT);
        paymentToken = IERC20(_paymentToken);
        anoPassNFT = AnoPassNFT(_anoPassNFT);
        platformWallet = msg.sender;
        owner = msg.sender;
        isAdmin[msg.sender] = true;
        adminList.push(msg.sender);
    }

    function registerAnoPro() external {
        require(
            verifiedAnoProNFT.balanceOf(msg.sender) > 0,
            "NFT required to register"
        );
        require(anoPros[msg.sender].wallet == address(0), "Already registered");

        anoPros[msg.sender] = AnoPro(msg.sender, 0, 0, 0, 0);
        emit AnoProRegistered(msg.sender, anoPros[msg.sender]);
    }

    function requestCase(
        address _anoPro,
        string memory _description
    ) external returns (uint256) {
        require(_anoPro != address(0), "Invalid address");
        require(anoPros[_anoPro].wallet == _anoPro, "Not registered");
        require(msg.sender != _anoPro, "Self-case not allowed");
        require(bytes(_description).length > 0, "Description required");

        bool hasPass = anoPassNFT.balanceOf(msg.sender) > 0;
        if (!hasPass) {
            require(
                paymentToken.balanceOf(msg.sender) >= consultationFeeInTokens,
                "Insufficient token balance"
            );
            require(
                paymentToken.allowance(msg.sender, address(this)) >=
                    consultationFeeInTokens,
                "Insufficient token allowance"
            );
        }

        _caseIdCounter++;
        uint256 caseId = _caseIdCounter;

        cases[caseId] = Case(
            caseId,
            _anoPro,
            msg.sender,
            consultationFeeInTokens,
            CaseStatus.Pending,
            false,
            false,
            0,
            0,
            0,
            0,
            block.timestamp,
            _description
        );
        patientCaseIds[msg.sender].push(caseId);
        anoProCaseIds[_anoPro].push(caseId);

        emit CaseRequested(
            caseId,
            msg.sender,
            _anoPro,
            consultationFeeInTokens,
            _description
        );
        return caseId;
    }

    function acceptCase(uint256 _caseId, uint256 _scheduleDate) external {
        Case storage c = cases[_caseId];
        require(c.status == CaseStatus.Pending, "Not pending");
        require(msg.sender == c.anoPro, "Unauthorized");

        c.status = CaseStatus.Accepted;
        c.scheduleDate = _scheduleDate;
        anoPros[msg.sender].totalCases++;
        _processPayment(_caseId);

        emit CaseAccepted(_caseId);
    }

    function rejectCase(uint256 _caseId) external {
        Case storage c = cases[_caseId];
        require(c.status == CaseStatus.Pending, "Not pending");
        require(msg.sender == c.anoPro, "Unauthorized");

        c.status = CaseStatus.Rejected;
        c.rejectionDate = block.timestamp;
        _issueRefund(_caseId);
        emit CaseRejected(_caseId);
    }

    function _processPayment(uint256 _caseId) private {
        Case storage c = cases[_caseId];
        require(!casePaid[_caseId], "Already paid");

        uint256 platformFee = (c.consultationFee * platformFeePercentage) / 100;
        uint256 anoProFee = (c.consultationFee * anoProFeePercentage) / 100;

        require(
            paymentToken.transfer(platformWallet, platformFee),
            "Platform fee failed"
        );
        require(
            paymentToken.transfer(c.anoPro, anoProFee),
            "AnoPro payment failed"
        );
        
        cases[_caseId].paymentDate = block.timestamp;

        anoPros[c.anoPro].earnings += anoProFee;
        casePaid[_caseId] = true;

        emit PaymentProcessed(_caseId, c.patient, c.anoPro, c.consultationFee);
    }

    function _issueRefund(uint256 _caseId) private {
        Case storage c = cases[_caseId];
        require(!casePaid[_caseId], "Already paid");

        require(
            paymentToken.transfer(c.patient, c.consultationFee),
            "Refund failed"
        );
        casePaid[_caseId] = true;

        emit RefundIssued(_caseId, c.patient, c.consultationFee);
    }

    function submitRating(uint256 _caseId, uint256 _rating) external {
        require(_rating > 0 && _rating <= 5, "Invalid rating");
        Case memory c = cases[_caseId];
        require(c.status == CaseStatus.Closed, "Case not closed");
        require(msg.sender == c.patient, "Only patient can rate");

        AnoPro storage a = anoPros[c.anoPro];
        a.totalRatings++;
        a.rating = (a.rating * (a.totalRatings - 1) + _rating) / a.totalRatings;

        emit RatingSubmitted(msg.sender, c.anoPro, _rating);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid");
        require(!isAdmin[_admin], "Already an admin");
        require(_admin != owner, "Owner cannot be added");

        isAdmin[_admin] = true;
        adminList.push(_admin);
    }

    function removeAdmin(address _admin) external onlyOwner {
        require(isAdmin[_admin], "Not admin");
        require(_admin != owner, "Owner cannot be removed");
        require(_admin != address(0), "Invalid");

        isAdmin[_admin] = false;
        for (uint256 i = 0; i < adminList.length; i++) {
            if (adminList[i] == _admin) {
                adminList[i] = adminList[adminList.length - 1];
                adminList.pop();
                break;
            }
        }
    }

    function updateConsultationFee(uint256 _fee) external onlyOwner {
        require(_fee > 0, "Invalid");
        consultationFeeInTokens = _fee * 1e18; // Accept whole numbers and scale
    }

    function updatePlatformFeePercentage(uint256 _fee) external onlyOwner {
        require(_fee > 0 && _fee + anoProFeePercentage <= 100, "Invalid");
        platformFeePercentage = _fee;
    }

    function updateAnoProFeePercentage(uint256 _fee) external onlyOwner {
        require(_fee > 0 && _fee + platformFeePercentage <= 100, "Invalid");
        anoProFeePercentage = _fee;
    }

    function getAnoPro(
        address _anoPro
    ) external view returns (address, uint256, uint256, uint256, uint256) {
        require(anoPros[_anoPro].wallet != address(0), "Not registered");
        AnoPro memory a = anoPros[_anoPro];
        return (a.wallet, a.rating, a.totalCases, a.totalRatings, a.earnings);
    }

    function showTotalCases() public view returns (uint256) {
        return _caseIdCounter;
    }

    function isActiveCase(
        uint256 _caseId,
        address _anoPro,
        address _patient
    ) public view returns (bool) {
        Case memory c = cases[_caseId];
        return
            c.anoPro == _anoPro &&
            c.patient == _patient &&
            (c.status == CaseStatus.Pending || c.status == CaseStatus.Accepted);
    }

    function checkIsAdmin(address user) public view returns (bool) {
        return isAdmin[user];
    }

    function getAdmins() public view returns (address[] memory) {
        return adminList;
    }
}
