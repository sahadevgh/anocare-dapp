// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// This module is responsible for deploying the VerifiedPractitionerNFT smart contract
const VerifiedAnoProNFTModule = buildModule("VerifiedAnoProNFTModule", (m) => {
  
  // Define the base URI for the NFT metadata
  // This should point to the location where the metadata for the NFTs is stored
  // For example, if you're using IPFS, it might look something like this:
  const baseURI = "ipfs://bafkreibtuytqsg7uzev6qbysirbvx7ie2unvt3bvyypu43a4kwslmy3zpa";

  // Deploy the VerifiedPractitionerNFT contract with the specified base URI
  // The contract constructor should accept the base URI as a parameter
  const verifiedAnoProNFT = m.contract("VerifiedAnoProNFT", [baseURI]);

  // The contract deployment will return an object containing the deployed contract instance
  // This instance can be used to interact with the contract after deployment
  return { verifiedAnoProNFT };
});

export default VerifiedAnoProNFTModule;
