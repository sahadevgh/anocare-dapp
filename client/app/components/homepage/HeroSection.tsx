'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/utils/Toast'
import { Button } from '../ui/Button'
import { ConnectBtn } from '../WalletConnect'
import { emojiAvatarForAddress } from '@/app/lib/emojiAvatarForAddress'


const HeroSection = () => {
  const {address, isConnected } = useAccount()
  const router = useRouter()
  const { toast } = useToast()
  const { color: backgroundColor, emoji } = emojiAvatarForAddress(address ?? '');


  const handleGetStarted = () => {
    if (isConnected) {
      router.push('/dashboard')
    } else {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to get started.',
      })
    }
  }

  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
        <motion.div
          className="absolute top-0 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-0 right-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              <span className="block">Anocare: Your</span>
              <span className="block text-blue-600 dark:text-blue-400">Private Healthcare</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto md:mx-0">
              Connect anonymously with verified health professionals and access AI-powered insights, secured by blockchain.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {isConnected ? (
                <Button
                  onClick={handleGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Go to Dashboard
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <ConnectBtn 
                  backgroundColor={backgroundColor}
                  emoji={emoji}
                  isConnected={isConnected}
                  address={address}
                />
              )}
              <Button
                asLink
                href="/anopros"
                variant="outline"
                size="lg"
                className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
              >
                Explore AnoPros
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <Image
              src="/images/anohero.png"
              alt="Anocare Healthcare Platform"
              width={500}
              height={400}
              className="rounded-lg shadow-lg"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection