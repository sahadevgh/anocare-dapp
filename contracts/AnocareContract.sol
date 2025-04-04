// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./VerifiedClinicianNFT.sol";
import "./PremiumMembershipNFT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ANOCARE CONTRACT
 * @notice Manages clinician registration, case tracking, payments and ratings
 */
contract AnocareContract {
    VerifiedClinicianNFT public nft;
    PremiumMembershipNFT public membershipNFT;

    IERC20 public paymentToken;
    address public owner;

    uint256 private _caseIdCounter;

    uint256 public consultationFee = 0.01 ether;
    uint256 public platformFeePercentage = 10;
    address public platformWallet;
    uint256 public clinicianFeePercentage = 90;

    enum CaseStatus {
        Pending,
        Accepted,
        Rejected,
        Closed
    }

    struct Case {
        uint256 caseId;
        address clinician;
        address patient;
        uint256 consultationFee;
        CaseStatus status;
        bool patientClosed;
        bool clinicianClosed;
        uint256 timestamp;
        string description;
    }

    struct Clinician {
        address wallet;
        uint256 rating;
        uint256 totalCases;
        uint256 totalRatings;
        uint256 earnings;
        string specialization;
    }

    mapping(address => Clinician) public clinicians;
    mapping(uint256 => Case) public cases;
    mapping(address => uint256[]) public clinicianCaseIds;
    mapping(address => uint256[]) public patientCaseIds;
    mapping(uint256 => bool) public casePaid;

    event ClinicianRegistered(address indexed clinician, string specialization);
    event CaseRequested(
        uint256 indexed caseId,
        address indexed patient,
        address indexed clinician,
        uint256 fee,
        string description
    );
    event CaseAccepted(uint256 indexed caseId);
    event CaseRejected(uint256 indexed caseId);
    event CaseClosed(uint256 indexed caseId);
    event RatingSubmitted(
        address indexed patient,
        address indexed clinician,
        uint256 rating
    );
    event PaymentProcessed(
        uint256 indexed caseId,
        address indexed patient,
        address indexed clinician,
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

        nft = VerifiedClinicianNFT(_nftAddress);
        paymentToken = IERC20(_paymentToken);
        membershipNFT = PremiumMembershipNFT(_membershipNFT);
        platformWallet = msg.sender;
        owner = msg.sender;
    }

    /**
     * @notice Registers a clinician with their specialization
     * @param _specialization The clinician's medical specialization
     */
    function registerClinician(string memory _specialization) external {
        require(nft.balanceOf(msg.sender) > 0, "NFT required to register");
        require(
            clinicians[msg.sender].wallet == address(0),
            "Already registered"
        );
        require(bytes(_specialization).length > 0, "Specialization required");

        clinicians[msg.sender] = Clinician({
            wallet: msg.sender,
            rating: 0,
            totalCases: 0,
            totalRatings: 0,
            earnings: 0,
            specialization: _specialization
        });

        emit ClinicianRegistered(msg.sender, _specialization);
    }

    /**
     * @notice Patient requests a case with payment
     * @param _clinician Address of requested clinician
     * @param _consultationFee Fee amount in payment tokens
     * @param _description Description of the medical case
     * @return The generated case ID
     */
    function requestCase(
        address _clinician,
        string memory _description
    ) external returns (uint256) {
        require(_clinician != address(0), "Invalid clinician address");
        require(
            clinicians[_clinician].wallet == _clinician,
            "Clinician not registered"
        );
        require(
            msg.sender != _clinician,
            "Patient cannot be the same as clinician"
        );
        // If the patient is a premium member, they can request a case without payment
        require(
            membershipNFT.balanceOf(msg.sender) > 0 ||
                paymentToken.balanceOf(msg.sender) >= consultationFee,
            "Insufficient balance"
        );
        require(bytes(_description).length > 0, "Description required");

        // Generate new case ID
        _caseIdCounter++;
        uint256 newCaseId = _caseIdCounter;

        // Transfer payment from patient to contract if not a premium member
        if (membershipNFT.balanceOf(msg.sender) == 0) {
            require(
                consultationFee > 0,
                "Consultation fee must be greater than zero"
            );
            require(
                paymentToken.allowance(msg.sender, address(this)) >=
                    consultationFee,
                "Insufficient allowance"
            );
        }

        cases[newCaseId] = Case({
            caseId: newCaseId,
            clinician: _clinician,
            patient: msg.sender,
            consultationFee: consultationFee,
            status: CaseStatus.Pending,
            patientClosed: false,
            clinicianClosed: false,
            timestamp: block.timestamp,
            description: _description
        });

        patientCaseIds[msg.sender].push(newCaseId);
        clinicianCaseIds[_clinician].push(newCaseId);

        emit CaseRequested(
            newCaseId,
            msg.sender,
            _clinician,
            consultationFee,
            _description
        );
        return newCaseId;
    }

    /**
     * @notice Clinician accepts a case request
     * @param _caseId ID of the case to Aaccept
     */
    function acceptCase(uint256 _caseId) external {
        Case storage currentCase = cases[_caseId];
        require(currentCase.status == CaseStatus.Pending, "Case not pending");
        require(
            msg.sender == currentCase.clinician,
            "Only requested clinician"
        );

        currentCase.status = CaseStatus.Accepted;
        clinicians[msg.sender].totalCases++;

        // Distribute payment
        _processPayment(_caseId);

        emit CaseAccepted(_caseId);
    }

    /**
     * @notice Clinician rejects a case request
     * @param _caseId ID of the case to reject
     */
    function rejectCase(uint256 _caseId) external {
        Case storage currentCase = cases[_caseId];
        require(currentCase.status == CaseStatus.Pending, "Case not pending");
        require(
            msg.sender == currentCase.clinician,
            "Only requested clinician"
        );

        currentCase.status = CaseStatus.Rejected;

        // Refund patient
        _issueRefund(_caseId);

        emit CaseRejected(_caseId);
    }

    function _processPayment(uint256 _caseId) private {
        Case storage currentCase = cases[_caseId];
        require(!casePaid[_caseId], "Payment already processed");

        uint256 platformFee = (currentCase.consultationFee *
            platformFeePercentage) / 100;
        uint256 clinicianFee = (currentCase.consultationFee *
            clinicianFeePercentage) / 100;

        // Transfer platform fee
        require(
            paymentToken.transfer(platformWallet, platformFee),
            "Platform transfer failed"
        );

        // Transfer clinician fee
        require(
            paymentToken.transfer(currentCase.clinician, clinicianFee),
            "Clinician transfer failed"
        );

        clinicians[currentCase.clinician].earnings += clinicianFee;
        casePaid[_caseId] = true;

        emit PaymentProcessed(
            _caseId,
            currentCase.patient,
            currentCase.clinician,
            currentCase.consultationFee
        );
    }

    function _issueRefund(uint256 _caseId) private {
        Case storage currentCase = cases[_caseId];
        require(!casePaid[_caseId], "Payment already processed");

        require(
            paymentToken.transfer(
                currentCase.patient,
                currentCase.consultationFee
            ),
            "Refund failed"
        );

        casePaid[_caseId] = true;
        emit RefundIssued(
            _caseId,
            currentCase.patient,
            currentCase.consultationFee
        );
    }

    function submitRating(uint256 _caseId, uint256 _rating) external {
        require(_rating > 0 && _rating <= 5, "Invalid rating");
        Case memory currentCase = cases[_caseId];

        require(currentCase.status == CaseStatus.Closed, "Case not closed");
        require(msg.sender == currentCase.patient, "Only patient can rate");

        Clinician storage clinician = clinicians[currentCase.clinician];
        clinician.totalRatings++;
        clinician.rating =
            (clinician.rating * (clinician.totalRatings - 1) + _rating) /
            clinician.totalRatings;

        emit RatingSubmitted(msg.sender, currentCase.clinician, _rating);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    /**
     * @notice Owner can update the consultation fee
     * @param _consultationFee New consultation fee
     */
    function updateConsultationFee(
        uint256 _consultationFee
    ) external onlyOwner {
        require(_consultationFee > 0, "Invalid consultation fee");
        require(
            _consultationFee != consultationFee,
            "No change in consultation fee"
        );
        require(_consultationFee != 0, "Consultation fee cannot be zero");

        consultationFee = _consultationFee;
    }

    /**
     * @notice Ownwer can update the platform fee percentage
     * @param _platformFeePercentage New platform fee percentage
     */
    function updatePlatformFeePercentage(
        uint256 _platformFeePercentage
    ) external onlyOwner {
        require(
            _platformFeePercentage > 0 && _platformFeePercentage < 100,
            "Invalid fee percentage"
        );
        require(
            _platformFeePercentage + clinicianFeePercentage <= 100,
            "Total fee percentage exceeds 100"
        );
        require(
            _platformFeePercentage != platformFeePercentage,
            "No change in fee percentage"
        );
        require(
            _platformFeePercentage != 0,
            "Platform fee percentage cannot be zero"
        );

        platformFeePercentage = _platformFeePercentage;
    }

    /**
     * @notice Ownwer can update the clinician fee percentage
     * @param _clinicianFeePercentage New clinician fee percentage
     */
    function updateClinicianFeePercentage(
        uint256 _clinicianFeePercentage
    ) external onlyOwner {
        require(
            _clinicianFeePercentage > 0 && _clinicianFeePercentage < 100,
            "Invalid fee percentage"
        );
        require(
            _clinicianFeePercentage + platformFeePercentage <= 100,
            "Total fee percentage exceeds 100"
        );
        require(
            _clinicianFeePercentage != clinicianFeePercentage,
            "No change in fee percentage"
        );
        require(
            _clinicianFeePercentage != 0,
            "Clinician fee percentage cannot be zero"
        );
        clinicianFeePercentage = _clinicianFeePercentage;
    }

    /**
     * @notice Function to get a clinician
     * @param _clinician Address of the clinician
     * @return wallet The wallet address of the clinician
     * @return rating The rating of the clinician
     * @return totalCases The total number of cases handled by the clinician
     * @return totalRatings The total number of ratings received by the clinician
     * @return earnings The total earnings of the clinician
     * @return specialization The specialization of the clinician
     */
    function getClinician(
        address _clinician
    )
        external
        view
        returns (
            address wallet,
            uint256 rating,
            uint256 totalCases,
            uint256 totalRatings,
            uint256 earnings,
            string memory specialization
        )
    {
        require(
            clinicians[_clinician].wallet != address(0),
            "Clinician not registered"
        );
        return (
            clinicians[_clinician].wallet,
            clinicians[_clinician].rating,
            clinicians[_clinician].totalCases,
            clinicians[_clinician].totalRatings,
            clinicians[_clinician].earnings,
            clinicians[_clinician].specialization
        );
    }

    /**
     * @notice Gets the total number of cases created
     * @return The total case count
     */
    function totalCases() public view returns (uint256) {
        return _caseIdCounter;
    }

    /**
     * @notice Check if case is active between patient and clinician
     * @param _caseId ID of the case to check
     * @param _clinician Address of the clinician
     * @param _patient Address of the patient
     * @return True if the case is active, false otherwise
     */
    function isActiveCase(
        uint256 _caseId,
        address _clinician,
        address _patient
    ) public view returns (bool) {
        Case memory currentCase = cases[_caseId];
        return
            currentCase.clinician == _clinician &&
            currentCase.patient == _patient &&
            (currentCase.status == CaseStatus.Accepted ||
                currentCase.status == CaseStatus.Pending);
    }
}
