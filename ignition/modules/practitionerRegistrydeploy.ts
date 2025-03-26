// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AnocareModule = buildModule("PractitionerRegistryModule", (m) => {

  const VerifiedPractitionerNFT_ADDRESS = "";

  const practitionerRegistry = m.contract("PractitionerRegistry", [VerifiedPractitionerNFT_ADDRESS]);

  return { practitionerRegistry };
});

export default AnocareModule;
