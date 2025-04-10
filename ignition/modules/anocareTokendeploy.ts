// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AnocareTokenModule = buildModule("AnocareTokenModule", (m) => {
  const anocareTokenContract = m.contract("AnocareToken");

  // The contract deployment will return an object containing the deployed contract instance
  // This instance can be used to interact with the contract after deployment
  return { anocareTokenContract };
});

export default AnocareTokenModule;
