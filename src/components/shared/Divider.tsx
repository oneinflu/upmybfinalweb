import { cn } from '@/lib/cn'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  subtle?: boolean
  className?: string
}

export function Divider({ orientation = 'horizontal', subtle = false, className }: DividerProps) {
  return (
    <div
      role="separator"
      className={cn(
        'shrink-0',
        subtle ? 'bg-[var(--border-1)]' : 'bg-[var(--border-2)]',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch',
        className
      )}
    />
  )
}
