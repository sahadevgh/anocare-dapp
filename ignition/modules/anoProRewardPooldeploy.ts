// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AnoProRewardPoolModule = buildModule("AnoProRewardPoolModule", (m) => {
  // Define the contract addresses for the NFTs and Anocare
  // These addresses should be replaced with the actual deployed contract addresses
  const AnoPassNFT_Contract_Address = "0xBF531A98e80CdA1eD5d1984b0d7A039177918454";
  const VerifiedAnoProNFT_Contract_Address = "0xCc79ae08fee9107aa02Cc8Aca267ea14bbFbE8B9";
  const AnocareContract_Address = "0x3454964767B40745003aA9B468466a92c817B3e5";

  // Deploy the AnoProRewardPool contract with the specified NFT and Anocare addresses
  // The contract constructor should accept the addresses as parameters
  const anoProRewardPoolContract = m.contract("AnoProRewardPool", [
    AnoPassNFT_Contract_Address,
    VerifiedAnoProNFT_Contract_Address,
    AnocareContract_Address,
  ]);

  // The contract deployment will return an object containing the deployed contract instance
  // This instance can be used to interact with the contract after deployment
  return { anoProRewardPoolContract };
});

export default AnoProRewardPoolModule;
