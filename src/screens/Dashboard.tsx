import { useState } from 'react'
import { ArrowLeft, ExternalLink, Bell, ChevronRight } from 'lucide-react'

/* ── GEO Donut ── */

const DONUT_R   = 44
const DONUT_CX  = 56
const DONUT_CY  = 56
const CIRC      = 2 * Math.PI * DONUT_R
const GEO_SCORE = 12
const GEO_MAX   = 100

function GeoDonut({ score = GEO_SCORE }: { score?: number }) {
  const pct  = score / GEO_MAX
  const dash = CIRC * pct
  const gap  = CIRC - dash

  return (
    <svg width={112} height={112} viewBox={`0 0 ${DONUT_CX * 2} ${DONUT_CY * 2}`} aria-label={`GEO score ${score} out of 100`}>
      {/* Track */}
      <circle
        cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R}
        fill="none" stroke="var(--surface-3)" strokeWidth={7}
      />
      {/* Fill — rotated so it starts at 12 o'clock */}
      <circle
        cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R}
        fill="none" stroke="var(--accent)" strokeWidth={7}
        strokeDasharray={`${dash} ${gap}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${DONUT_CX} ${DONUT_CY})`}
        style={{ transition: 'stroke-dasharray 600ms var(--ease-out)' }}
      />
      {/* Score text */}
      <text x={DONUT_CX} y={DONUT_CY - 5} textAnchor="middle" fontSize={22} fontWeight={700} fill="var(--text-1)" fontFamily="Inter, system-ui, sans-serif">
        {score}
      </text>
      <text x={DONUT_CX} y={DONUT_CY + 14} textAnchor="middle" fontSize={11} fill="var(--text-3)" fontFamily="Inter, system-ui, sans-serif">
        / 100
      </text>
    </svg>
  )
}

/* ── Next Steps ── */

const NEXT_STEPS = [
  {
    n:    '01',
    head: 'Add your business details',
    body: 'GST, address, and contact info improve trust signals for AI engines.',
    cta:  'Fill in details',
  },
  {
    n:    '02',
    head: 'Connect a custom domain',
    body: 'Custom domains rank faster and build brand authority.',
    cta:  'Connect domain',
  },
  {
    n:    '03',
    head: 'Publish more content',
    body: 'FAQ sections, testimonials, and blog posts increase citation surface.',
    cta:  'Open builder',
  },
]

/* ── Props ── */

interface Props {
  onBackToBuilder: () => void
  siteName?:       string
  siteUrl?:        string
}

/* ── Component ── */

export function Dashboard({ onBackToBuilder, siteName = 'My Website', siteUrl = 'mybusiness.upmyb.com' }: Props) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--canvas)',
      display: 'flex', flexDirection: 'column',
    }}>
      <TopBar siteName={siteName} siteUrl={siteUrl} onBackToBuilder={onBackToBuilder} />

      <main style={{
        flex: 1,
        maxWidth: 720, width: '100%',
        margin: '0 auto',
        padding: '40px 24px 64px',
        display: 'flex', flexDirection: 'column',
        gap: 'var(--sp-7)',
      }}>
        {/* GEO Score card */}
        <GeoScoreCard />

        {/* What happens next */}
        <NextStepsCard onBackToBuilder={onBackToBuilder} />

        {/* Activity feed placeholder */}
        <ActivityCard />
      </main>
    </div>
  )
}

/* ── TopBar ── */

