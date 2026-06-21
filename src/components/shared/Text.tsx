import { cn } from '@/lib/cn'

type As = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'label' | 'small'
type Variant = 'display' | 'heading' | 'subheading' | 'body' | 'caption' | 'label' | 'mono'
type Color   = 'default' | 'secondary' | 'muted' | 'disabled' | 'accent' | 'success' | 'warning' | 'danger'

interface TextProps {
  as?: As
  variant?: Variant
  color?: Color
  balance?: boolean
  className?: string
  children: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  display:    'text-[var(--text-4xl)] font-bold tracking-[-0.04em] leading-none',
  heading:    'text-[var(--text-2xl)] font-semibold tracking-tight leading-snug',
  subheading: 'text-[var(--text-md)] font-medium leading-snug',
  body:       'text-[var(--text-base)] leading-relaxed',
  caption:    'text-[var(--text-xs)] leading-normal',
  label:      'text-[var(--text-xs)] font-medium uppercase tracking-[0.07em]',
  mono:       'font-mono text-[var(--text-base)]',
}

const colorStyles: Record<Color, string> = {
  default:   'text-[var(--text-1)]',
  secondary: 'text-[var(--text-2)]',
  muted:     'text-[var(--text-3)]',
  disabled:  'text-[var(--text-4)]',
  accent:    'text-[var(--accent-text)]',
  success:   'text-[var(--success)]',
  warning:   'text-[var(--warning)]',
  danger:    'text-[var(--danger)]',
}

export function Text({
  as: Tag = 'p',
  variant = 'body',
  color = 'default',
  balance = false,
  className,
  children,
}: TextProps) {
  return (
    <Tag
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        balance && 'text-balance',
        className
      )}
    >
      {children}
    </Tag>
  )
}
