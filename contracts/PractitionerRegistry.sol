// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Import the NFT contract that acts as a verification layer.
// Only users holding this NFT can register as practitioners.
import "./VerifiedPractitionerNFT.sol";

// Main contract for registering health practitioners on the Anocare platform.
contract PractitionerRegistry {
    // Reference to the deployed NFT contract used for verification
    VerifiedPractitionerNFT public nft;

    // Constructor receives the address of the NFT contract when deploying
    constructor(address _nftAddress) {
        nft = VerifiedPractitionerNFT(_nftAddress);
    }

    // Structure that defines a practitioner's profile
    struct Practitioner {
        string aliasName;   // Anonymous display name (e.g. "DocX")
        string specialty;   // Area of expertise (e.g. "Mental Health")
        string region;      // General region info (e.g. "West Africa" — not exact location)
        bool isActive;      // Indicates if the practitioner is available to take cases
    }

    // Mapping to store each practitioner's data using their wallet address
    mapping(address => Practitioner) public practitioners;

    // Emitted when a new practitioner is successfully registered
    event PractitionerRegistered(
        address indexed practitioner,
        string aliasName
    );

    // Emitted when a practitioner's availability status changes
    event StatusUpdated(address indexed practitioner, bool isActive);

    /**
     * Registers a verified practitioner.
     * Requirements:
     * - Caller must own a verification NFT.
     * - Caller must not be already registered.
     * 
     * @param _aliasName An alias (anonymous name) for the practitioner
     * @param _specialty Their area of expertise
     * @param _region Obfuscated location or region
     */
    function registerPractitioner(
        string memory _aliasName,
        string memory _specialty,
        string memory _region
    ) external {
        // Ensure the caller owns the VerifiedPractitionerNFT
        require(nft.balanceOf(msg.sender) > 0, "NFT required to register");

        // Ensure the caller is not already registered
        require(
            bytes(practitioners[msg.sender].aliasName).length == 0,
            "Already registered"
        );

        // Save the practitioner's data into the mapping
        practitioners[msg.sender] = Practitioner({
            aliasName: _aliasName,
            specialty: _specialty,
            region: _region,
            isActive: true // Newly registered practitioners are active by default
        });

        // Emit registration event
        emit PractitionerRegistered(msg.sender, _aliasName);
    }

    /**
     * Allows a practitioner to update their availability status.
     * For example, when they are not available for consultations.
     * 
     * @param _status Boolean flag to mark availability (true = active, false = unavailable)
     */
    function setAvailability(bool _status) external {
        // Ensure the caller is a registered practitioner
        require(
            bytes(practitioners[msg.sender].aliasName).length > 0,
            "Not registered"
        );

        // Update their status
        practitioners[msg.sender].isActive = _status;

        // Emit event to log the update
        emit StatusUpdated(msg.sender, _status);
    }

    /**
     * Returns the practitioner profile for a given address.
     * Useful for anonymous matching and public profiles.
     * 
     * @param _addr The wallet address of the practitioner
     * @return Practitioner struct containing alias, specialty, region, and status
     */
    function getPractitioner(
        address _addr
    ) external view returns (Practitioner memory) {
        return practitioners[_addr];
    }
}
