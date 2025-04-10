"use client";

import { useEffect, useRef, useState } from "react";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { useDisconnect, useAccount } from "wagmi";
import DropdownMenu from "./homepage/DropdownMenu";
import { useContractRead } from "wagmi";
import {
  VERIFIED_NFT_ADDRESS,
  ANOPASS_NFT_ADDRESS,
  ADMIN_WALLET,
} from "./constants/index";
import {
  AnoPassNFTContract_ABI,
  VerifiedAnoProNFTContract_ABI,
} from "./contracts/abis";
import { Chain } from "wagmi/chains";

type UserType = "user" | "premium" | "clinician" | "admin";

interface ConnectBtnProps {
  setIsLoggedIn: (value: boolean) => void;
  backgroundColor?: string;
  emoji?: string;
  isConnected: boolean;
  isConnecting: boolean;
  chain: Chain | null | [];
  address: string | undefined;
}

export const ConnectBtn = ({
  setIsLoggedIn,
  backgroundColor,
  emoji,
}: ConnectBtnProps) => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { disconnect } = useDisconnect();
  const { isConnected, isConnecting, address, chain } = useAccount();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isMounted = useRef(false);
  const [userType, setUserType] = useState<UserType>("user");

  // Read NFT balances
  const { data: isClinicianNFT } = useContractRead({
    address: VERIFIED_NFT_ADDRESS,
    abi: VerifiedAnoProNFTContract_ABI,
    functionName: "hasNFT",
    args: address ? [address] : undefined,
  });

  const { data: isPremiumNFT } = useContractRead({
    address: ANOPASS_NFT_ADDRESS,
    abi: AnoPassNFTContract_ABI,
    functionName: "isActive",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!address) {
      setUserType("user");
      return;
    }

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
    setIsLoggedIn(!!isConnected);
  }, [isConnected, setIsLoggedIn]);

  const handleConnectClick = () => {
    if (isConnected) {
      disconnect();
    }
    openConnectModal?.();
  };

  if (!isConnected) {
    return (
      <button
        className="btn btn-accent"
        onClick={handleConnectClick}
        disabled={isConnecting}
      >
        {isConnecting ? "Connecting..." : "Connect wallet"}
      </button>
    );
  }

  if (isConnected && !chain) {
    return (
      <button className="btn btn-warning" onClick={openChainModal}>
        Wrong network
      </button>
    );
  }

  return (
    <div className="max-w-5xl w-full flex gap-4 items-center justify-between relative">
      <div className="flex justify-center items-center rounded-full cursor-pointer">
        <div
          role="button"
          tabIndex={0}
          className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            backgroundColor,
            boxShadow: "0px 2px 2px 0px rgba(81, 98, 255, 0.20)",
          }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          onKeyDown={(e) => e.key === "Enter" && setDropdownOpen(!dropdownOpen)}
        >
          {emoji}
        </div>
      </div>

      {dropdownOpen && (
        <DropdownMenu
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          openAccountModal={openAccountModal}
          openChainModal={openChainModal}
          userType={userType}
        />
      )}
    </div>
  );
};
