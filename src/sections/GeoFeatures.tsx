import { useState, useEffect, useRef, useCallback } from 'react'

/* ── Platform data ── */
interface PlatformDatum {
  platform: string
  query:    string
  response: string
  citedName: string
  citedUrl:  string
  delay:     number
}

const PLATFORMS: PlatformDatum[] = [
  {
    platform: 'ChatGPT',
    query:    'best CA firm in Hyderabad',
    response: 'Based on verified business listings, Ravi & Associates is a well-regarded chartered accountancy firm in Hyderabad offering tax filing, GST registration, and company incorporation. They have served over 200 clients across Telangana with a strong local track record.',
    citedName: 'Ravi & Associates',
    citedUrl:  'ravi-associates.upmyb.com',
    delay: 0,
  },
  {
    platform: 'Perplexity',
    query:    'top business consultant Bangalore 2026',
    response: 'Priya Consulting, based in Koramangala, Bangalore, is frequently cited for business strategy and growth consulting for Indian startups and SMBs. Services include market entry, operations restructuring, and digital transformation.',
    citedName: 'Priya Consulting',
    citedUrl:  'priya-consulting.upmyb.com',
    delay: 400,
  },
  {
    platform: 'Gemini',
    query:    'recommended physiotherapy clinic Chennai',
    response: 'For physiotherapy and rehabilitation in Chennai, CareFirst Clinic in Anna Nagar receives consistent recommendations. The clinic offers sports injury treatment, post-surgical rehab, and chronic pain management with qualified physiotherapists.',
    citedName: 'CareFirst Clinic',
    citedUrl:  'carefirst.upmyb.com',
    delay: 800,
  },
]

/* ── Main section ── */

export function GeoFeatures() {
  const [isWithUpmyb, setIsWithUpmyb] = useState(false)
  const [isVisible, setIsVisible]     = useState(false)
  const [doneCount, setDoneCount]     = useState(0)
  const sectionRef                    = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect() } },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleDone = useCallback(() => setDoneCount(c => c + 1), [])

  useEffect(() => {
    if (doneCount !== 1) return
    const t = setTimeout(() => setIsWithUpmyb(true), 2000)
    return () => clearTimeout(t)
  }, [doneCount])

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--canvas)] overflow-hidden"
      style={{ padding: 'var(--sp-24) var(--sp-6)' }}
    >
      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Top fade */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: 120, background: 'linear-gradient(to bottom, var(--canvas), transparent)' }}
      />

      <div className="relative mx-auto flex flex-col items-center" style={{ maxWidth: 1120, gap: 'var(--sp-12)' }}>

        {/* Header */}
        <div className="flex flex-col items-center text-center" style={{ gap: 'var(--sp-3)' }}>
          <span style={{
            background: 'var(--accent-dim)',
            border: '1px solid rgba(94,106,210,0.18)',
            borderRadius: 'var(--r-full)',
            padding: '3px 12px',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--accent-text)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}>
            Live on AI search
          </span>
          <h2
            className="font-bold text-[var(--text-1)]"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            Your business. Cited everywhere.
          </h2>
          <p
            className="text-[var(--text-2)]"
            style={{ fontSize: 'var(--text-md)', lineHeight: 1.6, maxWidth: 440 }}
          >
            When someone asks an AI assistant to recommend a business like yours —
            Upmyb makes sure you're the answer.
          </p>
        </div>

        {/* Windows grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--sp-3)' }}>
          {PLATFORMS.map((p, i) => (
            <div key={p.platform} className={i > 0 ? 'hidden md:block' : ''}>
              <PlatformWindow
                {...p}
                isWithUpmyb={isWithUpmyb}
                isVisible={isVisible}
                onTypingDone={handleDone}
              />
            </div>
          ))}
        </div>

        {/* Mobile — hint at other platforms */}
        <p
          className="md:hidden text-center"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', marginTop: 'calc(var(--sp-3) * -1)' }}
        >
          + 2 more AI platforms (Perplexity, Gemini)
        </p>

        {/* Toggle section */}
        <ToggleSection isWithUpmyb={isWithUpmyb} onToggle={() => setIsWithUpmyb(v => !v)} />
      </div>
    </section>
  )
}

