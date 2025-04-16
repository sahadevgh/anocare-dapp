'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/utils/Toast'
import { Button } from '../ui/Button'
import { ConnectBtn } from '../WalletConnect'


const CTASection = () => {
  const { isConnected } = useAccount()
  const router = useRouter()
  const { toast } = useToast()

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
    <section className="py-16 bg-blue-600 dark:bg-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Experience Private Healthcare?
          </h2>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            Join Anocare today and connect with verified professionals securely and anonymously.
          </p>
          <div className="mt-8">
            {isConnected ? (
              <Button
                onClick={handleGetStarted}
                className="bg-white text-blue-600 hover:bg-gray-100"
                size="lg"
              >
                Go to Dashboard
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <ConnectBtn />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection