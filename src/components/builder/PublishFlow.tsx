import { useState, useEffect } from 'react'
import { Check, Loader2, X, ArrowRight, Copy, Globe } from 'lucide-react'

/* ── Types ── */

type Moment = 'checklist' | 'paywall' | 'processing' | 'success'
type Billing = 'monthly' | 'annual'
type Plan    = 'starter' | 'business'

/* ── Constants ── */

const CHECKLIST_ITEMS = [
  'Schema markup injected',
  'Sitemap generated',
  'Meta tags verified',
  'Mobile layout confirmed',
  'GEO engine queued',
]
const CHECKLIST_DELAYS = [200, 500, 800, 1100, 1400]

const PRICES = {
  starter:  { monthly: 799,  annual: 666  },
  business: { monthly: 1999, annual: 1666 },
}

const GEO_ROWS = [
  'Schema markup injected',
  'Sitemap submitted to Google',
  'Perplexity index queued',
  'Citation monitoring active',
]
const GEO_DELAYS = [300, 600, 900, 1200]

const BACKDROP_ALPHA: Record<Moment, string> = {
  checklist:  'rgba(12,12,14,0.60)',
  paywall:    'rgba(12,12,14,0.75)',
  processing: 'rgba(12,12,14,0.85)',
  success:    'rgba(12,12,14,0.90)',
}

const GLASS: React.CSSProperties = {
  background:                'rgba(18,18,20,0.82)',
  backdropFilter:            'blur(24px) saturate(1.4)',
  WebkitBackdropFilter:      'blur(24px) saturate(1.4)',
  border:                    '1px solid rgba(255,255,255,0.08)',
  borderRadius:              'var(--r-xl)',
  boxShadow:                 '0 0 0 1px rgba(255,255,255,0.03), 0 24px 48px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4)',
}

/* ── Props ── */

interface Props {
  onClose:     () => void
  onDashboard: () => void
}

/* ── Main ── */

export function PublishFlow({ onClose, onDashboard }: Props) {
  const [moment, setMoment] = useState<Moment>('checklist')

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: BACKDROP_ALPHA[moment],
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      transition: 'background 400ms var(--ease-out)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {moment === 'checklist'  && <ChecklistCard  onDone={() => setMoment('paywall')} />}
      {moment === 'paywall'    && <PaywallModal   onClose={onClose} onSubscribe={() => setMoment('processing')} />}
      {moment === 'processing' && <ProcessingCard onDone={() => setMoment('success')} />}
      {moment === 'success'    && <SuccessCard    onDashboard={onDashboard} />}
    </div>
  )
}

/* ── Moment 1: Checklist ── */

function ChecklistCard({ onDone }: { onDone: () => void }) {
  const [checked,    setChecked]    = useState<boolean[]>(Array(5).fill(false))
  const [showAlmost, setShowAlmost] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    CHECKLIST_DELAYS.forEach((delay, i) => {
      timers.push(setTimeout(() => {
        setChecked(prev => { const n = [...prev]; n[i] = true; return n })
      }, delay))
    })
    timers.push(setTimeout(() => setShowAlmost(true), 1600))
    timers.push(setTimeout(() => onDone(), 1900))

    return () => timers.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{
      width: 360, padding: 'var(--sp-6)',
      ...GLASS, animation: 'scaleIn 250ms var(--ease-spring)',
    }}>
      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em', margin: '0 0 var(--sp-5)' }}>
        Preparing to publish
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        {CHECKLIST_ITEMS.map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', height: 24 }}>
            {/* Icon */}
            <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {checked[i] ? (
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'var(--success)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'popIn 200ms var(--ease-spring)',
                }}>
                  <Check size={9} strokeWidth={2.5} color="white" aria-hidden="true" />
                </div>
              ) : (
                <Loader2 size={14} style={{ color: 'var(--text-4)', animation: 'spin 1s linear infinite' }} aria-hidden="true" />
              )}
            </div>
            {/* Label */}
            <span style={{ fontSize: 13, color: checked[i] ? 'var(--text-2)' : 'var(--text-3)', transition: 'color 200ms' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {showAlmost && (
        <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 'var(--sp-4)', animation: 'fadeIn 200ms' }}>
          Almost there...
        </p>
      )}
    </div>
  )
}

/* ── Moment 2: Paywall modal ── */

