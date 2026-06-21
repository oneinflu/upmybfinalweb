import { useState } from 'react'
import {
  ChevronDown, RotateCcw, LayoutGrid,
  Eye, Code2,
  Monitor, Tablet, Smartphone,
  Share2, Zap, Globe,
} from 'lucide-react'

export type ViewMode = 'desktop' | 'tablet' | 'mobile'
export type TabMode  = 'preview' | 'code'

interface Props {
  projectName: string
  tab:         TabMode
  setTab:      (t: TabMode) => void
  viewMode:    ViewMode
  setViewMode: (m: ViewMode) => void
  onPublish:   () => void
}

/* ── Avatar color per first letter ── */
const AVATAR_COLORS: Record<string, string> = {
  A:'#E8694A',B:'#5E6AD2',C:'#E8694A',D:'#22C55E',E:'#F59E0B',
  F:'#EC4899',G:'#06B6D4',H:'#8B5CF6',I:'#EF4444',J:'#10B981',
  K:'#F97316',L:'#6366F1',M:'#14B8A6',N:'#D946EF',O:'#F59E0B',
  P:'#5E6AD2',Q:'#84CC16',R:'#EC4899',S:'#0EA5E9',T:'#22C55E',
  U:'#5E6AD2',V:'#A78BFA',W:'#FB923C',X:'#F43F5E',Y:'#FBBF24',Z:'#34D399',
}
const avatarColor = (name: string) => AVATAR_COLORS[name[0]?.toUpperCase()] ?? '#5E6AD2'

export function TopBar({ projectName, tab, setTab, viewMode, setViewMode, onPublish }: Props) {
  return (
    <header style={{
      height: 44, flexShrink: 0,
      background: 'var(--surface-1)',
      borderBottom: '1px solid var(--border-1)',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 var(--sp-3)', gap: 'var(--sp-3)',
      userSelect: 'none',
    }}>
      {/* ── Left: project identity + tabs ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', minWidth: 0 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
          background: avatarColor(projectName),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: 'white', fontSize: 11, fontWeight: 700, lineHeight: 1 }}>
            {projectName[0]?.toUpperCase()}
          </span>
        </div>
        <ProjectDropdown name={projectName} />
        <Divider />
        <IBtn title="History"><RotateCcw size={13} /></IBtn>
        <IBtn title="Layout"><LayoutGrid size={13} /></IBtn>
        <Divider />
        <TabBtn active={tab === 'preview'} onClick={() => setTab('preview')} icon={<Eye size={13} />} label="Preview" />
        <TabBtn active={tab === 'code'}    onClick={() => setTab('code')}    icon={<Code2 size={13} />} label="Code" />
      </div>

      {/* ── Center: viewport switcher — kept prominent ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 3,
        background: 'var(--surface-2)', border: '1px solid var(--border-2)',
        borderRadius: 'var(--r-lg)', padding: 3,
      }}>
        {([
          ['desktop', Monitor,     'Desktop'],
          ['tablet',  Tablet,      'Tablet'],
          ['mobile',  Smartphone,  'Mobile'],
        ] as const).map(([mode, Icon, label]) => (
          <button
            key={mode}
            type="button"
            title={label}
            onClick={() => setViewMode(mode)}
            style={{
              width: 34, height: 26,
              background: viewMode === mode ? 'var(--accent)' : 'transparent',
              border: 'none',
              borderRadius: 6, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: viewMode === mode ? 'white' : 'var(--text-3)',
              transition: 'all 120ms',
            }}
          >
            <Icon size={14} aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* ── Right: actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', justifyContent: 'flex-end', minWidth: 0 }}>
        {/* Avatar */}
        <div style={{
          width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
          background: 'var(--surface-4)', border: '1px solid var(--border-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600, color: 'var(--text-2)',
        }}>
          U
        </div>
        <ShareBtn />
        <UpgradeBtn />
        <PublishBtn onClick={onPublish} />
      </div>
    </header>
  )
}

/* ── Sub-components ── */

function ProjectDropdown({ name }: { name: string }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 3,
        background: hov ? 'var(--surface-2)' : 'transparent',
        border: `1px solid ${hov ? 'var(--border-2)' : 'transparent'}`,
        borderRadius: 'var(--r-md)', padding: '3px 6px 3px 4px',
        cursor: 'pointer', transition: 'all 120ms',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {name}
      </span>
      <ChevronDown size={11} style={{ color: 'var(--text-3)', flexShrink: 0 }} aria-hidden="true" />
    </button>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 18, background: 'var(--border-1)', flexShrink: 0, margin: '0 2px' }} />
}

function IBtn({ children, title }: { children: React.ReactNode; title: string }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 28, height: 28, flexShrink: 0,
        background: hov ? 'var(--surface-2)' : 'transparent',
        border: `1px solid ${hov ? 'var(--border-2)' : 'transparent'}`,
        borderRadius: 'var(--r-md)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hov ? 'var(--text-1)' : 'var(--text-3)', transition: 'all 120ms',
      }}
    >
      {children}
    </button>
  )
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label?: string }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 28, padding: label ? '0 10px' : '0 8px',
        display: 'flex', alignItems: 'center', gap: 5,
        background: active ? 'var(--accent)' : hov ? 'var(--surface-2)' : 'transparent',
        border: `1px solid ${active ? 'transparent' : hov ? 'var(--border-2)' : 'transparent'}`,
        borderRadius: 'var(--r-md)', cursor: 'pointer', transition: 'all 120ms',
        color: active ? 'white' : hov ? 'var(--text-1)' : 'var(--text-3)',
        fontSize: 12, fontWeight: 500,
      }}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  )
}

function ShareBtn() {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 28, padding: '0 10px',
        display: 'flex', alignItems: 'center', gap: 5,
        background: hov ? 'var(--surface-2)' : 'transparent',
        border: `1px solid ${hov ? 'var(--border-2)' : 'var(--border-1)'}`,
        borderRadius: 'var(--r-md)', cursor: 'pointer', transition: 'all 120ms',
        color: hov ? 'var(--text-1)' : 'var(--text-2)',
        fontSize: 12, fontWeight: 500,
      }}
    >
      <Share2 size={12} aria-hidden="true" /> Share
    </button>
  )
}

function UpgradeBtn() {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 28, padding: '0 10px',
        display: 'flex', alignItems: 'center', gap: 5,
        background: hov ? 'rgba(94,106,210,0.18)' : 'rgba(94,106,210,0.10)',
        border: '1px solid rgba(94,106,210,0.25)',
        borderRadius: 'var(--r-md)', cursor: 'pointer', transition: 'all 120ms',
        color: 'var(--accent)', fontSize: 12, fontWeight: 600,
      }}
    >
      <Zap size={11} aria-hidden="true" /> Upgrade
    </button>
  )
}

function PublishBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 28, padding: '0 12px',
        display: 'flex', alignItems: 'center', gap: 5,
        background: hov ? 'var(--accent-hover)' : 'var(--accent)',
        border: 'none', borderRadius: 'var(--r-md)',
        cursor: 'pointer', transition: 'background 150ms',
        color: 'white', fontSize: 12, fontWeight: 600,
      }}
    >
      <Globe size={11} aria-hidden="true" /> Publish
    </button>
  )
}
