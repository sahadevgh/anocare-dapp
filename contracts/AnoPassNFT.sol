// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Premium NFT
 * @dev Soulbound NFT pass for Anocare premium members.
 */
contract AnoPassNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    uint256 public membershipDuration = 90 days;
    uint256 public membershipPrice = 0.01 ether;

    struct Membership {
        address _address;
        uint256 tokenId;
        uint256 expiresAt;
    }

    mapping(address => Membership) public memberships;
    address[] public users;

    event MembershipPurchased(
        address indexed user,
        uint256 tokenId,
        uint256 expiresAt
    );
    event MembershipRenewed(
        address indexed user,
        uint256 tokenId,
        uint256 newExpiry
    );

    constructor()
        ERC721("Anocare Premium Pass", "ANOPASS")
        Ownable(msg.sender)
    {}

    function purchaseMembership() external payable {
        require(msg.value >= membershipPrice, "Insufficient payment");

        if (isActive(msg.sender)) {
            _extendMembership(msg.sender);
            return;
        }

        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);

        uint256 expiresAt = block.timestamp + membershipDuration;
        memberships[msg.sender] = Membership(msg.sender, tokenId, expiresAt);
        users.push(msg.sender);

        nextTokenId++;

        emit MembershipPurchased(msg.sender, tokenId, expiresAt);
    }

    // Function to renew membership
    function renewMembership() external payable {
        require(msg.value >= membershipPrice, "Insufficient payment");
        require(
            ownerOf(memberships[msg.sender].tokenId) == msg.sender,
            "Not the token owner"
        );

        _extendMembership(msg.sender);
    }

    // Internal function to extend membership
    function _extendMembership(address user) internal {
        memberships[user].expiresAt += membershipDuration;
        emit MembershipRenewed(
            user,
            memberships[user].tokenId,
            memberships[user].expiresAt
        );
    }

    // Function to check if a user has an active membership
    function isActive(address user) public view returns (bool) {
        return memberships[user].expiresAt > block.timestamp;
    }

    // Function to get the token ID of a user's membership
    function getExpiry(address user) external view returns (uint256) {
        return memberships[user].expiresAt;
    }

    // Use _update instead of _beforeTokenTransfer to block transfers
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

    // Override supportsInterface to include ERC721
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Override _beforeTokenTransfer to block transfers
    function _increaseBalance(
        address account,
        uint128 amount
    ) internal override {
        super._increaseBalance(account, amount);
    }

    // Override _beforeTokenTransfer to block transfers
    function setMembershipPrice(uint256 price) external onlyOwner {
        membershipPrice = price;
    }

    // Function to set the membership duration
    function setMembershipDuration(uint256 duration) external onlyOwner {
        membershipDuration = duration;
    }

    // Function to withdraw contract balance
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function batchBurnExpired(uint256 limit) external {
        uint256 count = 0;
        for (uint256 i = 0; i < users.length && count < limit; i++) {
            address user = users[i];
            Membership memory membership = memberships[user];

            // Check if the membership has expired
            // and the user has a tokenId
            if (
                membership.expiresAt < block.timestamp &&
                memberships[user].tokenId != 0
            ) {
                _burn(membership.tokenId);
                delete memberships[user];
                count++;
            }
        }
    }
}
