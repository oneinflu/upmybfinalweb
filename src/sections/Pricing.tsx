import { useState } from 'react'

/* ── Types ── */
interface Feature {
  text: string
}

interface PlanConfig {
  id:           string
  name:         string
  monthlyPrice: number
  annualPrice:  number
  annualBilled: string
  description:  string
  ctaText:      string
  ctaAccent:    boolean
  recommended:  boolean
  features:     Feature[]
}

/* ── Plan data ── */
const PLANS: PlanConfig[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 799,
    annualPrice:  666,
    annualBilled: '₹7,990/year',
    description: 'For individuals and solo businesses getting online for the first time.',
    ctaText: 'Start free trial',
    ctaAccent: false,
    recommended: false,
    features: [
      { text: '1 website' },
      { text: 'Free upmyb.in subdomain' },
      { text: 'Connect your own domain' },
      { text: 'Mobile-ready design' },
      { text: 'Appears on Google & Bing' },
      { text: '1 GB media storage' },
      { text: 'Email support' },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 1999,
    annualPrice:  1666,
    annualBilled: '₹19,990/year',
    description: 'For growing businesses that need full GEO and multiple sites.',
    ctaText: 'Start free trial',
    ctaAccent: true,
    recommended: true,
    features: [
      { text: '3 websites' },
      { text: 'Everything in Starter' },
      { text: 'Cited on ChatGPT, Perplexity & Gemini' },
      { text: 'Citation monitoring alerts' },
      { text: 'Visitor analytics dashboard' },
      { text: '10 GB media storage' },
      { text: 'Priority support' },
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    monthlyPrice: 4999,
    annualPrice:  4166,
    annualBilled: '₹49,990/year',
    description: 'For freelancers and agencies managing client websites at scale.',
    ctaText: 'Contact us',
    ctaAccent: false,
    recommended: false,
    features: [
      { text: 'Unlimited websites' },
      { text: 'Everything in Business' },
      { text: 'Client access logins' },
      { text: 'White-label PDF reports' },
      { text: 'Bulk publish & update' },
      { text: 'Unlimited media storage' },
      { text: 'Dedicated account manager' },
    ],
  },
]

function formatPrice(n: number): string {
  return n.toLocaleString('en-IN')
}

/* ── Main section ── */

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const annual = billingCycle === 'annual'
  const toggle = () => setBillingCycle(c => (c === 'monthly' ? 'annual' : 'monthly'))

  return (
    <section
      className="relative w-full bg-[var(--canvas)] overflow-hidden"
      style={{ padding: 'var(--sp-24) var(--sp-6)' }}
    >
      {/* Single allowed gradient — centered glow behind cards */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800, height: 500,
          background: 'radial-gradient(ellipse, rgba(94,106,210,0.05) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 960, margin: '0 auto',
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 'var(--sp-10)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <span style={{
            background: 'var(--accent-dim)', border: '1px solid rgba(94,106,210,0.18)',
            borderRadius: 'var(--r-full)', padding: '3px 12px',
            fontSize: 11, fontWeight: 500, color: 'var(--accent-text)',
            letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            Simple pricing
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700, color: 'var(--text-1)',
            letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
          }}>
            One price. Everything included.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 380, margin: 0 }}>
            No token limits. No per-page charges. No surprise bills. Flat subscription.
          </p>
        </div>

        {/* Billing toggle */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
            background: 'var(--surface-1)', border: '1px solid var(--border-2)',
            borderRadius: 'var(--r-full)', padding: '3px 4px 3px 14px',
          }}>
            <span
              role="button"
              tabIndex={0}
              onClick={() => setBillingCycle('monthly')}
              onKeyDown={e => e.key === 'Enter' && setBillingCycle('monthly')}
              style={{
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                userSelect: 'none',
                color: annual ? 'var(--text-3)' : 'var(--text-1)',
                transition: 'color 200ms',
              }}
            >
              Monthly
            </span>

            <button
              type="button"
              onClick={toggle}
              aria-pressed={annual}
              aria-label="Switch to annual billing"
              style={{
                width: 36, height: 20,
                background: annual ? 'var(--accent)' : 'var(--surface-4)',
                borderRadius: 'var(--r-full)', border: 'none',
                cursor: 'pointer', position: 'relative', flexShrink: 0,
                transition: 'background 250ms var(--ease-out)',
              }}
            >
              <span style={{
                position: 'absolute', display: 'block',
                width: 14, height: 14, borderRadius: '50%',
                background: 'white', top: 3,
                left: annual ? 19 : 3,
                transition: 'left 250ms var(--ease-spring)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
              }} />
            </button>

            <span
              role="button"
              tabIndex={0}
              onClick={() => setBillingCycle('annual')}
              onKeyDown={e => e.key === 'Enter' && setBillingCycle('annual')}
              style={{
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                userSelect: 'none', paddingRight: 10,
                color: annual ? 'var(--text-1)' : 'var(--text-3)',
                transition: 'color 200ms',
              }}
            >
              Annual
            </span>
          </div>

          {/* Savings pill — absolutely positioned so it never shifts the toggle's center */}
          <span
            aria-hidden={!annual}
            style={{
              position: 'absolute', left: 'calc(100% + 10px)', top: '50%',
              transform: 'translateY(-50%)',
              display: 'inline-flex', alignItems: 'center',
              background: 'var(--success-dim)', border: '1px solid rgba(76,195,138,0.18)',
              borderRadius: 'var(--r-full)', padding: '2px 8px',
              fontSize: 11, fontWeight: 500, color: 'var(--success)',
              opacity: annual ? 1 : 0, transition: 'opacity 200ms',
              pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
            }}
          >
            Save 2 months
          </span>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 'var(--sp-3)', width: '100%', alignItems: 'start' }}
        >
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} billingCycle={billingCycle} />
          ))}
        </div>

        {/* Footer */}
        <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', margin: 0 }}>
          All plans include a 7-day free trial. No credit card required to start.
        </p>
      </div>
    </section>
  )
}

