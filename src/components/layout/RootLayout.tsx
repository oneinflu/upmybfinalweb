import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/cn'

interface RootLayoutProps {
  sidebar?: React.ReactNode
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function RootLayout({
  sidebar,
  headerLeft,
  headerRight,
  className,
  children,
}: RootLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-dvh bg-[var(--canvas)]">
      {sidebar && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
          {sidebar}
        </Sidebar>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <Header>
          {sidebar && (
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="lg:hidden p-1.5 rounded-[var(--r-md)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)]"
              aria-label="Toggle sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect y="2" width="16" height="1.5" rx="0.75" />
                <rect y="7.25" width="16" height="1.5" rx="0.75" />
                <rect y="12.5" width="16" height="1.5" rx="0.75" />
              </svg>
            </button>
          )}
          <div className="flex-1 flex items-center gap-3">{headerLeft}</div>
          <div className="flex items-center gap-2">{headerRight}</div>
        </Header>

        <main className={cn('flex-1 overflow-auto', className)}>
          {children}
        </main>
      </div>
    </div>
  )
}
