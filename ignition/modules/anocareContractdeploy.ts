// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AnocareContractModule = buildModule("AnocareContractModule", (m) => {
  // Define the contract addresses for the NFTs
  // These addresses should be replaced with the actual deployed contract addresses
  const VerifiedAnoProNFT_ADDRESS = "0xCc79ae08fee9107aa02Cc8Aca267ea14bbFbE8B9";
  const Anopass_NFT_ADDRESS = "0xBF531A98e80CdA1eD5d1984b0d7A039177918454";
  const AnocareToken_ADDRESS = "0x48450BD5beDfa81eE01CE9C5B5eA078ECD4C0aAD";

  // Deploy the AnocareContract contract with the specified NFT addresses
  // The contract constructor should accept the addresses as parameters
  const anocareContract = m.contract("AnocareContract", [
    VerifiedAnoProNFT_ADDRESS,
    Anopass_NFT_ADDRESS,
    AnocareToken_ADDRESS
  ]);

  // The contract deployment will return an object containing the deployed contract instance
  // This instance can be used to interact with the contract after deployment
  return { anocareContract };
});

export default AnocareContractModule;
