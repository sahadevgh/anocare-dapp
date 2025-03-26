import { expect } from "chai";
import { ethers } from "hardhat";
import { PractitionerRegistry, VerifiedPractitionerNFT } from "../typechain-types";

describe("PractitionerRegistry", function () {
  let registry: PractitionerRegistry;
  let nft: VerifiedPractitionerNFT;

  let owner: any;
  let practitioner: any;
  let unverifiedUser: any;

  beforeEach(async () => {
    [owner, practitioner, unverifiedUser] = await ethers.getSigners();
  
    const NFT = await ethers.getContractFactory("VerifiedPractitionerNFT");
    nft = (await NFT.connect(owner).deploy()) as VerifiedPractitionerNFT;
    await nft.waitForDeployment(); // Wait for the contract to be deployed
    const nftAddress = await nft.getAddress();
  
    await nft.connect(owner).mint(practitioner.address);
  
    const Registry = await ethers.getContractFactory("PractitionerRegistry");
    registry = (await Registry.deploy(nftAddress)) as PractitionerRegistry;
    await registry.waitForDeployment();
  });
  

  it("Should not allow unverified (non-NFT holder) user to register", async () => {
    await expect(
      registry.connect(unverifiedUser).registerPractitioner(
        "FakeDoc",
        "Fake Specialty",
        "Nowhere"
      )
    ).to.be.reverted;
  });

  it("Should allow verified practitioner to register", async () => {
    await registry.connect(practitioner).registerPractitioner(
      "Dr. ZK",
      "Dermatology",
      "West Africa"
    );

    const stored = await registry.practitioners(practitioner.address);

    expect(stored.aliasName).to.equal("Dr. ZK");
    expect(stored.specialty).to.equal("Dermatology");
    expect(stored.region).to.equal("West Africa");
    expect(stored.isActive).to.equal(true);
  });

  it("Should not allow the same practitioner to register twice", async () => {
    await registry.connect(practitioner).registerPractitioner(
      "Dr. OneTime",
      "General",
      "Accra"
    );

    await expect(
      registry.connect(practitioner).registerPractitioner(
        "Dr. Again",
        "Pediatrics",
        "Kumasi"
      )
    ).to.be.revertedWith("Already registered");
  });

  it("Should allow registered practitioner to change availability status", async () => {
    await registry.connect(practitioner).registerPractitioner(
      "Dr. Ava",
      "Oncology",
      "Lagos"
    );

    await registry.connect(practitioner).setAvailability(false);

    const updated = await registry.practitioners(practitioner.address);
    expect(updated.isActive).to.equal(false);
  });

  it("Should not allow unregistered users to change status", async () => {
    await expect(
      registry.connect(unverifiedUser).setAvailability(true)
    ).to.be.revertedWith("Not registered");
  });

  it("Should return practitioner data using getPractitioner()", async () => {
    await registry.connect(practitioner).registerPractitioner(
      "Dr. View",
      "Cardiology",
      "Tamale"
    );

    const info = await registry.getPractitioner(practitioner.address);
    expect(info.aliasName).to.equal("Dr. View");
    expect(info.specialty).to.equal("Cardiology");
  });
});
