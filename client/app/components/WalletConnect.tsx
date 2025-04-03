"use client";

import { useEffect, useRef, useState } from "react";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
  Chain,
} from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
import DropdownMenu from "./homepage/DropdownMenu";
import { useContractRead } from 'wagmi';
import { PremiumPassNFT_ABI, VerifiedClinicianNFT_ABI } from "./contracts/abis";
import { VERIFIED_NFT_ADDRESS, PREMIUM_NFT_ADDRESS, ADMIN_WALLET} from "./constants/index";

interface ConnectBtnProps {
  setIsLoggedIn: (value: boolean) => void;
  backgroundColor?: string;
  emoji?: string;
  isConnecting?: boolean;
  isConnected?: boolean;
  address?: string;
  chain?: Chain | [] | undefined;
}

export const ConnectBtn = ({ 
  setIsLoggedIn
  , backgroundColor, emoji, isConnecting, isConnected, chain, address
 }: ConnectBtnProps) => {

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { disconnect } = useDisconnect();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isMounted = useRef(false);

  const [userType, setUserType] = useState("user");

  // ✅ Read NFT balances
  const { data: isClinicianNFT } = useContractRead({
    address: VERIFIED_NFT_ADDRESS,
    abi: VerifiedClinicianNFT_ABI,
    functionName: "hasNFT",
    args: [address],
  });
  
  const { data: isPremiumNFT } = useContractRead({
    address: PREMIUM_NFT_ADDRESS,
    abi: PremiumPassNFT_ABI,
    functionName: "isActive", 
    args: [address],
  });
  

  useEffect(() => {
    if (!address) return;
  
    if (address.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
      setUserType("admin");
    } else if (isClinicianNFT) {
      setUserType("clinician");
    } else if (isPremiumNFT) {
      setUserType("premium");
    } else {
      setUserType("user");
    }
  }, [address, isClinicianNFT, isPremiumNFT]);
  

  useEffect(() => {
    isMounted.current = true;
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <button
        className="btn btn-accent"
        onClick={async () => {
          // Disconnecting wallet first because sometimes when is connected but the user is not connected
          if (isConnected) {
            disconnect();
          }
          openConnectModal?.();
        }}
        disabled={isConnecting}
      >
        { isConnecting ? 'Connecting...' : 'Connect wallet' }
      </button>
    );
  }

  if (isConnected && !chain) {
    return (
      <button className="btn" onClick={openChainModal}>
        Wrong network
      </button>
    );
  }

  return (
    <div className="max-w-5xl w-full flex gap-4 items-center justify-between">
      <div
        className="flex justify-center items-center rounded-full cursor-pointer"
      >
        <div
          role="button"
          tabIndex={1}
          className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            backgroundColor,
            boxShadow: "0px 2px 2px 0px rgba(81, 98, 255, 0.20)",
          }}
          onClick={async () => setDropdownOpen(!dropdownOpen)}
        >
          {emoji}
        </div>
      </div>
      {/* <button className="text-white dark:text-white" onClick={openChainModal}>
        {Array.isArray(chain) || !chain ? "Unknown Chain" : chain.name}
      </button> */}
  {
    dropdownOpen && (
      <DropdownMenu
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        openAccountModal={openAccountModal}
        openChainModal={openChainModal}
        userType={userType}
      />
    )
  }
</div>
  );
};