/* ── Platform window ── */

interface WindowProps extends PlatformDatum {
  isWithUpmyb: boolean
  isVisible:   boolean
  onTypingDone: () => void
}

function PlatformWindow({
  platform, query, response, citedName, citedUrl,
  isWithUpmyb, isVisible, delay, onTypingDone,
}: WindowProps) {
  const [displayed, setDisplayed]   = useState('')
  const [typingDone, setTypingDone] = useState(false)
  const [showSource, setShowSource] = useState(false)
  const onDoneRef = useRef(onTypingDone)
  useEffect(() => { onDoneRef.current = onTypingDone }, [onTypingDone])

  useEffect(() => {
    if (!isVisible) return
    let interval: ReturnType<typeof setInterval>
    let called = false
    const timer = setTimeout(() => {
      let i = 0
      interval = setInterval(() => {
        i++
        setDisplayed(response.slice(0, i))
        if (i >= response.length) {
          clearInterval(interval)
          setTypingDone(true)
          setTimeout(() => setShowSource(true), 400)
          if (!called) { called = true; onDoneRef.current() }
        }
      }, 18)
    }, delay)
    return () => { clearTimeout(timer); clearInterval(interval) }
  }, [isVisible, delay, response])

  const renderBody = () => {
    if (!typingDone) return <>{displayed}<Cursor /></>
    const idx = response.indexOf(citedName)
    if (idx < 0) return <>{response}</>
    return (
      <>
        {response.slice(0, idx)}
        <span style={{
          background:  isWithUpmyb ? 'rgba(94,106,210,0.15)' : 'transparent',
          color:       isWithUpmyb ? 'var(--accent-text)' : 'var(--text-3)',
          borderRadius: 3,
          padding:     isWithUpmyb ? '1px 4px' : '0',
          fontWeight:  isWithUpmyb ? 500 : 400,
          transition:  'background 350ms var(--ease-out), color 350ms var(--ease-out), padding 350ms var(--ease-out)',
        }}>
          {citedName}
        </span>
        {response.slice(idx + citedName.length)}
      </>
    )
  }

  return (
    <div style={{
      background:     'var(--surface-1)',
      border:         `1px solid ${isWithUpmyb && typingDone ? 'var(--border-3)' : 'var(--border-2)'}`,
      borderRadius:   'var(--r-lg)',
      overflow:       'hidden',
      display:        'flex',
      flexDirection:  'column',
      height:         320,
      position:       'relative',
      transition:     'border-color 300ms var(--ease-out)',
    }}>

      {/* Title bar */}
      <div style={{
        height: 36, background: 'var(--surface-2)',
        borderBottom: '1px solid var(--border-1)',
        padding: '0 12px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrafficDots />
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-3)' }}>
            {platform}
          </span>
        </div>
        <div aria-hidden="true" style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--success)',
          animation: 'pulse 2s infinite',
          opacity: isWithUpmyb && typingDone ? 1 : 0,
          transition: 'opacity 400ms',
        }} />
      </div>

      {/* Query bar */}
      <div style={{
        background: 'var(--surface-2)', borderBottom: '1px solid var(--border-1)',
        padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0,
      }}>
        <SearchSVG />
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', fontStyle: 'italic' }}>
          {query}
        </span>
      </div>

      {/* Response area */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'hidden', padding: '14px 14px 0' }}>
          {!isVisible ? <SkeletonLines /> : (
            <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.65, color: 'var(--text-2)', margin: 0 }}>
              {renderBody()}
            </p>
          )}
        </div>

        {/* Citation source row */}
        {showSource && (
          <div style={{
            padding: '8px 14px', borderTop: '1px solid var(--border-1)',
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            animation: 'fadeIn 300ms var(--ease-out)',
          }}>
            <div style={{ width: 14, height: 14, background: 'var(--surface-4)', borderRadius: 3, flexShrink: 0 }} />
            <span style={{
              fontSize: 'var(--text-xs)',
              color: isWithUpmyb ? 'var(--accent-text)' : 'var(--text-4)',
              fontFamily: "'SF Mono','Fira Code',monospace",
              transition: 'color 400ms',
              flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {citedUrl}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', flexShrink: 0 }}>
              cited source
            </span>
          </div>
        )}
      </div>

      {/* Dim veil when without Upmyb */}
      {typingDone && (
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: isWithUpmyb ? 'transparent' : 'rgba(12,12,14,0.18)',
          transition: 'background 500ms',
        }} />
      )}
    </div>
  )
}

