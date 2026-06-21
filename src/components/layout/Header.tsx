import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface HeaderProps {
  className?: string
  children?: React.ReactNode
}

export function Header({ className, children }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        'sticky top-0 z-40 h-16 w-full',
        'flex items-center px-8 gap-3',
        'border-b border-[var(--border-2)]',
        'bg-[rgba(12,12,14,0.88)] backdrop-blur-md',
        className
      )}
    >
      {children}
    </motion.header>
  )
}
