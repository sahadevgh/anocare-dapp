'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LayoutDashboard, Network, UserPlus } from 'lucide-react'
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

  const handleNavigation = (href: string) => {
    setDropdownOpen(false)
    router.push(href)
  }

  function toast({ title, description, variant }: { title: string; description: string; variant: string }) {
    console.log(`[${variant.toUpperCase()}] ${title}: ${description}`)
  }

  // Animation variants for the dropdown and items
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.2 },
    }),
  }

  return (
    <AnimatePresence>
      {dropdownOpen && (
        <motion.div
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-50 top-12 
            border border-gray-200 dark:border-gray-800 overflow-hidden 
            bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-2 flex flex-col items-start justify-start">
            <motion.div custom={0} variants={itemVariants} role="menuitem">
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 
                  hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 
                  transition-colors duration-200"
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
                <User className="w-4 h-4" />
                Account
              </Button>
            </motion.div>

            <motion.div custom={1} variants={itemVariants} role="menuitem">
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 
                  hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 
                  transition-colors duration-200"
                onClick={() => handleNavigation(`/dashboards/${userType}-dashboard`)}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </motion.div>

            <motion.div custom={2} variants={itemVariants} role="menuitem">
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 
                  hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 
                  transition-colors duration-200"
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
                <Network className="w-4 h-4" />
                Switch Network
              </Button>
            </motion.div>

            {userType === 'user' && (
              <motion.div custom={3} variants={itemVariants} role="menuitem">
                <Button
                  variant="ghost"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 
                    hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 
                    transition-colors duration-200"
                  onClick={() => handleNavigation('/anopro-apply')}
                >
                  <UserPlus className="w-4 h-4" />
                  Become an AnoPro
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}