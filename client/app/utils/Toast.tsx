'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
      setToasts((t) => [...t, { id: Date.now().toString(), title, description, variant }])
    },
    []
  )

  const removeToast = (id: string) => {
    setToasts((t) => t.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`p-4 rounded-lg shadow-lg ${
                t.variant === 'destructive'
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              <h3 className="font-semibold">{t.title}</h3>
              {t.description && <p className="text-sm">{t.description}</p>}
              <button
                className="mt-2 text-sm underline"
                onClick={() => removeToast(t.id)}
              >
                Dismiss
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

import { createContext, useContext } from 'react'

const ToastContext = createContext<{
  toast: (toast: Omit<Toast, 'id'>) => void
}>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}