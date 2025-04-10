import { ethers, InterfaceAbi } from "ethers";

export const ANOCARE_CONTRACT_ADDRESS =
  "0x3454964767B40745003aA9B468466a92c817B3e5";
export const VERIFIED_NFT_ADDRESS =
  "0xCc79ae08fee9107aa02Cc8Aca267ea14bbFbE8B9";
export const ANOPASS_NFT_ADDRESS =
  "0xBF531A98e80CdA1eD5d1984b0d7A039177918454";
export const ADMIN_WALLET = "0x6D108C5084c378E7e74531424f5eeE0b7c34fD59";

export const getContract = async (
  Contract_Address: string,
  abi: InterfaceAbi
) => {
  if (typeof window !== "undefined" && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(Contract_Address, abi, signer);
    return contract;
  } else {
    console.error("Ethereum provider not found");
    return null;
  }
};
