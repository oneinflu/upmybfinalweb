import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLMotionProps<'div'> {
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
}

export function Card({
  interactive = false,
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={interactive ? { opacity: 0.92 } : undefined}
      transition={{ duration: 0.12, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        'rounded-[var(--r-lg)]',
        'bg-[var(--surface-2)]',
        'border border-[var(--border-2)]',
        interactive && 'cursor-pointer',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
