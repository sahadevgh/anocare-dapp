// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PremiumMembershipNFT
 * @dev Soulbound NFT pass for Anocare premium members.
 */
contract PremiumMembershipNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    uint256 public membershipDuration = 30 days;
    uint256 public membershipPrice = 0.01 ether;

    struct Membership {
        uint256 tokenId;
        uint256 expiresAt;
    }

    mapping(address => Membership) public memberships;

    event MembershipPurchased(address indexed user, uint256 tokenId, uint256 expiresAt);
    event MembershipRenewed(address indexed user, uint256 tokenId, uint256 newExpiry);

    constructor() ERC721("Anocare Premium Pass", "ANOPASS") Ownable(msg.sender){}

    function purchaseMembership() external payable {
        require(msg.value >= membershipPrice, "Insufficient payment");

        if (isActive(msg.sender)) {
            _extendMembership(msg.sender);
            return;
        }

        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);

        uint256 expiresAt = block.timestamp + membershipDuration;
        memberships[msg.sender] = Membership(tokenId, expiresAt);

        nextTokenId++;

        emit MembershipPurchased(msg.sender, tokenId, expiresAt);
    }

    function renewMembership() external payable {
        require(msg.value >= membershipPrice, "Insufficient payment");
        require(ownerOf(memberships[msg.sender].tokenId) == msg.sender, "Not the token owner");

        _extendMembership(msg.sender);
    }

    function _extendMembership(address user) internal {
        memberships[user].expiresAt += membershipDuration;
        emit MembershipRenewed(user, memberships[user].tokenId, memberships[user].expiresAt);
    }

    function isActive(address user) public view returns (bool) {
        return memberships[user].expiresAt > block.timestamp;
    }

    function getExpiry(address user) external view returns (uint256) {
        return memberships[user].expiresAt;
    }

    // ✅ Use _update instead of _beforeTokenTransfer to block transfers
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        // Only allow minting (from == address(0))
        address from = _ownerOf(tokenId);
        require(from == address(0), "Membership NFT is non-transferable");
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _increaseBalance(address account, uint128 amount) internal override {
        super._increaseBalance(account, amount);
    }

    function setMembershipPrice(uint256 price) external onlyOwner {
        membershipPrice = price;
    }

    function setMembershipDuration(uint256 duration) external onlyOwner {
        membershipDuration = duration;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
