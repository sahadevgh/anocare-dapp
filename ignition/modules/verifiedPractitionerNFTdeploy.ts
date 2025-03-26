// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AnocareModule = buildModule("VerifiedPractitionerNFTModule", (m) => {

  const verifiedPractitionerNFT = m.contract("VerifiedPractitionerNFT");

  return { verifiedPractitionerNFT };
});

export default AnocareModule;
