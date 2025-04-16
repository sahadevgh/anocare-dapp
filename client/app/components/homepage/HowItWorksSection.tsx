'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  WalletIcon,
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline'

const steps = [
  {
    step: '1',
    title: 'Connect Wallet',
    description: 'Securely connect your crypto wallet to access Anocare’s services.',
    icon: <WalletIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
  },
  {
    step: '2',
    title: 'Choose Your Care',
    description: 'Select an AI consultation or connect with a verified AnoPro.',
    icon: <UserGroupIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
  },
  {
    step: '3',
    title: 'Get Support',
    description: 'Receive private, secure health advice and pay with platform tokens.',
    icon: <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
  },
]

const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            How Anocare Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get started with private healthcare in just a few simple steps.
          </p>
        </motion.div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <div className="absolute -top-4 left-4 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {step.step}
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection