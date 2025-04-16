'use client'

import { useEffect, useRef, useState } from 'react'
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from '@rainbow-me/rainbowkit'
import { useDisconnect, useAccount, useContractRead } from 'wagmi'
import { motion } from 'framer-motion'
import { useToast } from '../utils/Toast'
import { ADMIN_WALLET, ANOPASS_NFT_ADDRESS, VERIFIED_NFT_ADDRESS } from './constants'
import { AnoPassNFTContract_ABI, VerifiedAnoProNFTContract_ABI } from './contracts/abis'
import { Button } from './ui/Button'
import { LoadingSpinner } from '../utils/LoadingSpinner'
import DropdownMenu from './homepage/DropdownMenu'




type UserType = 'user' | 'premium' | 'anopro' | 'admin'

interface ConnectBtnProps {
  backgroundColor?: string
  emoji?: string
  isConnected: boolean
  address: string | undefined
}

export const ConnectBtn = ({
  backgroundColor,
  emoji,
  isConnected,
  address,
}: ConnectBtnProps) => {
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal()
  const { disconnect } = useDisconnect()
  const { isConnecting, chain } = useAccount()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const isMounted = useRef(false)
  const [userType, setUserType] = useState<UserType>('user')
  const { toast } = useToast()

  // Read NFT balances
  const { data: isClinicianNFT } = useContractRead({
    address: VERIFIED_NFT_ADDRESS,
    abi: VerifiedAnoProNFTContract_ABI,
    functionName: 'hasNFT',
    args: address ? [address] : undefined,
  })

  const { data: isPremiumNFT } = useContractRead({
    address: ANOPASS_NFT_ADDRESS,
    abi: AnoPassNFTContract_ABI,
    functionName: 'isActive',
    args: address ? [address] : undefined,
  })

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (!address) {
      setUserType('user')
      return
    }

    if (address.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
      setUserType('admin')
    } else if (isClinicianNFT) {
      setUserType('anopro')
    } else if (isPremiumNFT) {
      setUserType('premium')
    } else {
      setUserType('user')
    }
  }, [address, isClinicianNFT, isPremiumNFT])

  const handleConnectClick = async () => {
    if (isConnected) {
      try {
        disconnect()
        toast({
          title: 'Disconnected',
          description: 'Wallet has been disconnected.',
        })
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to disconnect wallet.',
          variant: 'destructive',
        })
      }
      return
    }
    try {
      await openConnectModal?.()
      toast({
        title: 'Connected',
        description: 'Wallet connected successfully.',
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to connect wallet.',
        variant: 'destructive',
      })
    }
  }

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnectClick}
        disabled={isConnecting}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isConnecting ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner />
            Connecting...
          </div>
        ) : (
          'Connect Wallet'
        )}
      </Button>
    )
  }

  if (isConnected && !chain) {
    return (
      <Button
        onClick={openChainModal}
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        Wrong Network
      </Button>
    )
  }

  return (
    <div className="relative">
      <motion.div
        role="button"
        tabIndex={0}
        className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer"
        style={{
          backgroundColor,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onKeyDown={(e) => e.key === 'Enter' && setDropdownOpen(!dropdownOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-xl">{emoji}</span>
      </motion.div>

      <DropdownMenu
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        openAccountModal={openAccountModal}
        openChainModal={openChainModal}
        userType={userType}
      />
    </div>
  )
}