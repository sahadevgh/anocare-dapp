import { expect } from "chai";
import { ethers } from "hardhat";
import { VerifiedPractitionerNFT } from "../typechain-types";

describe("VerifiedPractitionerNFT", function () {
  let nft: VerifiedPractitionerNFT;
  let owner: any;
  let practitioner: any;
  let otherUser: any;

  beforeEach(async function () {
    [owner, practitioner, otherUser] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("VerifiedPractitionerNFT");
    const deployedNFT = await NFT.connect(owner).deploy();
    nft = deployedNFT as VerifiedPractitionerNFT;
  });

  it("Should deploy with the correct name and symbol", async function () {
    expect(await nft.name()).to.equal("VerifiedPractitionerNFT");
    expect(await nft.symbol()).to.equal("VPT");
  });

  it("Should allow owner to mint an NFT", async function () {
    await nft.connect(owner).mint(practitioner.address);
    expect(await nft.balanceOf(practitioner.address)).to.equal(1);
    expect(await nft.ownerOf(0)).to.equal(practitioner.address);
  });

  it("Should not allow non-owner to mint", async function () {
    await expect(
      nft.connect(otherUser).mint(otherUser.address)
    ).to.be.reverted;
  });

  it("Should return true from hasNFT() if user owns one", async function () {
    await nft.connect(owner).mint(practitioner.address);
    expect(await nft.hasNFT(practitioner.address)).to.equal(true);
  });

  it("Should return false from hasNFT() if user owns none", async function () {
    expect(await nft.hasNFT(practitioner.address)).to.equal(false);
  });
});
