import { useState, useRef, useEffect } from 'react'
import {
  RotateCcw, ThumbsUp, ThumbsDown, Share2, MoreHorizontal,
  Bookmark, ChevronRight, Plus, ArrowUp, Loader2, X, Zap,
} from 'lucide-react'
import { detectType } from '@/data/questions'

/* ── Types ── */

interface UserMsg   { kind: 'user';     text: string }
interface AiCard    { kind: 'ai-card';  title: string; detail: string; pages: string[] }
interface AiText    { kind: 'ai-text';  text: string }
interface Thinking  { kind: 'thinking' }

type Message = UserMsg | AiCard | AiText | Thinking

/* ── Quick actions by business type ── */

const QUICK_ACTIONS: Record<string, string[]> = {
  clinic:     ['Add appointment booking', 'Add doctor profiles', 'Add FAQ section', 'Add testimonials'],
  ecommerce:  ['Add product gallery', 'Add size guide', 'Add reviews section', 'Setup cart flow'],
  ca:         ['Add service packages', 'Add GST calculator', 'Add client portal', 'Add case studies'],
  restaurant: ['Add menu section', 'Add table booking', 'Add delivery info', 'Add photo gallery'],
  education:  ['Add course catalog', 'Add demo class CTA', 'Add faculty section', 'Add student reviews'],
  consultant: ['Add case studies', 'Add booking calendar', 'Add testimonials', 'Add ROI calculator'],
  general:    ['Write better copy', 'Add testimonials', 'Add contact form', 'Generate FAQ'],
}

function getDetail(idea: string): { title: string; detail: string; pages: string[] } {
  const type = detectType(idea)
  const map: Record<string, { title: string; detail: string; pages: string[] }> = {
    clinic: {
      title: 'Healthcare website scaffolded',
      detail: 'Built a patient-ready clinic website with appointment booking hooks, service listing, and trust signals. Schema markup for local medical practice applied.',
      pages: ['Home', 'Services', 'About', 'Contact', 'Pricing'],
    },
    ecommerce: {
      title: 'E-commerce storefront built',
      detail: 'Created a product-first store layout with category navigation, hero banner, and checkout flow hooks. Product schema and Open Graph tags applied.',
      pages: ['Home', 'Products', 'About', 'Contact', 'Cart'],
    },
    ca: {
      title: 'CA firm website generated',
      detail: 'Built a professional services site with service tiers, compliance trust signals, and lead capture forms. FAQ schema and breadcrumb markup applied.',
      pages: ['Home', 'Services', 'About', 'Resources', 'Contact'],
    },
    restaurant: {
      title: 'Restaurant site created',
      detail: 'Built a restaurant site with menu showcase, location info, and reservation CTA. Restaurant schema markup and local SEO signals applied.',
      pages: ['Home', 'Menu', 'About', 'Gallery', 'Contact'],
    },
    education: {
      title: 'Education platform scaffolded',
      detail: 'Created a course showcase with enrollment CTAs, faculty listing, and demo class flows. Education schema and FAQ markup applied.',
      pages: ['Home', 'Courses', 'Faculty', 'About', 'Contact'],
    },
    consultant: {
      title: 'Consulting website built',
      detail: 'Built a credibility-first layout with case studies, service tiers, and booking hooks. Professional services schema applied.',
      pages: ['Home', 'Services', 'Case Studies', 'About', 'Contact'],
    },
    general: {
      title: 'Business website generated',
      detail: 'Created a professional 5-page website with hero, services, social proof, and lead capture. GEO schema markup applied throughout.',
      pages: ['Home', 'Services', 'About', 'Contact', 'Pricing'],
    },
  }
  return map[type] ?? map.general
}

/* ── Props ── */

interface Props {
  idea: string
  projectName: string
}

/* ── Chat Panel ── */

export function ChatPanel({ idea, projectName }: Props) {
  const aiCard = getDetail(idea)
  const bType  = detectType(idea)
  const chips  = QUICK_ACTIONS[bType] ?? QUICK_ACTIONS.general

  const [messages,   setMessages]   = useState<Message[]>([
    { kind: 'user',    text: idea },
    { kind: 'ai-card', ...aiCard  },
  ])
  const [input,      setInput]      = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(true)

  const threadRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const send = (text: string) => {
    if (!text.trim() || isThinking) return
    setInput('')
    setMessages(prev => [...prev, { kind: 'user', text: text.trim() }])
    setIsThinking(true)
    setMessages(prev => [...prev, { kind: 'thinking' }])

    setTimeout(() => {
      setIsThinking(false)
      setMessages(prev => {
        const next = prev.filter(m => m.kind !== 'thinking')
        return [...next, {
          kind: 'ai-text' as const,
          text: `I've updated the ${text.includes('color') ? 'color scheme' : text.includes('add') || text.includes('Add') ? 'layout with the new section' : 'content'} as requested. The changes are reflected in the preview.`,
        }]
      })
    }, 1800)
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div style={{
      width: 380, flexShrink: 0,
      borderRight: '1px solid var(--border-1)',
      background: 'var(--canvas)',
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
    }}>
      {/* ── Panel header ── */}
      <div style={{
        height: 40, flexShrink: 0, padding: '0 var(--sp-4)',
        borderBottom: '1px solid var(--border-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {projectName}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
          {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* ── Thread ── */}
      <div
        ref={threadRef}
        style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}
      >
        {messages.map((msg, i) => {
          if (msg.kind === 'user')    return <UserBubble key={i} text={msg.text} />
          if (msg.kind === 'ai-card') return <AiCardBubble key={i} msg={msg} />
          if (msg.kind === 'ai-text') return <AiTextBubble key={i} text={msg.text} />
          if (msg.kind === 'thinking') return <ThinkingBubble key={i} />
          return null
        })}
      </div>

      {/* ── Quick actions ── */}
      <div style={{
        flexShrink: 0, padding: 'var(--sp-2) var(--sp-3)',
        borderTop: '1px solid var(--border-1)',
        overflowX: 'auto',
        display: 'flex', gap: 'var(--sp-2)', alignItems: 'center',
        scrollbarWidth: 'none',
      }}>
        {chips.map(chip => (
          <Chip key={chip} label={chip} onClick={() => send(chip)} />
        ))}
      </div>

      {/* ── Upgrade bar ── */}
      {showUpgrade && (
        <div style={{
          flexShrink: 0, padding: 'var(--sp-2) var(--sp-3)',
          background: 'var(--surface-1)', borderTop: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)', flex: 1 }}>
            Free plan · 3 AI edits left today
          </span>
          <button
            type="button"
            style={{
              height: 22, padding: '0 8px',
              background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: 'var(--r-md)', fontSize: 11, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 3,
            }}
          >
            <Zap size={10} aria-hidden="true" /> Upgrade
          </button>
          <button
            type="button"
            onClick={() => setShowUpgrade(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', alignItems: 'center', padding: 2 }}
          >
            <X size={12} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* ── Input ── */}
      <div style={{
        flexShrink: 0, padding: 'var(--sp-3)',
        borderTop: '1px solid var(--border-1)',
        background: 'var(--surface-1)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 'var(--sp-2)',
          background: 'var(--surface-2)', border: '1px solid var(--border-2)',
          borderRadius: 'var(--r-lg)', padding: '8px 10px',
        }}>
          <button
            type="button"
            style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', padding: 0, alignSelf: 'flex-end', paddingBottom: 2 }}
          >
            <Plus size={16} aria-hidden="true" />
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask Upmyb..."
            rows={1}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              resize: 'none', fontSize: 13, color: 'var(--text-1)',
              lineHeight: 1.5, fontFamily: 'inherit', padding: 0,
              minHeight: 20, maxHeight: 100,
            }}
          />
          <button
            type="button"
            onClick={() => send(input)}
            disabled={!input.trim() || isThinking}
            style={{
              flexShrink: 0, width: 26, height: 26,
              background: input.trim() && !isThinking ? 'var(--accent)' : 'var(--surface-3)',
              border: 'none', borderRadius: 'var(--r-sm)',
              cursor: input.trim() && !isThinking ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: input.trim() && !isThinking ? 'white' : 'var(--text-4)',
              transition: 'all 150ms', alignSelf: 'flex-end',
            }}
          >
            <ArrowUp size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Message variants ── */

function UserBubble({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{
        maxWidth: '85%',
        background: 'var(--surface-2)', border: '1px solid var(--border-2)',
        borderRadius: '12px 12px 4px 12px',
        padding: 'var(--sp-3) var(--sp-4)',
        fontSize: 13, color: 'var(--text-1)', lineHeight: 1.55,
      }}>
        {text}
      </div>
    </div>
  )
}

function AiCardBubble({ msg }: { msg: AiCard }) {
  const [activeTab, setActiveTab] = useState<'details' | 'preview'>('details')
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
      {/* Card */}
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border-2)',
        borderRadius: 'var(--r-lg)', overflow: 'hidden',
      }}>
        {/* Card header */}
        <div style={{
          padding: 'var(--sp-3) var(--sp-4)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--sp-2)',
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.4 }}>
            {msg.title}
          </span>
          <button
            type="button"
            onClick={() => setBookmarked(b => !b)}
            style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: bookmarked ? 'var(--accent)' : 'var(--text-4)', padding: 2, marginTop: -1 }}
          >
            <Bookmark size={13} aria-hidden="true" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)',
          background: 'var(--surface-2)',
        }}>
          {(['details', 'preview'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              style={{
                height: 30, padding: '0 12px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 500, textTransform: 'capitalize',
                color: activeTab === t ? 'var(--text-1)' : 'var(--text-3)',
                borderBottom: `2px solid ${activeTab === t ? 'var(--accent)' : 'transparent'}`,
                marginBottom: -1, transition: 'color 150ms',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: 'var(--sp-3) var(--sp-4)' }}>
          {activeTab === 'details' ? (
            <>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 var(--sp-3)' }}>
                {msg.detail}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {msg.pages.map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-4)', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{p} page</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{
              height: 80, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 11, color: 'var(--text-4)' }}>Preview in the panel →</span>
            </div>
          )}
        </div>
      </div>

      {/* Reaction row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 'var(--sp-1)' }}>
        <ReactionBtn title="Undo"><RotateCcw size={12} /></ReactionBtn>
        <ReactionBtn title="Good"><ThumbsUp size={12} /></ReactionBtn>
        <ReactionBtn title="Bad"><ThumbsDown size={12} /></ReactionBtn>
        <ReactionBtn title="Share"><Share2 size={12} /></ReactionBtn>
        <ReactionBtn title="More"><MoreHorizontal size={12} /></ReactionBtn>
      </div>
    </div>
  )
}

function AiTextBubble({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
      <div style={{
        maxWidth: '90%',
        fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6,
        padding: 'var(--sp-3) var(--sp-4)',
        background: 'var(--surface-1)', border: '1px solid var(--border-1)',
        borderRadius: '12px 12px 12px 4px',
      }}>
        {text}
      </div>
      <div style={{ display: 'flex', gap: 4, paddingLeft: 'var(--sp-1)' }}>
        <ReactionBtn title="Undo"><RotateCcw size={12} /></ReactionBtn>
        <ReactionBtn title="Good"><ThumbsUp size={12} /></ReactionBtn>
        <ReactionBtn title="Bad"><ThumbsDown size={12} /></ReactionBtn>
        <ReactionBtn title="More"><MoreHorizontal size={12} /></ReactionBtn>
      </div>
    </div>
  )
}

function ThinkingBubble() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: 'var(--sp-2) 0' }}>
      <Loader2 size={13} style={{ color: 'var(--accent)', animation: 'spin 800ms linear infinite' }} aria-hidden="true" />
      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Upmyb is working…</span>
    </div>
  )
}

function ReactionBtn({ children, title }: { children: React.ReactNode; title: string }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 24, height: 24, flexShrink: 0,
        background: hov ? 'var(--surface-2)' : 'transparent',
        border: `1px solid ${hov ? 'var(--border-2)' : 'transparent'}`,
        borderRadius: 'var(--r-sm)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hov ? 'var(--text-2)' : 'var(--text-4)', transition: 'all 120ms',
      }}
    >
      {children}
    </button>
  )
}

function Chip({ label, onClick }: { label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flexShrink: 0, height: 26, padding: '0 10px',
        background: 'transparent',
        border: `1px solid ${hov ? 'var(--border-3)' : 'var(--border-2)'}`,
        borderRadius: 'var(--r-full)', cursor: 'pointer', transition: 'all 120ms',
        fontSize: 12, fontWeight: 500,
        color: hov ? 'var(--text-1)' : 'var(--text-2)',
        display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
      }}
    >
      {label} <ChevronRight size={10} style={{ color: 'var(--text-4)' }} aria-hidden="true" />
    </button>
  )
}
