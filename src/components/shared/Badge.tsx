import { cn } from '@/lib/cn'

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger'

interface BadgeProps {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  className?: string
  children: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--surface-3)] text-[var(--text-2)]',
  accent:  'bg-[var(--accent-dim)] text-[var(--accent-text)]',
  success: 'bg-[var(--success-dim)] text-[var(--success)]',
  warning: 'bg-[var(--warning)]/10 text-[var(--warning)]',
  danger:  'bg-[var(--danger)]/10 text-[var(--danger)]',
}

export function Badge({
  variant = 'default',
  size = 'sm',
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-[var(--r-full)]',
        size === 'sm'
          ? 'px-2 py-0.5 text-[var(--text-xs)]'
          : 'px-2.5 py-1 text-[var(--text-sm)]',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
