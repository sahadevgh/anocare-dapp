'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { Button } from '../ui/Button'

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Consult AI', href: '/consult' },
  { label: 'AnoPros', href: '/anopros' },
  { label: 'About', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy' },
]

const socialLinks = [
  { label: 'Twitter/X', href: 'https://x.com/anocare', icon: XMarkIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/anocare', icon: LinkIcon },
  { label: 'Discord', href: 'https://discord.gg/anocare', icon: LinkIcon },
]

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  alt="Anocare logo"
                  className="cursor-pointer"
                  fill
                  src="/logo.svg"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-blue-400">Anocare</span>
                <span className="text-xs text-gray-400">Private AI Health Consults</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Empowering private, secure healthcare with AI and blockchain technology.
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Button
                    asLink
                    href={link.href}
                    variant="ghost"
                    className="text-gray-300 hover:text-white dark:hover:text-blue-400 p-0 justify-start"
                  >
                    {link.label}
                  </Button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-blue-400 mr-2" />
                <a
                  href="mailto:support@anocare.com"
                  className="text-gray-300 hover:text-white dark:hover:text-blue-400"
                >
                  support@anocare.com
                </a>
              </li>
              <li className="flex items-center">
                <QuestionMarkCircleIcon className="h-5 w-5 text-blue-400 mr-2" />
                <Button
                  asLink
                  href="/support"
                  variant="ghost"
                  className="text-gray-300 hover:text-white dark:hover:text-blue-400 p-0 justify-start"
                >
                  Help Center
                </Button>
              </li>
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-300 hover:text-blue-400"
                  >
                    <Icon className="h-6 w-6" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-gray-800 text-center"
        >
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Anocare. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer