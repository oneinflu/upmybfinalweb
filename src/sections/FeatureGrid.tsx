import { Zap, Search, Smartphone, MapPin, Globe, BarChart3, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Feature {
  Icon:        LucideIcon
  title:       string
  description: string
  wide?:       boolean
}

const FEATURES: Feature[] = [
  {
    Icon: Zap,
    title: 'Live in 5 minutes',
    description: 'Describe your business, hit enter. Your site is written, designed, and published. No templates to scroll through.',
    wide: true,
  },
  {
    Icon: Search,
    title: 'Found on ChatGPT',
    description: 'GEO optimisation runs in the background. When someone asks ChatGPT for your kind of business, you appear.',
  },
  {
    Icon: Smartphone,
    title: 'Mobile by default',
    description: 'Every site looks sharp on any screen. Built for the 85% of Indian users on mobile.',
  },
  {
    Icon: MapPin,
    title: 'Local SEO wired in',
    description: 'Your name, city, and category are structured for Google from day one. No plugins. No extra steps.',
    wide: true,
  },
  {
    Icon: Globe,
    title: 'Your own domain',
    description: 'Connect a .in or .com in one click. Or go live instantly on a free upmyb.in address.',
  },
  {
    Icon: BarChart3,
    title: 'Track what matters',
    description: 'Visits, sources, and pages — explained in plain language, not charts that need a data analyst.',
    wide: true,
  },
]

export function FeatureGrid() {
  return (
    <section className="relative w-full bg-[var(--canvas)] overflow-hidden" style={{ padding: 'var(--sp-24) 0' }}>

      {/* Dot grid — continues from hero */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Top fade — blends hero into this section */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: 120, background: 'linear-gradient(to bottom, var(--canvas), transparent)' }}
      />

      <div className="relative mx-auto max-w-[1120px] px-6">

        {/* Section header */}
        <div style={{ marginBottom: 'var(--sp-12)' }}>
          <p
            className="font-medium uppercase text-[var(--accent-text)]"
            style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}
          >
            Built different
          </p>
          <h2
            className="text-[var(--text-1)] font-bold"
            style={{
              fontSize: 'clamp(28px, 3.5vw, var(--text-3xl))',
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              maxWidth: 480,
              marginTop: 'var(--sp-3)',
            }}
          >
            Everything to get found.<br />
            <span className="text-[var(--text-3)]">Nothing you don't need.</span>
          </h2>
        </div>

        {/* Bento grid — alternates wide/narrow */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--sp-3)' }}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Card ── */

function FeatureCard({ Icon, title, description, wide, index }: Feature & { index: number }) {
  return (
    <div
      className={cn(
        'group relative flex overflow-hidden',
        'rounded-[var(--r-lg)]',
        'border border-[var(--border-2)] hover:border-[var(--border-3)]',
        wide ? 'md:col-span-2 flex-row' : 'flex-col',
      )}
      style={{
        background: 'linear-gradient(135deg, var(--surface-3) 0%, var(--surface-2) 55%)',
        padding: wide ? 'var(--sp-8)' : 'var(--sp-6)',
      }}
    >
      {/* Top highlight line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, var(--border-3) 50%, transparent 95%)',
        }}
      />

      {/* Text side */}
      <div className={cn('flex flex-col', wide && 'flex-1')}>
        <div
          className="text-[var(--text-2)]"
          aria-hidden="true"
          style={{ marginBottom: wide ? 'var(--sp-6)' : 'var(--sp-4)' }}
        >
          <Icon size={wide ? 22 : 18} strokeWidth={1.5} />
        </div>

        <h3
          className="text-[var(--text-1)] font-semibold leading-snug"
          style={{
            fontSize: wide ? 'var(--text-xl)' : 'var(--text-lg)',
            letterSpacing: '-0.02em',
            marginBottom: 'var(--sp-2)',
          }}
        >
          {title}
        </h3>

        <p
          className="text-[var(--text-2)] font-normal leading-relaxed"
          style={{ fontSize: 'var(--text-md)', maxWidth: wide ? 360 : undefined }}
        >
          {description}
        </p>
      </div>

      {/* Decorative right panel — wide cards only */}
      {wide && (
        <DecorativePanel index={index} />
      )}
    </div>
  )
}

/* ── Decorative panel ── */

const PANEL_GLOWS = [
  'rgba(94,106,210,0.14)',   /* accent */
  'rgba(76,195,138,0.10)',   /* success */
  'rgba(229,160,90,0.10)',   /* warm */
]

function DecorativePanel({ index }: { index: number }) {
  const glow = PANEL_GLOWS[Math.floor(index / 2) % PANEL_GLOWS.length]

  return (
    <div
      aria-hidden="true"
      className="relative hidden md:block shrink-0 self-stretch overflow-hidden rounded-[var(--r-md)]"
      style={{ width: 160, marginLeft: 'var(--sp-8)', borderLeft: '1px solid var(--border-1)' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          maskImage: 'linear-gradient(to right, transparent, black 35%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 35%)',
        }}
      />
      {/* Glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}
