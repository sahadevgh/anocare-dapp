// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Import the NFT contract that acts as a verification layer.
// Only users holding this NFT can register as Clinicians.
import "./VerifiedClinicianNFT.sol";

// Main contract for registering health Clinicians on the Anocare platform.
contract ClinicianRegistry {
    // Reference to the deployed NFT contract used for verification
    VerifiedClinicianNFT public nft;

    // Constructor receives the address of the NFT contract when deploying
    constructor(address _nftAddress) {
        nft = VerifiedClinicianNFT(_nftAddress);
    }

    // Structure that defines a Clinician's profile
    struct Clinician {
        address wallet;
        uint256 rating;
        uint256 totalCases;
    }

    // Mapping to store each Clinician's data using their wallet address
    mapping(address => Clinician) public clinicians;

    // Emitted when a new Clinician is successfully registered
    event ClinicianRegistered(address indexed Clinician);

    /**
     * Registers a verified Clinician.
     * Requirements:
     * - Caller must own a verification NFT.
     * - Caller must not be already registered.
     */
    function registerClinician() external {
        // Ensure the caller owns the VerifiedClinicianNFT
        require(nft.balanceOf(msg.sender) > 0, "NFT required to register");

        // Ensure the caller is not already registered
        require(clinicians[msg.sender].wallet != msg.sender, "Already registered");

        // Save the Clinician's data into the mapping
        clinicians[msg.sender] = Clinician({
            wallet: msg.sender,
            rating: 0, 
            totalCases: 0
            });

        // Emit registration event
        emit ClinicianRegistered(msg.sender);
    }

    /**
     * Returns the Clinician profile for a given address.
     * Useful for anonymous matching and public profiles.
     *
     * @param _addr The wallet address of the Clinician
     * @return Clinician struct containing alias, specialty, region, and status
     */
    function getClinician(
        address _addr
    ) external view returns (Clinician memory) {
        return clinicians[_addr];
    }
}