function TopBar({ siteName, siteUrl, onBackToBuilder }: { siteName: string; siteUrl: string; onBackToBuilder: () => void }) {
  const [backHov, setBackHov] = useState(false)
  const [bellHov, setBellHov] = useState(false)

  return (
    <header style={{
      height: 52, borderBottom: '1px solid var(--border-1)',
      background: 'var(--surface-1)',
      display: 'flex', alignItems: 'center',
      padding: '0 var(--sp-5)',
      gap: 'var(--sp-4)',
    }}>
      {/* Back to editor */}
      <button
        type="button"
        onClick={onBackToBuilder}
        onMouseEnter={() => setBackHov(true)}
        onMouseLeave={() => setBackHov(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: backHov ? 'var(--surface-2)' : 'transparent',
          border: `1px solid ${backHov ? 'var(--border-2)' : 'transparent'}`,
          borderRadius: 'var(--r-md)', padding: '5px 10px 5px 8px',
          color: backHov ? 'var(--text-1)' : 'var(--text-2)',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          transition: 'all 120ms', flexShrink: 0,
        }}
      >
        <ArrowLeft size={13} aria-hidden="true" />
        Builder
      </button>

      {/* Site name / url */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {siteName}
        </span>
        <a
          href={`https://${siteUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-3)', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          {siteUrl} <ExternalLink size={11} aria-hidden="true" />
        </a>
      </div>

      {/* Notification bell */}
      <button
        type="button"
        onMouseEnter={() => setBellHov(true)}
        onMouseLeave={() => setBellHov(false)}
        style={{
          width: 32, height: 32, flexShrink: 0,
          background: bellHov ? 'var(--surface-2)' : 'transparent',
          border: `1px solid ${bellHov ? 'var(--border-2)' : 'transparent'}`,
          borderRadius: 'var(--r-md)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: bellHov ? 'var(--text-1)' : 'var(--text-3)', transition: 'all 120ms',
        }}
      >
        <Bell size={14} aria-hidden="true" />
      </button>
    </header>
  )
}

/* ── GEO Score Card ── */

function GeoScoreCard() {
  return (
    <div style={{
      background: 'var(--surface-1)', border: '1px solid var(--border-1)',
      borderRadius: 'var(--r-xl)', padding: 'var(--sp-5) var(--sp-6)',
      display: 'flex', alignItems: 'center', gap: 'var(--sp-7)',
      animation: 'fadeUp 350ms var(--ease-out) 100ms both',
    }}>
      {/* Donut */}
      <div style={{ flexShrink: 0 }}>
        <GeoDonut />
      </div>

      {/* Copy */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', margin: 0 }}>
            GEO Score
          </h2>
          <span style={{
            background: 'rgba(94,106,210,0.10)', border: '1px solid rgba(94,106,210,0.20)',
            color: 'var(--accent)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', padding: '2px 8px', borderRadius: 'var(--r-full)',
          }}>
            Starting
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 var(--sp-3)', maxWidth: 420 }}>
          Your site just launched. The GEO engine is indexing your content and will begin submitting citations across AI engines.
        </p>
        <div style={{ display: 'flex', gap: 'var(--sp-5)' }}>
          <Metric label="Pages indexed" value="5" />
          <Metric label="Schema tags" value="12" />
          <Metric label="AI engines queued" value="4" />
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', margin: 0 }}>{value}</p>
    </div>
  )
}

/* ── Next Steps Card ── */

function NextStepsCard({ onBackToBuilder }: { onBackToBuilder: () => void }) {
  return (
    <div style={{
      background: 'var(--surface-1)', border: '1px solid var(--border-1)',
      borderRadius: 'var(--r-xl)',
      animation: 'fadeUp 350ms var(--ease-out) 200ms both',
    }}>
      <div style={{ padding: 'var(--sp-5) var(--sp-6)', borderBottom: '1px solid var(--border-1)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em', margin: 0 }}>
          What happens next
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '2px 0 0' }}>
          Complete these to raise your GEO score.
        </p>
      </div>

      {NEXT_STEPS.map((step, i) => (
        <NextStepRow
          key={step.n}
          step={step}
          last={i === NEXT_STEPS.length - 1}
          onAction={step.n === '03' ? onBackToBuilder : undefined}
        />
      ))}
    </div>
  )
}

function NextStepRow({ step, last, onAction }: { step: typeof NEXT_STEPS[0]; last: boolean; onAction?: () => void }) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={onAction}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--sp-4)',
        padding: 'var(--sp-4) var(--sp-6)',
        borderBottom: last ? 'none' : '1px solid var(--border-1)',
        background: hov ? 'var(--surface-2)' : 'transparent',
        cursor: onAction ? 'pointer' : 'default',
        transition: 'background 120ms',
        borderRadius: last ? '0 0 var(--r-xl) var(--r-xl)' : 0,
      }}
    >
      {/* Number */}
      <span style={{
        width: 28, height: 28, flexShrink: 0,
        background: 'var(--surface-3)', border: '1px solid var(--border-2)',
        borderRadius: 'var(--r-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color: 'var(--text-3)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {step.n}
      </span>

      {/* Copy */}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', margin: '0 0 2px' }}>{step.head}</p>
        <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0 }}>{step.body}</p>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: hov ? 'var(--text-1)' : 'var(--text-2)', transition: 'color 120ms' }}>{step.cta}</span>
        <ChevronRight size={13} style={{ color: hov ? 'var(--text-2)' : 'var(--text-3)', transition: 'color 120ms' }} aria-hidden="true" />
      </div>
    </div>
  )
}

/* ── Activity Card ── */

function ActivityCard() {
  return (
    <div style={{
      background: 'var(--surface-1)', border: '1px solid var(--border-1)',
      borderRadius: 'var(--r-xl)',
      animation: 'fadeUp 350ms var(--ease-out) 300ms both',
    }}>
      <div style={{ padding: 'var(--sp-5) var(--sp-6)', borderBottom: '1px solid var(--border-1)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em', margin: 0 }}>
          Activity
        </h3>
      </div>
      <div style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        {ACTIVITY_EVENTS.map((ev, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: ev.color, marginTop: 6, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{ev.text}</span>
              <span style={{ fontSize: 12, color: 'var(--text-4)', marginLeft: 8 }}>{ev.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ACTIVITY_EVENTS = [
  { text: 'Site published at mybusiness.upmyb.com',  time: 'just now',  color: 'var(--success)' },
  { text: 'Sitemap submitted to Google Search Console', time: '1m ago', color: 'var(--accent)'  },
  { text: 'Schema markup validated (0 errors)',      time: '1m ago',    color: 'var(--success)' },
  { text: 'GEO engine queued for Perplexity index', time: '2m ago',    color: 'var(--accent)'  },
]
