'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const DemoSection = () => {
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
            See Anocare in Action
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Watch our short demo to discover how Anocare delivers private, secure, and accessible healthcare.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 relative aspect-video max-w-4xl mx-auto"
        >
          {/* Placeholder for video; replace with <video> when available */}
          <Image
            src="/images/demo-placeholder.png"
            alt="Anocare Demo Placeholder"
            fill
            className="rounded-lg shadow-lg object-cover"
          />
          {/* Uncomment to use video instead */}
          {/* <video
            controls
            poster="/images/demo-placeholder.png"
            className="rounded-lg shadow-lg w-full h-full"
          >
            <source src="/videos/anocare-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video> */}
        </motion.div>
      </div>
    </section>
  )
}

export default DemoSection