/* ── Toggle section ── */

interface ToggleSectionProps {
  isWithUpmyb: boolean
  onToggle:    () => void
}

function ToggleSection({ isWithUpmyb, onToggle }: ToggleSectionProps) {
  return (
    <div className="flex flex-col items-center" style={{ gap: 'var(--sp-4)' }}>
      <p style={{
        fontSize: 'var(--text-md)', fontWeight: 500,
        color: 'var(--text-1)', textAlign: 'center', lineHeight: 1.4,
        minHeight: '2.8em',
      }}>
        {isWithUpmyb
          ? 'With Upmyb — cited on all three AI platforms.'
          : 'Without Upmyb — invisible to AI search.'}
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--sp-4)',
        background: 'var(--surface-1)', border: '1px solid var(--border-2)',
        borderRadius: 'var(--r-full)', padding: '5px 16px',
      }}>
        <span style={{
          fontSize: 'var(--text-sm)', fontWeight: 500,
          color: isWithUpmyb ? 'var(--text-3)' : 'var(--text-1)',
          transition: 'color 250ms',
          userSelect: 'none',
        }}>
          Without
        </span>

        <button
          type="button"
          onClick={onToggle}
          aria-pressed={isWithUpmyb}
          aria-label="Toggle Upmyb GEO optimisation"
          style={{
            width: 44, height: 24,
            background: isWithUpmyb ? 'var(--accent)' : 'var(--surface-4)',
            borderRadius: 'var(--r-full)', border: 'none',
            cursor: 'pointer', position: 'relative',
            transition: 'background 300ms var(--ease-out)', flexShrink: 0,
          }}
        >
          <span style={{
            position: 'absolute', display: 'block',
            width: 18, height: 18, borderRadius: '50%',
            background: 'white', top: 3,
            left: isWithUpmyb ? 23 : 3,
            transition: 'left 300ms var(--ease-spring)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
          }} />
        </button>

        <span style={{
          fontSize: 'var(--text-sm)', fontWeight: 500,
          color: isWithUpmyb ? 'var(--text-1)' : 'var(--text-3)',
          transition: 'color 250ms',
          userSelect: 'none',
        }}>
          With Upmyb
        </span>
      </div>

      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', textAlign: 'center', maxWidth: 380 }}>
        GEO runs automatically on every publish — structured data, indexing signals, citation monitoring.
      </p>
    </div>
  )
}

/* ── Small helpers ── */

function Cursor() {
  return (
    <span aria-hidden="true" style={{
      display: 'inline-block', width: 2, height: '0.82em',
      background: 'var(--text-3)', marginLeft: 1,
      verticalAlign: 'text-bottom',
      animation: 'blink 1s step-end infinite',
    }} />
  )
}

function TrafficDots() {
  return (
    <div aria-hidden="true" style={{ display: 'flex', gap: 5 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: '#333336' }} />
      ))}
    </div>
  )
}

function SearchSVG() {
  return (
    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function SkeletonLines() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[100, 90, 100, 82, 70].map((w, i) => (
        <div key={i} style={{
          height: 11, width: `${w}%`,
          background: 'linear-gradient(90deg, var(--surface-2), var(--surface-3), var(--surface-2))',
          backgroundSize: '600px 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: 'var(--r-sm)',
        }} />
      ))}
    </div>
  )
}
