'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline'
import { Button } from '../ui/Button'

const BenefitsSection = () => {
  return (
    <section className="py-16 bg-blue-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Benefits for Everyone
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Whether you’re a patient seeking care or a professional offering expertise, Anocare has you covered.
          </p>
        </motion.div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="relative h-72 mb-6">
              <Image
                src="/images/anopatient.png"
                alt="Patient using Anocare"
                fill
                className="object-cover rounded-lg object-top"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">For Patients</h3>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                Anonymous consultations for maximum privacy
              </li>
              <li className="flex items-start">
                <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                Instant AI-driven health insights
              </li>
              <li className="flex items-start">
                <UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                Access to verified healthcare professionals
              </li>
            </ul>
            <Button
              asLink
              href="/consultation"
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start Consultation
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="relative h-72  mb-6">
              <Image
                src="/images/anopros.png"
                alt="AnoPro on Anocare"
                fill
                className="object-cover rounded-lg object-top" 
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">For AnoPros</h3>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                Earn tokens for your expertise
              </li>
              <li className="flex items-start">
                <DocumentCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                Streamlined verification process
              </li>
              <li className="flex items-start">
                <UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                Build your reputation anonymously
              </li>
            </ul>
            <Button
              asLink
              href="/anopro-apply"
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Become an AnoPro
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection