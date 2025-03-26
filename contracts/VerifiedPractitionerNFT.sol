// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Import OpenZeppelin’s ERC721Enumerable for NFT functionality with built-in enumeration
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// Import Ownable to restrict minting functionality to the contract owner
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VerifiedPractitionerNFT
 * @dev This contract mints non-transferable NFTs to practitioners
 *      who have been manually verified by the Anocare team.
 *      Only the contract owner (you or a DAO admin) can mint.
 */
contract VerifiedPractitionerNFT is ERC721Enumerable, Ownable {
    // Tracks the next token ID to be minted
    uint256 public nextTokenId;

    /**
     * @dev Constructor sets up the NFT collection
     * - Name: "VerifiedPractitionerNFT"
     * - Symbol: "VPT"
     */
    constructor() ERC721("VerifiedPractitionerNFT", "VPT") Ownable(msg.sender) {}

    /**
     * @dev Mints a new NFT to the specified address.
     * - Only callable by the contract owner.
     * - Each NFT serves as a verification pass for practitioners.
     * 
     * @param to The wallet address of the verified practitioner
     */
    function mint(address to) external onlyOwner {
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }

    /**
     * @dev Utility function to check whether a user owns a verification NFT.
     * - Used by the Practitioner Registry to validate registration eligibility.
     * 
     * @param user The wallet address to check
     * @return Returns true if the user owns at least one verification NFT
     */
    function hasNFT(address user) external view returns (bool) {
        return balanceOf(user) > 0;
    }
}
