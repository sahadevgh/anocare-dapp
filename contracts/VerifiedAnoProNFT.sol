// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title VerifiedAnoProNFT
 * @dev This contract mints non-transferable NFTs to AnoPros
 *      who have been manually verified by the AnoPro team.
 */
contract VerifiedAnoProNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    string private baseTokenURI;

    mapping(uint256 => address) private tokenOwners;

    constructor(string memory _baseTokenURI)
        ERC721("VerifiedAnoProNFT", "VAP")
        Ownable(msg.sender)
    {
        baseTokenURI = _baseTokenURI;
    }

    /**
     * @dev Mints a new NFT to the specified address.
     */
    function mint(address to) external onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        tokenOwners[tokenId] = to;
        nextTokenId++;
    }

    /**
     * @dev Checks if a user owns a verification NFT.
     */
    function hasNFT(address user) external view returns (bool) {
        return balanceOf(user) > 0;
    }

    /**
     * @dev Allows the contract owner to update the base token URI.
     */
    function setBaseTokenURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    /**
     * @dev Returns the full IPFS metadata URI for a given token.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenOwners[tokenId] != address(0), "NFT does not exist");
        return baseTokenURI;
    }

    /**
     * @dev Returns true if the AnoPro is verified.
     */
    function isVerified(address anoPro) external view returns (bool) {
        return balanceOf(anoPro) > 0;
    }
}
