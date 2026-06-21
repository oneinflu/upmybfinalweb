import { useState } from 'react'
import { X } from 'lucide-react'

interface Option {
  id:          string
  label:       string
  description: string
  sketch:      'centered' | 'split' | 'wide' | 'grid' | 'list' | 'minimal'
}

const SECTION_OPTIONS: Record<string, Option[]> = {
  nav: [
    { id: 'transparent', label: 'Transparent',   description: 'Overlays the hero, no background',  sketch: 'minimal' },
    { id: 'solid',       label: 'Solid bar',      description: 'White background, always visible',   sketch: 'centered' },
    { id: 'sticky',      label: 'Sticky scroll',  description: 'Follows user while scrolling',       sketch: 'wide' },
  ],
  hero: [
    { id: 'centered',    label: 'Centered',       description: 'Headline and CTA centered',          sketch: 'centered' },
    { id: 'split',       label: 'Split layout',   description: 'Text left, visual right',            sketch: 'split' },
    { id: 'bold',        label: 'Bold fullscreen',description: 'Edge-to-edge with background image', sketch: 'wide' },
  ],
  trust: [
    { id: 'marquee',     label: 'Sliding logos',  description: 'Auto-scrolling logo strip',          sketch: 'wide' },
    { id: 'grid',        label: 'Logo grid',      description: 'Static 4-column grid',               sketch: 'grid' },
    { id: 'minimal',     label: 'Text list',      description: 'Plain names, no icons',              sketch: 'list' },
  ],
  features: [
    { id: 'grid',        label: '3-column grid',  description: 'Cards in a single row',              sketch: 'grid' },
    { id: 'alternating', label: 'Alternating',    description: 'Image and text alternate sides',     sketch: 'split' },
    { id: 'list',        label: 'Icon list',      description: 'Vertical list with icons',           sketch: 'list' },
  ],
  pricing: [
    { id: 'cards',       label: 'Card tiers',     description: '3 plan cards side by side',          sketch: 'grid' },
    { id: 'table',       label: 'Feature table',  description: 'Comparison matrix',                  sketch: 'wide' },
    { id: 'minimal',     label: 'Minimal',        description: 'Simple list of tiers',               sketch: 'list' },
  ],
  footer: [
    { id: 'minimal',     label: 'Minimal',        description: 'Logo + copyright only',              sketch: 'minimal' },
    { id: 'standard',    label: 'Standard',        description: '4 link columns + legal row',         sketch: 'grid' },
    { id: 'full',        label: 'Full',            description: '5 columns with social links',        sketch: 'wide' },
  ],
}

const DEFAULT_OPTIONS: Option[] = [
  { id: 'default',     label: 'Default',        description: 'Standard layout',                    sketch: 'centered' },
  { id: 'compact',     label: 'Compact',        description: 'Reduced spacing and padding',        sketch: 'minimal' },
  { id: 'expanded',    label: 'Expanded',       description: 'More breathing room',                sketch: 'wide' },
]

interface Props {
  sectionId:   string
  sectionName: string
  onSelect:    (optionId: string) => void
  onClose:     () => void
}

export function SectionOptions({ sectionId, sectionName, onSelect, onClose }: Props) {
  const [selected, setSelected]   = useState<string | null>(null)
  const options = SECTION_OPTIONS[sectionId] ?? DEFAULT_OPTIONS

  const pick = (id: string) => {
    setSelected(id)
    setTimeout(() => { onSelect(id); onClose() }, 200)
  }

  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border-3)',
        borderRadius: 'var(--r-lg)',
        padding: 'var(--sp-4)',
        width: 280,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        animation: 'scaleIn 200ms var(--ease-out)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-1)' }}>
          {sectionName} options
        </span>
        <CloseBtn onClick={onClose} />
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        {options.map(opt => (
          <OptionCard
            key={opt.id}
            option={opt}
            chosen={selected === opt.id}
            onClick={() => pick(opt.id)}
          />
        ))}
      </div>

      {/* Nudge to chat */}
      <div style={{ borderTop: '1px solid var(--border-1)', marginTop: 'var(--sp-3)', paddingTop: 'var(--sp-3)' }}>
        <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', textAlign: 'center' }}>
          or describe what you want →
        </span>
      </div>
    </div>
  )
}

/* ── Option card ── */

function OptionCard({ option, chosen, onClick }: { option: Option; chosen: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      style={{
        display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start',
        background: chosen ? 'var(--accent-dim)' : hov ? 'var(--surface-4)' : 'var(--surface-3)',
        border: `1px solid ${chosen ? 'rgba(94,106,210,0.3)' : hov ? 'var(--border-3)' : 'var(--border-2)'}`,
        borderRadius: 'var(--r-md)', padding: 'var(--sp-3)',
        cursor: 'pointer', transition: 'all 150ms',
      }}
    >
      <OptionSketch type={option.sketch} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)', margin: '0 0 2px 0' }}>
          {option.label}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.4, margin: 0 }}>
          {option.description}
        </p>
      </div>
    </div>
  )
}

/* ── Sketch thumbnail ── */

function OptionSketch({ type }: { type: Option['sketch'] }) {
  return (
    <div style={{
      width: 56, height: 40, flexShrink: 0,
      background: 'var(--surface-1)',
      border: '1px solid var(--border-1)',
      borderRadius: 'var(--r-sm)',
      overflow: 'hidden', padding: 6,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3,
    }}>
      {type === 'centered' && (
        <>
          <Line w="60%" centered />
          <Line w="80%" centered />
          <Line w="40%" centered />
        </>
      )}
      {type === 'split' && (
        <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: '100%' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Line w="90%" /><Line w="70%" /><Line w="50%" />
          </div>
          <div style={{ width: 18, height: 24, background: 'var(--border-3)', borderRadius: 2, flexShrink: 0 }} />
        </div>
      )}
      {type === 'wide' && (
        <>
          <Line w="100%" h={10} />
          <Line w="70%" /><Line w="50%" />
        </>
      )}
      {type === 'grid' && (
        <div style={{ display: 'flex', gap: 3 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Line w="100%" /><Line w="80%" />
            </div>
          ))}
        </div>
      )}
      {type === 'list' && (
        <>
          <Line w="85%" /><Line w="70%" /><Line w="60%" />
        </>
      )}
      {type === 'minimal' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Line w="30%" /><Line w="50%" />
        </div>
      )}
    </div>
  )
}

function Line({ w, h = 3, centered }: { w: string; h?: number; centered?: boolean }) {
  return (
    <div style={{
      width: w, height: h, marginLeft: centered ? 'auto' : undefined, marginRight: centered ? 'auto' : undefined,
      background: 'var(--border-3)', borderRadius: 1,
    }} />
  )
}

function CloseBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 2,
        color: hov ? 'var(--text-1)' : 'var(--text-3)',
        display: 'flex', alignItems: 'center', transition: 'color 120ms',
      }}
    >
      <X size={14} aria-hidden="true" />
    </button>
  )
}