function PaywallModal({ onClose, onSubscribe }: { onClose: () => void; onSubscribe: () => void }) {
  const [billing,  setBilling]  = useState<Billing>('monthly')
  const [selected, setSelected] = useState<Plan>('business')
  const [loading,  setLoading]  = useState(false)
  const [btnHov,   setBtnHov]   = useState(false)
  const [closeHov, setCloseHov] = useState(false)

  const annual = billing === 'annual'
  const price  = PRICES[selected][billing]

  const handleSubscribe = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); onSubscribe() }, 400)
  }

  return (
    <div style={{
      width: 440, maxHeight: '90vh', overflowY: 'auto',
      ...GLASS, animation: 'modalIn 350ms var(--ease-spring)',
      padding: 'var(--sp-6)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-4)' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
            Your site is ready.
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, margin: '4px 0 0' }}>
            Subscribe to publish it live and keep GEO running.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          onMouseEnter={() => setCloseHov(true)}
          onMouseLeave={() => setCloseHov(false)}
          style={{
            width: 28, height: 28, flexShrink: 0,
            background: closeHov ? 'var(--surface-3)' : 'transparent',
            border: `1px solid ${closeHov ? 'var(--border-2)' : 'transparent'}`,
            borderRadius: 'var(--r-md)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: closeHov ? 'var(--text-1)' : 'var(--text-3)', transition: 'all 120ms',
          }}
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Site strip */}
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border-1)',
        borderRadius: 'var(--r-lg)', padding: 'var(--sp-3) var(--sp-4)',
        display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
        marginBottom: 'var(--sp-4)',
      }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, background: 'var(--surface-3)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)' }}>M</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', margin: 0 }}>My Website</p>
          <p style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'monospace', margin: 0 }}>mybusiness.upmyb.com</p>
        </div>
        <span style={{
          background: 'rgba(76,195,138,0.10)', border: '1px solid rgba(76,195,138,0.20)',
          color: 'var(--success)', fontSize: 11, fontWeight: 500,
          padding: '2px 8px', borderRadius: 'var(--r-full)',
          whiteSpace: 'nowrap',
        }}>
          Ready to publish
        </span>
      </div>

      {/* Billing toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', justifyContent: 'center', marginBottom: 'var(--sp-4)' }}>
        <span onClick={() => setBilling('monthly')} style={{ fontSize: 12, fontWeight: 500, cursor: 'pointer', color: !annual ? 'var(--text-1)' : 'var(--text-3)', transition: 'color 200ms' }}>Monthly</span>
        <button
          type="button"
          onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')}
          style={{ width: 36, height: 20, background: annual ? 'var(--accent)' : 'var(--surface-4)', borderRadius: 'var(--r-full)', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 250ms' }}
        >
          <span style={{ position: 'absolute', display: 'block', width: 14, height: 14, borderRadius: '50%', background: 'white', top: 3, left: annual ? 19 : 3, transition: 'left 250ms var(--ease-spring)', boxShadow: '0 1px 2px rgba(0,0,0,0.25)' }} />
        </button>
        <span onClick={() => setBilling('annual')} style={{ fontSize: 12, fontWeight: 500, cursor: 'pointer', color: annual ? 'var(--text-1)' : 'var(--text-3)', transition: 'color 200ms' }}>
          Annual
          {annual && (
            <span style={{ marginLeft: 6, background: 'var(--success-dim)', border: '1px solid rgba(76,195,138,0.18)', color: 'var(--success)', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--r-full)' }}>
              Save 17%
            </span>
          )}
        </span>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
        <PlanCard
          name="Starter"
          price={PRICES.starter[billing]}
          features={['1 website, 5 pages', 'Basic GEO engine', '500 AI edits/month']}
          selected={selected === 'starter'}
          onClick={() => setSelected('starter')}
        />
        <PlanCard
          name="Business"
          price={PRICES.business[billing]}
          features={['3 websites, 15 pages', 'Full GEO + citations', 'All AI models']}
          selected={selected === 'business'}
          recommended
          onClick={() => setSelected('business')}
        />
      </div>

      {/* Subscribe button */}
      <button
        type="button"
        disabled={loading}
        onClick={handleSubscribe}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{
          width: '100%', height: 44, borderRadius: 'var(--r-lg)', border: 'none',
          background: loading || !btnHov ? 'var(--accent)' : 'var(--accent-hover)',
          color: 'white', fontSize: 14, fontWeight: 600,
          cursor: loading ? 'wait' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-2)',
          transition: 'background 150ms', marginBottom: 'var(--sp-3)',
        }}
      >
        {loading ? (
          <><Loader2 size={14} style={{ animation: 'spin 600ms linear infinite' }} aria-hidden="true" /> Opening payment...</>
        ) : (
          `Subscribe — ₹${price.toLocaleString('en-IN')}/month`
        )}
      </button>

      {/* Trust signals */}
      <p style={{ fontSize: 11, color: 'var(--text-4)', textAlign: 'center', margin: 0 }}>
        48h free preview · Cancel anytime · UPI · Card · NetBanking
      </p>
    </div>
  )
}

function PlanCard({ name, price, features, selected, recommended, onClick }: {
  name: string; price: number; features: string[]
  selected: boolean; recommended?: boolean; onClick: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        background: recommended
          ? 'rgba(94,106,210,0.06)'
          : selected ? 'var(--surface-3)' : 'var(--surface-2)',
        border: `1px solid ${recommended
          ? 'rgba(94,106,210,0.35)'
          : selected ? 'var(--border-3)' : hov ? 'var(--border-3)' : 'var(--border-2)'}`,
        borderRadius: 'var(--r-lg)', padding: 'var(--sp-4)',
        cursor: 'pointer', transition: 'all 150ms',
      }}
    >
      {recommended && (
        <div style={{
          position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--accent)', color: 'white',
          fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
          padding: '2px 10px', borderRadius: '0 0 var(--r-sm) var(--r-sm)',
          whiteSpace: 'nowrap',
        }}>
          Recommended
        </div>
      )}
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', margin: '0 0 var(--sp-3)' }}>{name}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 'var(--sp-3)' }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-3)', alignSelf: 'flex-start', marginTop: 4 }}>₹</span>
        <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.03em', transition: 'all 250ms' }}>{price.toLocaleString('en-IN')}</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>/mo</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {features.map(f => (
          <span key={f} style={{ fontSize: 12, color: 'var(--text-2)' }}>— {f}</span>
        ))}
      </div>
    </div>
  )
}

