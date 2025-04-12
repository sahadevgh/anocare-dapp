// app/backend/utils/getServerContract.ts
import { ethers } from "ethers";
import { ANOCARE_CONTRACT_ADDRESS } from "@/app/components/constants";
import { AnoCareContract_ABI } from "@/app/components/contracts/abis";

const ARSRPC_URL = `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

export async function getServerContract() {
  if (!ARSRPC_URL) {
    throw new Error("Missing ARBITRUM_RPC_URL in environment variables");
  }

  const provider = new ethers.JsonRpcProvider(ARSRPC_URL);
  return new ethers.Contract(
    ANOCARE_CONTRACT_ADDRESS,
    AnoCareContract_ABI,
    provider
  );
}