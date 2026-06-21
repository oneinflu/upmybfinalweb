import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/cn'
import { useScrolled } from '@/hooks/useScrolled'

export interface NavItem {
  label: string
  href: string
  active?: boolean
}

interface GlobalHeaderProps {
  navItems?: NavItem[]
  logoText?: string
  right?: React.ReactNode
}

export function GlobalHeader({
  navItems = [],
  logoText = 'Upmyb',
  right,
}: GlobalHeaderProps) {
  const scrolled = useScrolled()
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: MouseEvent) => {
      if (!mobileNavRef.current?.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      role="banner"
      className={cn(
        'sticky top-0 z-50 w-full h-16',
        'border-b',
        scrolled ? 'border-[var(--border-2)]' : 'border-[var(--border-1)]',
        scrolled ? 'backdrop-blur-xl' : 'backdrop-blur-md',
        'bg-[rgba(12,12,14,0.88)]',
        'transition-[border-color,opacity] duration-100 ease-linear'
      )}
    >
      <div className="mx-auto flex h-full items-stretch px-8 max-w-[var(--container-2xl)]">

        {/* Logo */}
        <a
          href="/"
          aria-label="Upmyb home"
          className={cn(
            'flex items-center shrink-0 mr-8',
            'text-[var(--text-lg)] font-semibold text-[var(--text-1)] leading-none',
            'hover:opacity-80',
            'outline-none focus-visible:ring-1.5 focus-visible:ring-[var(--accent)]',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]',
            'rounded-[var(--r-sm)]'
          )}
        >
          {logoText}
        </a>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-stretch gap-0"
        >
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        <div className="flex-1" />

        {right && (
          <div className="hidden md:flex items-center gap-3 ml-6">
            {right}
          </div>
        )}

        {/* Mobile hamburger */}
        {navItems.length > 0 && (
          <div className="flex items-center md:hidden" ref={mobileNavRef}>
            <button
              type="button"
              onClick={() => setMobileOpen(v => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              className={cn(
                'p-2 rounded-[var(--r-md)]',
                'text-[var(--text-2)] hover:text-[var(--text-1)]',
                'focus-visible:outline-none focus-visible:ring-1.5',
                'focus-visible:ring-[var(--accent)]'
              )}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>

            {mobileOpen && (
              <div
                id="mobile-nav"
                role="navigation"
                aria-label="Mobile navigation"
                className={cn(
                  'absolute top-16 left-0 right-0',
                  'bg-[rgba(12,12,14,0.97)] backdrop-blur-xl',
                  'border-b border-[var(--border-2)]',
                  'py-2'
                )}
              >
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={item.active ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center px-8 py-3',
                      'text-[var(--text-md)] font-medium leading-none',
                      item.active
                        ? 'text-[var(--text-1)]'
                        : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
                    )}
                  >
                    {item.label}
                    {item.active && (
                      <span
                        aria-hidden="true"
                        className="ml-auto w-1 h-1 rounded-full bg-[var(--accent)]"
                      />
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

function NavLink({ item }: { item: NavItem }) {
  return (
    <a
      href={item.href}
      aria-current={item.active ? 'page' : undefined}
      className={cn(
        'relative flex items-center px-3 h-full',
        'text-[var(--text-md)] font-medium leading-none',
        'outline-none focus-visible:ring-1.5 focus-visible:ring-inset',
        'focus-visible:ring-[var(--accent)]',
        item.active
          ? 'text-[var(--text-1)]'
          : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
      )}
    >
      {item.label}
      {item.active && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
        />
      )}
    </a>
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      {open ? (
        <>
          <line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="15" y1="3" x2="3" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect y="4" width="18" height="1.5" rx="0.75" />
          <rect y="8.25" width="18" height="1.5" rx="0.75" />
          <rect y="12.5" width="18" height="1.5" rx="0.75" />
        </>
      )}
    </svg>
  )
}
