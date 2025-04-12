import { ethers, InterfaceAbi } from "ethers";
import { AnoToken_ABI } from "../contracts/abis";


export const ANOCARE_CONTRACT_ADDRESS =
  "0x95da2040CA6dC80D1b0D8C4c3dcE05B649554190";
export const VERIFIED_NFT_ADDRESS =
  "0xCc79ae08fee9107aa02Cc8Aca267ea14bbFbE8B9";
export const ANOPASS_NFT_ADDRESS =
  "0xBF531A98e80CdA1eD5d1984b0d7A039177918454";
export const ADMIN_WALLET = "0x6D108C5084c378E7e74531424f5eeE0b7c34fD59";
export const ANO_TOKEN_ADDRESS="0x48450BD5beDfa81eE01CE9C5B5eA078ECD4C0aAD"



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


export const checkAnoTokenBalance = async (userAddress: string): Promise<boolean> => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const tokenContract = new ethers.Contract(ANO_TOKEN_ADDRESS, AnoToken_ABI, signer);

  const [rawBalance, decimals] = await Promise.all([
    tokenContract.balanceOf(userAddress),
    tokenContract.decimals(),
  ]);

  const balance = Number(ethers.formatUnits(rawBalance, decimals));
  return balance >= 100;
};

