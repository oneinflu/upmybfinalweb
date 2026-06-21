import { GlobalHeader, type NavItem } from './GlobalHeader'
import { cn } from '@/lib/cn'

interface MainLayoutProps {
  navItems?: NavItem[]
  headerRight?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function MainLayout({
  navItems,
  headerRight,
  children,
  className,
}: MainLayoutProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-[var(--canvas)]">
      <GlobalHeader navItems={navItems} right={headerRight} />
      <main
        id="main-content"
        className={cn('flex-1', className)}
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  )
}
