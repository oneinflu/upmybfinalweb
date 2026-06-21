import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'

interface SidebarProps {
  open?: boolean
  onClose?: () => void
  className?: string
  children?: React.ReactNode
}

export function Sidebar({ open = true, onClose, className, children }: SidebarProps) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.32, 0.72, 0, 1] }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            key="sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              'fixed left-0 top-0 bottom-0 z-40 w-60',
              'flex flex-col',
              'bg-[var(--surface-1)]',
              'border-r border-[var(--border-2)]',
              'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
              className
            )}
          >
            {children}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
