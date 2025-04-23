'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline'
import { useAccount } from 'wagmi'
import { emojiAvatarForAddress } from '@/app/lib/emojiAvatarForAddress'
import { Button } from './ui/Button'
import { ConnectBtn } from './WalletConnect'

type HeaderMenuLink = {
  label: string
  href: string
  icon?: React.ReactNode
}

export const menuLinks: HeaderMenuLink[] = [
  {
    label: 'Home',
    href: '/',
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    label: 'Consult AI',
    href: '/consult/anoAI',
    icon: <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />,
  },
  {
    label: 'AnoPros',
    href: '/anopros',
    icon: <ShieldCheckIcon className="h-5 w-5" />,
  },
  {
    label: 'Litepaper',
    href: '/litepaper',
    icon: <DocumentIcon className="h-5 w-5" />,
  },
]

export const HeaderMenuLinks = () => {
  const pathname = usePathname()

  return (
    <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-2 space-y-2 lg:space-y-0">
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href
        return (
          <li key={href}>
            <Button
              asLink
              href={href}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full lg:w-auto justify-start lg:justify-center ${
                isActive
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{icon}</span>
              {label}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const pathname = usePathname()
  const { address, isConnected } = useAccount();
  const { color: backgroundColor, emoji } = emojiAvatarForAddress(address ?? '');

  useEffect(() => {
    setIsDrawerOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              {isDrawerOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Logo and desktop navigation */}
          <div className="flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  alt="Anocare logo"
                  className="cursor-pointer"
                  fill
                  src="/logo.svg"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                  Anocare
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Private AI Health Consults
                </span>
              </div>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex">
              <HeaderMenuLinks />
            </nav>

            {/* Wallet connect */}
            <ConnectBtn
              backgroundColor={backgroundColor}
              emoji={emoji}
              isConnected={isConnected}
              address={address}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white dark:bg-gray-900 shadow-md"
          >
            <div className="px-4 py-4">
              <HeaderMenuLinks />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}