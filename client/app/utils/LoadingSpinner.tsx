import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <motion.div
      className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}