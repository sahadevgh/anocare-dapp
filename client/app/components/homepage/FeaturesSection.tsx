'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: 'AI Health Assistant',
    description: 'Get instant, confidential health advice powered by AI, available 24/7.',
  },
  {
    icon: <UserGroupIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: 'Verified AnoPros',
    description: 'Consult with certified healthcare professionals anonymously.',
  },
  {
    icon: <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: 'Blockchain Security',
    description: 'Your health data is encrypted and protected on the blockchain.',
  },
]

const FeaturesSection = () => {
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
            Why Choose Anocare?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the power of private, secure, and accessible healthcare at your fingertips.
          </p>
        </motion.div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection