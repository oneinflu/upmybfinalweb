import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
>

interface ButtonProps extends NativeButtonProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary: [
    'bg-[var(--accent)] text-white',
    'hover:bg-[var(--accent-hover)]',
  ].join(' '),
  secondary: [
    'bg-[var(--surface-2)] text-[var(--text-1)]',
    'border border-[var(--border-2)]',
    'hover:bg-[var(--surface-3)] hover:border-[var(--border-3)]',
  ].join(' '),
  ghost: [
    'text-[var(--text-2)]',
    'hover:text-[var(--text-1)] hover:bg-[var(--surface-2)]',
  ].join(' '),
  danger: [
    'bg-[var(--danger)]/10 text-[var(--danger)]',
    'border border-[var(--danger)]/20',
    'hover:bg-[var(--danger)]/20',
  ].join(' '),
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-7 px-3 text-[var(--text-sm)] gap-1.5 rounded-[var(--r-sm)]',
  md: 'h-8 px-3.5 text-[var(--text-base)] gap-2 rounded-[var(--r-md)]',
  lg: 'h-9 px-4 text-[var(--text-md)] gap-2 rounded-[var(--r-md)]',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1, ease: [0.32, 0.72, 0, 1] }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'cursor-pointer select-none whitespace-nowrap',
        'disabled:opacity-40 disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Spinner />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {iconRight && !loading && (
        <span className="shrink-0">{iconRight}</span>
      )}
    </motion.button>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <circle
        cx="7" cy="7" r="5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="28"
        strokeDashoffset="20"
      />
    </svg>
  )
}