/* ── Plan card ── */

interface CardProps {
  plan:         PlanConfig
  billingCycle: 'monthly' | 'annual'
}

function PlanCard({ plan, billingCycle }: CardProps) {
  const [hovered, setHovered]           = useState(false)
  const [btnHovered, setBtnHovered]     = useState(false)
  const annual                          = billingCycle === 'annual'
  const price                           = annual ? plan.annualPrice : plan.monthlyPrice
  const billingLine                     = annual ? `Billed ${plan.annualBilled}` : 'Billed monthly'

  const borderColor = plan.recommended
    ? 'var(--border-3)'
    : hovered ? 'var(--border-3)' : 'var(--border-2)'

  const btnBg = plan.ctaAccent
    ? (btnHovered ? 'var(--accent-hover)' : 'var(--accent)')
    : (btnHovered ? 'var(--surface-4)' : 'var(--surface-3)')

  const btnBorder = plan.ctaAccent
    ? 'none'
    : `1px solid ${btnHovered ? 'var(--border-3)' : 'var(--border-2)'}`

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: plan.recommended ? 'var(--surface-2)' : 'var(--surface-1)',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--r-lg)',
        padding: 'var(--sp-6)',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
        transition: 'border-color 200ms',
      }}
    >
      {/* Most popular badge */}
      {plan.recommended && (
        <div style={{
          position: 'absolute', top: -1, left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--accent)', color: 'white',
          fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', padding: '3px 12px',
          borderRadius: '0 0 var(--r-md) var(--r-md)',
          whiteSpace: 'nowrap',
        }}>
          Most popular
        </div>
      )}

      {/* Plan header */}
      <div style={{
        paddingBottom: 'var(--sp-5)',
        borderBottom: '1px solid var(--border-1)',
        marginBottom: 'var(--sp-5)',
      }}>
        <p style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--text-3)',
          marginBottom: 'var(--sp-4)', margin: `0 0 var(--sp-4) 0`,
        }}>
          {plan.name}
        </p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 'var(--sp-2)' }}>
          <span style={{
            fontSize: 20, fontWeight: 500, color: 'var(--text-2)',
            lineHeight: 1, alignSelf: 'flex-start', marginTop: 6,
          }}>₹</span>
          <span
            key={`${plan.id}-${billingCycle}`}
            style={{
              fontSize: 44, fontWeight: 700, color: 'var(--text-1)',
              letterSpacing: '-0.04em', lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              animation: 'fadeIn 250ms var(--ease-out)',
            }}
          >
            {formatPrice(price)}
          </span>
          <span style={{
            fontSize: 13, fontWeight: 400, color: 'var(--text-3)',
            alignSelf: 'flex-end', marginBottom: 6,
          }}>/mo</span>
        </div>

        <p style={{ fontSize: 11, color: 'var(--text-3)', margin: `var(--sp-1) 0 var(--sp-3)` }}>
          {billingLine}
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>
          {plan.description}
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          width: '100%', height: 34,
          borderRadius: 'var(--r-md)',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 'var(--sp-5)',
          transition: 'background 150ms, border-color 150ms',
          border: btnBorder,
          background: btnBg,
          color: plan.ctaAccent ? 'white' : 'var(--text-1)',
        }}
      >
        {plan.ctaText}
      </button>

      {/* Feature list */}
      <ul style={{
        listStyle: 'none', margin: 0, padding: 0,
        display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)',
      }}>
        {plan.features.map((feature, i) => (
          <li
            key={i}
            style={{
              display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)',
              fontSize: 13, color: 'var(--text-2)', lineHeight: 1.45,
            }}
          >
            <span style={{ color: 'var(--text-4)', flexShrink: 0 }}>—</span>
            {feature.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
