import { ethers, InterfaceAbi } from "ethers";

export const VERIFIED_NFT_ADDRESS =
  "0x1234567890abcdef1234567890abcdef12345678";
export const PREMIUM_NFT_ADDRESS =
  "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef";
export const ADMIN_WALLET = "0xfe7B7d58Fb369976B46599e561219342b4bF14F2";

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
