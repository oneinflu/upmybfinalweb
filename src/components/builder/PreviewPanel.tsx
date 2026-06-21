import { useState, useEffect } from 'react'
import type { ViewMode, TabMode } from './TopBar'
import { SectionOptions } from './SectionOptions'
import { Copy, Download } from 'lucide-react'

/* ── Viewport widths ── */

const VIEWPORT_W: Record<ViewMode, string> = {
  desktop: '100%',
  tablet:  '768px',
  mobile:  '375px',
}

/* ── Skeleton loading schedule ── */

const SECTIONS = [
  { id: 'nav',      height: 64  },
  { id: 'hero',     height: 400 },
  { id: 'features', height: 240 },
  { id: 'pricing',  height: 280 },
  { id: 'footer',   height: 80  },
]

const LOAD_DELAYS: Record<string, number> = {
  nav: 300, hero: 700, features: 1100, pricing: 1600, footer: 2100,
}

/* ── Props ── */

interface Props {
  viewMode:  ViewMode
  tab:       TabMode
}

/* ── Panel ── */

const OPTIONS_PANEL_HEIGHT = 360 // estimate, clamps the fixed overlay inside the viewport
const OPTIONS_PANEL_MARGIN = 16

export function PreviewPanel({ viewMode, tab }: Props) {
  const [loaded,       setLoaded]       = useState<Set<string>>(new Set())
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [optSection,   setOptSection]   = useState<{ id: string; name: string } | null>(null)
  const [optTop,        setOptTop]        = useState(80)

  useEffect(() => {
    const timers = SECTIONS.map(({ id }) =>
      setTimeout(() => setLoaded(prev => new Set([...prev, id])), LOAD_DELAYS[id])
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleClick = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clampedTop = Math.min(
      Math.max(rect.top, OPTIONS_PANEL_MARGIN),
      window.innerHeight - OPTIONS_PANEL_HEIGHT - OPTIONS_PANEL_MARGIN
    )
    setActiveSection(id)
    setOptSection({ id, name: id.charAt(0).toUpperCase() + id.slice(1) })
    setOptTop(Math.max(clampedTop, OPTIONS_PANEL_MARGIN))
  }

  const closeOpts = () => { setOptSection(null); setActiveSection(null) }

  if (tab === 'code') return <CodeView />

  return (
    <div style={{
      flex: 1, overflow: 'auto', position: 'relative',
      background: '#1a1a1c',
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      padding: '24px',
    }}>
      {/* Viewport frame */}
      <div style={{
        width: VIEWPORT_W[viewMode],
        maxWidth: viewMode === 'desktop' ? 1280 : undefined,
        background: 'white',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.5)',
        transition: 'width 280ms var(--ease-out)',
        minHeight: 'calc(100% - 48px)',
      }}>
        {SECTIONS.map(({ id, height }) =>
          loaded.has(id)
            ? <SiteSection key={id} id={id} active={activeSection === id} onClick={e => handleClick(id, e)} />
            : <SkeletonSection key={id} height={height} />
        )}
      </div>

      {/* Section options overlay — fixed to viewport, anchored near the clicked section so it never
          requires scrolling to reach, regardless of which section (e.g. pricing, far down) was clicked. */}
      {optSection && (
        <div style={{ position: 'fixed', top: optTop, right: 36, zIndex: 40 }}>
          <SectionOptions
            sectionId={optSection.id}
            sectionName={optSection.name}
            onSelect={() => setActiveSection(optSection.id)}
            onClose={closeOpts}
          />
        </div>
      )}
    </div>
  )
}

/* ── Skeleton ── */

function SkeletonSection({ height }: { height: number }) {
  return (
    <div style={{
      width: '100%', height,
      background: 'linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%)',
      backgroundSize: '600px 100%',
      animation: 'shimmer 1.4s linear infinite',
    }} />
  )
}

/* ── Real site sections ── */

function SiteSection({ id, active, onClick }: { id: string; active: boolean; onClick: (e: React.MouseEvent<HTMLDivElement>) => void }) {
  const [hov, setHov] = useState(false)
  const highlighted = active || hov

  const wrap = (children: React.ReactNode) => (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', cursor: 'pointer',
        outline: highlighted
          ? `2px solid ${active ? '#5E6AD2' : 'rgba(94,106,210,0.40)'}`
          : '2px solid transparent',
        outlineOffset: -2,
        transition: 'outline-color 150ms',
        animation: 'snapIn 350ms var(--ease-out)',
      }}
    >
      {/* Section label on hover */}
      {highlighted && (
        <div style={{
          position: 'absolute', top: 6, left: 6, zIndex: 10,
          background: '#5E6AD2', color: 'white',
          fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
          padding: '2px 8px', borderRadius: 4,
          animation: 'fadeIn 120ms',
        }}>
          {id}
        </div>
      )}
      {children}
    </div>
  )

  if (id === 'nav') return wrap(
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 48px', height: 64, background: 'white', borderBottom: '1px solid #f0f0f0' }}>
      <span style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>YourBrand</span>
      <div style={{ display: 'flex', gap: 28, flex: 1, justifyContent: 'center' }}>
        {['Services', 'About', 'Contact'].map(l => (
          <span key={l} style={{ fontSize: 14, color: '#555', cursor: 'pointer' }}>{l}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, color: '#555', cursor: 'pointer' }}>Sign in</span>
        <span style={{ fontSize: 13, fontWeight: 600, padding: '7px 16px', background: '#111', color: 'white', borderRadius: 6, cursor: 'pointer' }}>Book a visit</span>
      </div>
    </div>
  )

  if (id === 'hero') return wrap(
    <div style={{ background: '#fafaf8', padding: '80px 48px 80px', display: 'flex', alignItems: 'center', gap: 48, minHeight: 400 }}>
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#f0ede8', border: '1px solid #e8e2d9',
          borderRadius: 20, padding: '4px 12px', marginBottom: 24,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#666' }}>
            Accepting new customers
          </span>
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, color: '#111', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
          Professional services<br />
          <span style={{ color: '#7c6d5a' }}>built for growth.</span>
        </h1>
        <p style={{ fontSize: 17, color: '#666', lineHeight: 1.65, margin: '0 0 32px', maxWidth: 420 }}>
          A trusted practice built around quality, transparency, and care. Get started in minutes.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ padding: '12px 24px', background: '#5E6AD2', color: 'white', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Get in touch →
          </span>
          <span style={{ padding: '12px 24px', border: '1px solid #ddd', color: '#444', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
            Learn more
          </span>
        </div>
        <div style={{ display: 'flex', gap: 32, marginTop: 40, borderTop: '1px solid #eee', paddingTop: 24 }}>
          {[['18', 'Years experience'], ['9,400+', 'Happy clients'], ['2 min', 'Avg. response']].map(([v, l]) => (
            <div key={l}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 2px' }}>{v}</p>
              <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        width: 380, height: 300, flexShrink: 0, background: '#e8e2d9',
        borderRadius: 12, overflow: 'hidden',
        backgroundImage: 'linear-gradient(135deg, #d4c9ba 0%, #c4b5a5 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 13, color: '#9a8b7c' }}>Hero image</span>
      </div>
    </div>
  )

  if (id === 'features') return wrap(
    <div style={{ padding: '72px 48px', background: 'white' }}>
      <h2 style={{ fontSize: 30, fontWeight: 700, color: '#111', margin: '0 0 8px', letterSpacing: '-0.02em' }}>What we offer</h2>
      <p style={{ fontSize: 15, color: '#666', margin: '0 0 48px' }}>Everything you need in one place.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {[
          ['Expert Guidance', 'Professional advice tailored to your specific goals and situation.'],
          ['Fast Results', 'Efficient delivery without ever compromising on quality.'],
          ['Ongoing Support', 'We stay with you long after the first engagement.'],
        ].map(([h, p]) => (
          <div key={h as string} style={{ padding: 24, border: '1px solid #eee', borderRadius: 10 }}>
            <div style={{ width: 36, height: 36, background: '#f5f3ff', borderRadius: 8, marginBottom: 14 }} />
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: '0 0 8px' }}>{h}</h3>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.55, margin: 0 }}>{p}</p>
          </div>
        ))}
      </div>
    </div>
  )

  if (id === 'pricing') return wrap(
    <div style={{ padding: '72px 48px', background: '#fafaf8' }}>
      <h2 style={{ fontSize: 30, fontWeight: 700, color: '#111', margin: '0 0 8px', textAlign: 'center', letterSpacing: '-0.02em' }}>Simple, transparent pricing</h2>
      <p style={{ fontSize: 15, color: '#666', margin: '0 0 48px', textAlign: 'center' }}>No hidden fees. Cancel anytime.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, maxWidth: 640, margin: '0 auto' }}>
        {[
          ['Starter', '799', false],
          ['Business', '1,999', true],
          ['Agency',   '4,999', false],
        ].map(([n, p, feat]) => (
          <div key={n as string} style={{ padding: '24px 20px', border: `1px solid ${feat ? '#5E6AD2' : '#eee'}`, borderRadius: 10, textAlign: 'center', background: 'white' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999', margin: '0 0 10px' }}>{n}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              ₹{p}<span style={{ fontSize: 13, fontWeight: 400, color: '#999' }}>/mo</span>
            </p>
            <p style={{ fontSize: 12, color: '#bbb', margin: '0 0 18px' }}>billed monthly</p>
            <span style={{
              display: 'block', padding: '8px', textAlign: 'center', cursor: 'pointer',
              background: feat ? '#5E6AD2' : 'white', color: feat ? 'white' : '#333',
              border: '1px solid #ddd', borderRadius: 6, fontSize: 13, fontWeight: feat ? 600 : 400,
            }}>
              {feat ? 'Get started' : 'Learn more'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  if (id === 'footer') return wrap(
    <div style={{ padding: '28px 48px', borderTop: '1px solid #eee', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>YourBrand</span>
      <div style={{ display: 'flex', gap: 24 }}>
        {['Privacy', 'Terms', 'Contact'].map(l => (
          <span key={l} style={{ fontSize: 13, color: '#999', cursor: 'pointer' }}>{l}</span>
        ))}
      </div>
      <span style={{ fontSize: 12, color: '#bbb' }}>© 2025 YourBrand</span>
    </div>
  )

  return null
}

/* ── Code view ── */

const MOCK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your Website</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <nav class="nav">
    <div class="brand">YourBrand</div>
    <ul class="links">
      <li><a href="#services">Services</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <a href="#contact" class="btn">Book a visit</a>
  </nav>

  <section class="hero">
    <div class="hero-content">
      <h1>Professional services<br>built for growth.</h1>
      <p>Trusted by businesses across India.</p>
      <div class="hero-actions">
        <a href="#contact" class="btn-primary">Get in touch →</a>
        <a href="#services" class="btn-ghost">Learn more</a>
      </div>
    </div>
  </section>

  <section class="features">
    <h2>What we offer</h2>
    <div class="grid">
      <div class="card">
        <h3>Expert Guidance</h3>
        <p>Professional advice for your goals.</p>
      </div>
      <div class="card">
        <h3>Fast Results</h3>
        <p>Efficient delivery, quality-first.</p>
      </div>
      <div class="card">
        <h3>Ongoing Support</h3>
        <p>We stay with you long-term.</p>
      </div>
    </div>
  </section>

  <footer class="footer">
    <p class="brand">YourBrand</p>
    <p class="copy">© 2025 YourBrand</p>
  </footer>
</body>
</html>`

function CodeView() {
  const [copied, setCopied] = useState(false)
  const lines = MOCK_HTML.split('\n')

  const copy = () => {
    navigator.clipboard?.writeText(MOCK_HTML)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--surface-1)' }}>
      {/* Toolbar */}
      <div style={{
        height: 36, flexShrink: 0, borderBottom: '1px solid var(--border-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 var(--sp-4)',
      }}>
        <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'monospace' }}>index.html</span>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          <CodeBtn icon={<Copy size={11} />} label={copied ? 'Copied' : 'Copy'} onClick={copy} />
          <CodeBtn icon={<Download size={11} />} label="Download" />
        </div>
      </div>
      {/* Lines */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', fontSize: 12, lineHeight: 1.7, fontFamily: "'SF Mono','Fira Code',monospace" }}>
        <div style={{ width: 36, flexShrink: 0, paddingTop: 12, borderRight: '1px solid var(--border-1)', userSelect: 'none' }}>
          {lines.map((_, i) => (
            <div key={i} style={{ height: '1.7em', paddingRight: 8, textAlign: 'right', color: 'var(--text-4)', fontSize: 11 }}>{i + 1}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '12px 16px', whiteSpace: 'pre', overflowX: 'auto' }}>
          {lines.map((line, i) => (
            <div key={i} style={{ height: '1.7em', lineHeight: 1.7 }}>
              <HtmlLine text={line} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HtmlLine({ text }: { text: string }) {
  const parts: { t: string; c: string }[] = []
  const regex = /<!--[\s\S]*?-->|<\/?[\w-]+(?:\s[^>]*)?\/?>|"[^"]*"|[\w-]+=(?="|')/g
  let last = 0
  for (const m of text.matchAll(regex)) {
    if (m.index! > last) parts.push({ t: text.slice(last, m.index), c: 'var(--text-1)' })
    const v = m[0]
    if (v.startsWith('<!--'))   parts.push({ t: v, c: 'var(--text-4)' })
    else if (v.startsWith('<')) parts.push({ t: v, c: 'var(--text-2)' })
    else if (v.startsWith('"')) parts.push({ t: v, c: 'var(--success)' })
    else                        parts.push({ t: v, c: 'var(--accent-text)' })
    last = m.index! + v.length
  }
  if (last < text.length) parts.push({ t: text.slice(last), c: 'var(--text-1)' })
  return <>{parts.map((p, i) => <span key={i} style={{ color: p.c }}>{p.t}</span>)}</>
}

function CodeBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 24, padding: '0 8px', display: 'flex', alignItems: 'center', gap: 4,
        background: hov ? 'var(--surface-3)' : 'var(--surface-2)',
        border: `1px solid ${hov ? 'var(--border-2)' : 'var(--border-1)'}`,
        borderRadius: 'var(--r-sm)', cursor: 'pointer', transition: 'all 120ms',
        fontSize: 11, color: 'var(--text-2)',
      }}
    >
      {icon}{label}
    </button>
  )
}