/* ── Moment 3: Processing ── */

function ProcessingCard({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      width: 360, padding: 'var(--sp-8)',
      ...GLASS, animation: 'modalIn 350ms var(--ease-spring)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-4)',
    }}>
      <Loader2 size={24} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }} aria-hidden="true" />
      <p style={{ fontSize: 14, color: 'var(--text-2)', margin: 0 }}>Activating your site...</p>
    </div>
  )
}

/* ── Moment 4: Success ── */

function SuccessCard({ onDashboard }: { onDashboard: () => void }) {
  const [revealedRows, setRevealedRows] = useState(0)
  const [showBtn,      setShowBtn]      = useState(false)
  const [copied,       setCopied]       = useState(false)
  const [btnHov,       setBtnHov]       = useState(false)
  const siteUrl = 'mybusiness.upmyb.com'

  useEffect(() => {
    const timers = GEO_DELAYS.map((delay, i) =>
      setTimeout(() => setRevealedRows(r => Math.max(r, i + 1)), delay)
    )
    const t1 = setTimeout(() => setShowBtn(true), 1600)
    const t2 = setTimeout(onDashboard, 4000)
    return () => { timers.forEach(clearTimeout); clearTimeout(t1); clearTimeout(t2) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const copyUrl = () => {
    navigator.clipboard?.writeText(siteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{
      width: 440,
      ...GLASS, animation: 'modalIn 350ms var(--ease-spring)',
      padding: 'var(--sp-8) var(--sp-6)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 'var(--sp-5)', textAlign: 'center',
    }}>
      {/* Pulsing dot */}
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: 'rgba(76,195,138,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'ringPulse 2s ease-in-out infinite',
      }}>
        <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s ease-in-out infinite' }} />
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', margin: 0 }}>
        You're live.
      </h2>

      {/* Site URL */}
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border-2)',
        borderRadius: 'var(--r-lg)', padding: 'var(--sp-3) var(--sp-5)',
        display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', width: '100%',
      }}>
        <Globe size={14} style={{ color: 'var(--success)', flexShrink: 0 }} aria-hidden="true" />
        <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, fontWeight: 500, color: 'var(--text-1)', flex: 1, textAlign: 'left' }}>
          {siteUrl}
        </span>
        <button type="button" onClick={copyUrl} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: copied ? 'var(--success)' : 'var(--text-3)', flexShrink: 0, transition: 'color 120ms' }}>
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        </button>
      </div>

      {/* GEO status */}
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border-1)',
        borderRadius: 'var(--r-lg)', padding: 'var(--sp-4)', width: '100%',
        display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)',
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', margin: 0, textAlign: 'left' }}>
          GEO Engine Started
        </p>
        {GEO_ROWS.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', height: 22,
              opacity: i < revealedRows ? 1 : 0,
              animation: i < revealedRows ? 'fadeIn 200ms var(--ease-out)' : 'none',
            }}
          >
            <Check size={12} style={{ color: 'var(--success)', flexShrink: 0 }} aria-hidden="true" />
            <span style={{ fontSize: 13, color: 'var(--text-2)', textAlign: 'left' }}>{row}</span>
          </div>
        ))}
        {revealedRows >= 4 && (
          <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, margin: 0, textAlign: 'left', animation: 'fadeIn 200ms var(--ease-out)' }}>
            First citations expected in 30–60 days. We'll notify you on WhatsApp.
          </p>
        )}
      </div>

      {/* Dashboard button */}
      {showBtn && (
        <button
          type="button"
          onClick={onDashboard}
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            width: '100%', height: 40,
            background: btnHov ? 'white' : 'var(--text-1)',
            color: 'var(--canvas)', border: 'none', borderRadius: 'var(--r-lg)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-2)',
            transition: 'background 150ms',
            animation: 'fadeUp 300ms var(--ease-out)',
            animationFillMode: 'backwards',
          }}
        >
          Go to your dashboard <ArrowRight size={14} aria-hidden="true" />
        </button>
      )}

      {/* Share row */}
      {showBtn && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-4)', marginTop: -12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Share your site:</span>
          {['WhatsApp', 'LinkedIn', 'Copy link'].map(s => (
            <ShareLink key={s} label={s} />
          ))}
        </div>
      )}
    </div>
  )
}

function ShareLink({ label }: { label: string }) {
  const [hov, setHov] = useState(false)
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ fontSize: 12, color: hov ? 'var(--text-1)' : 'var(--text-3)', cursor: 'pointer', transition: 'color 120ms' }}
    >
      {label}
    </span>
  )
}
