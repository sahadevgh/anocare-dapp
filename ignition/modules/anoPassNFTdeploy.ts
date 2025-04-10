// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AnoPassNFTModule = buildModule("AnoPassNFTModule", (m) => {
  const anoPassNFTContract = m.contract("AnoPassNFT");

  // The contract deployment will return an object containing the deployed contract instance
  // This instance can be used to interact with the contract after deployment
  return { anoPassNFTContract };
});

export default AnoPassNFTModule;
