'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/app/utils/Toast'
import { Button } from '../ui/Button'

type DropdownMenuProps = {
  dropdownOpen: boolean
  setDropdownOpen: (value: boolean) => void
  openAccountModal?: () => void
  openChainModal?: () => void
  userType: string
}

export default function DropdownMenu({
  dropdownOpen,
  setDropdownOpen,
  openAccountModal,
  openChainModal,
  userType,
}: DropdownMenuProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleNavigation = (href: string) => {
    setDropdownOpen(false)
    router.push(href)
  }

  return (
    <AnimatePresence>
      {dropdownOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 top-10 border border-gray-200 dark:border-gray-700"
        >
          <div className="py-1">
            <Button
              variant="ghost"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={async () => {
                setDropdownOpen(false)
                try {
                  await openAccountModal?.()
                } catch {
                  toast({
                    title: 'Error',
                    description: 'Failed to open account modal',
                    variant: 'destructive',
                  })
                }
              }}
            >
              Account
            </Button>
            <Button
              variant="ghost"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleNavigation(`/dashboards/${userType}-dashboard`)}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={async () => {
                setDropdownOpen(false)
                try {
                  await openChainModal?.()
                } catch {
                  toast({
                    title: 'Error',
                    description: 'Failed to open chain modal',
                    variant: 'destructive',
                  })
                }
              }}
            >
              Switch Network
            </Button>
            {userType === 'user' && (
              <Button
                variant="ghost"
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleNavigation('/anopro-apply')}
              >
                Become an AnoPro
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}