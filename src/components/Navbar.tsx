import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/Logo'

const NAV_LINKS = [
  { label: 'Product',   href: '/product'   },
  { label: 'Pricing',   href: '/pricing'   },
  { label: 'Blog',      href: '/blog'      },
  { label: 'Changelog', href: '/changelog' },
]

interface NavbarProps {
  activePath?: string
}

export function Navbar({ activePath }: NavbarProps) {
  return (
    <div className="fixed left-0 right-0 top-3 z-[100] flex justify-center px-4 pointer-events-none">
      <nav
        role="navigation"
        aria-label="Main"
        className="relative w-full max-w-[1120px] pointer-events-auto"
      >
        {/* Vibrant solid background — always on, this is the primary chrome */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[var(--r-xl)] border border-[var(--border-2)]"
          style={{
            background: 'rgba(16,16,19,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.4), 0 8px 32px rgba(94,106,210,0.12)',
          }}
        />

        {/* Running highlight sweep — always animating, draws the eye */}
        <RunningLine />

        {/* Content */}
        <div className="relative h-[52px] flex items-center justify-between px-5">

          {/* Logo */}
          <div className="flex items-center select-none" aria-label="UpMyB">
            <Logo size={15} />
          </div>

          {/* Center nav — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={activePath === link.href}
              />
            ))}
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            {/* Sign in — hidden on mobile */}
            <a
              href="/signin"
              className={cn(
                'hidden md:flex items-center',
                'h-[30px] px-3 rounded-[var(--r-md)]',
                'text-[var(--text-base)] font-medium text-[var(--text-2)]',
                'border border-transparent',
                'hover:text-[var(--text-1)] hover:border-[var(--border-2)] hover:bg-[var(--surface-2)]',
                'leading-none no-underline'
              )}
            >
              Sign in
            </a>

            {/* Start free — accent fill for brand vibrancy in the bar */}
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1, ease: [0.32, 0.72, 0, 1] }}
              className={cn(
                'inline-flex items-center',
                'h-[30px] px-3.5 rounded-[var(--r-md)]',
                'text-[var(--text-base)] font-semibold text-white',
                'bg-[var(--accent)] hover:bg-[var(--accent-hover)]',
                'leading-none no-underline select-none'
              )}
            >
              Start free
            </motion.a>
          </div>
        </div>
      </nav>
    </div>
  )
}

/* ── Running highlight line ── */
/* A soft light "comet" loops along the bottom edge — built from the existing
   `marquee` keyframe (pure transform, percentage-based so it stays seamless
   at any bar width). */

function RunningLine() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-4 right-4 bottom-0 h-px overflow-hidden"
    >
      <div style={{ display: 'flex', width: '200%', animation: 'marquee 3.6s linear infinite' }}>
        {[0, 1].map(i => (
          <div
            key={i}
            style={{
              width: '50%', height: 1, flexShrink: 0,
              background: 'linear-gradient(90deg, transparent 0%, transparent 70%, var(--accent) 90%, transparent 100%)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Nav link ── */

interface NavLinkProps {
  href: string
  label: string
  active?: boolean
}

function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      role="listitem"
      className={cn(
        'flex items-center h-[30px] px-[10px] rounded-[var(--r-md)]',
        'text-[var(--text-base)] font-normal leading-none no-underline',
        'hover:bg-[var(--surface-3)]',
        active ? 'text-[var(--text-1)]' : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
      )}
    >
      {label}
    </a>
  )
}
