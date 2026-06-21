import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Paperclip, ImageIcon, Link2, X } from 'lucide-react'
import { motion } from 'framer-motion'
import type { BuildData } from '@/types/build'

/* ── Attachment button ── */
interface AttachBtnProps {
  icon: React.ReactNode
  tooltip: string
  active: boolean
  onClick: () => void
}

function AttachBtn({ icon, tooltip, active, onClick }: AttachBtnProps) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 28, height: 28, borderRadius: 'var(--r-md)', flexShrink: 0,
        background: active ? 'var(--accent-dim)' : hov ? 'var(--surface-3)' : 'transparent',
        border: `1px solid ${active ? 'rgba(94,106,210,0.25)' : hov ? 'var(--border-2)' : 'transparent'}`,
        color: active ? 'var(--accent-text)' : hov ? 'var(--text-2)' : 'var(--text-3)',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'relative', transition: 'all 150ms',
      }}
    >
      {icon}
      <span role="tooltip" style={{
        position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--surface-4)', border: '1px solid var(--border-2)',
        borderRadius: 'var(--r-md)', padding: '4px 8px',
        fontSize: 11, color: 'var(--text-2)', whiteSpace: 'nowrap',
        pointerEvents: 'none', zIndex: 20,
        opacity: hov ? 1 : 0, transition: 'opacity 150ms',
        transitionDelay: hov ? '400ms' : '0ms',
      }}>
        {tooltip}
        <span aria-hidden="true" style={{
          position: 'absolute', bottom: -4, left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: 6, height: 6, background: 'var(--surface-4)',
          borderRight: '1px solid var(--border-2)', borderBottom: '1px solid var(--border-2)',
        }} />
      </span>
    </button>
  )
}

/* ── File / URL pill ── */
function FilePill({ label, icon, onRemove }: { label: string; icon?: React.ReactNode; onRemove: () => void }) {
  const [xHov, setXHov] = useState(false)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'var(--surface-3)', border: '1px solid var(--border-2)',
      borderRadius: 'var(--r-full)', padding: '2px 6px',
      fontSize: 11, color: 'var(--text-2)', flexShrink: 0,
      animation: 'fadeIn 150ms var(--ease-out)',
    }}>
      <span style={{ color: 'var(--text-3)', display: 'flex', flexShrink: 0 }}>
        {icon ?? <Paperclip size={10} aria-hidden="true" />}
      </span>
      <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label.length > 18 ? label.slice(0, 18) + '…' : label}
      </span>
      <button type="button" onClick={onRemove}
        onMouseEnter={() => setXHov(true)} onMouseLeave={() => setXHov(false)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          color: xHov ? 'var(--danger)' : 'var(--text-3)',
          display: 'flex', alignItems: 'center', transition: 'color 120ms', flexShrink: 0,
        }}>
        <X size={10} aria-hidden="true" />
      </button>
    </span>
  )
}

function getDomain(url: string): string {
  try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '') }
  catch { return url.slice(0, 18) }
}

/* ── Hero ── */
interface HeroProps {
  onSubmit?: (data: BuildData) => void
}

export function Hero({ onSubmit }: HeroProps) {
  const [value, setValue] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [refUrl, setRefUrl] = useState('')
  const [urlOpen, setUrlOpen] = useState(false)
  const [urlDraft, setUrlDraft] = useState('')
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pdfRef = useRef<HTMLInputElement>(null)
  const mediaRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)

  const empty = !value.trim()
  const charCount = value.length
  const charColor = charCount >= 500 ? 'var(--danger)' : charCount > 450 ? 'var(--warning)' : 'var(--text-4)'

  useEffect(() => { if (urlOpen) urlInputRef.current?.focus() }, [urlOpen])

  const submit = () => {
    if (empty) return
    onSubmit?.({ idea: value, pdfFile, mediaFile, refUrl })
  }

  const commitUrl = () => {
    const val = urlDraft.trim()
    if (val) setRefUrl(val)
    setUrlOpen(false)
  }

  const containerBorder = hovered || focused ? 'var(--border-3)' : 'var(--border-2)'

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[74dvh] bg-[var(--canvas)] text-center overflow-hidden"
      style={{ padding: '72px var(--sp-6) var(--sp-6)' }}
    >
      {/* Background layers */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div aria-hidden="true" className="absolute pointer-events-none"
        style={{
          top: -120, left: '50%', transform: 'translateX(-50%)', width: 900, height: 720,
          background: 'radial-gradient(ellipse at 50% 38%, rgba(94,106,210,0.18) 0%, rgba(94,106,210,0.06) 42%, transparent 68%)'
        }} />
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(94,106,210,0.65) 50%, transparent 100%)' }} />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(12,12,14,0.55) 100%)' }} />
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 180, background: 'linear-gradient(to bottom, transparent, var(--canvas))' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full"
        style={{ animation: 'fadeIn 700ms var(--ease-out) 60ms backwards' }}>

        <h1 className="font-bold text-[var(--text-1)]"
          style={{ fontSize: 'clamp(44px, 7.5vw, var(--text-5xl))', lineHeight: 1.04, letterSpacing: '-0.05em', maxWidth: 680 }}>
          Build your website.<br />Get found on ChatGPT.
        </h1>

        <p className="text-[var(--text-2)]"
          style={{ fontSize: 'var(--text-md)', lineHeight: 1.5, maxWidth: 340, marginTop: 'var(--sp-5)' }}>
          Five minutes to live. Built for Indian businesses.
        </p>

        {/* Unified input container */}
        <div className="w-full" style={{ maxWidth: 520, marginTop: 'var(--sp-8)' }}>
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: 'rgba(20,20,22,0.92)',
              border: `1px solid ${containerBorder}`,
              borderRadius: 16,
              boxShadow: focused
                ? '0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)'
                : '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'border-color 150ms, box-shadow 200ms',
              overflow: 'hidden',
            }}
          >
            {/* Textarea — transparent, fills container */}
            <textarea
              ref={textareaRef}
              value={value}
              rows={1}
              maxLength={500}
              aria-label="Describe your business"
              placeholder={"I run a CA firm in Hyderabad, we do\ntax filing and GST registration..."}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={e => {
                setValue(e.target.value)
                const el = e.target
                el.style.height = 'auto'
                el.style.height = Math.min(el.scrollHeight, 140) + 'px'
              }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
              className="w-full block resize-none overflow-y-auto placeholder:text-[var(--text-3)]"
              style={{
                minHeight: 80, maxHeight: 160,
                background: 'transparent', border: 'none', outline: 'none',
                padding: '16px 16px 12px',
                fontSize: 'var(--text-md)', lineHeight: 1.6,
                color: 'var(--text-1)', fontFamily: 'Inter, sans-serif',
              }}
            />

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '4px 10px 10px', gap: 4 }}>
              {/* Left — attachment buttons + pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, flexWrap: 'wrap', minWidth: 0 }}>
                <AttachBtn
                  icon={<Paperclip size={14} strokeWidth={1.5} aria-hidden="true" />}
                  tooltip="Upload PDF or brochure"
                  active={!!pdfFile}
                  onClick={() => pdfRef.current?.click()}
                />
                <AttachBtn
                  icon={<ImageIcon size={14} strokeWidth={1.5} aria-hidden="true" />}
                  tooltip="Upload reference image or video"
                  active={!!mediaFile}
                  onClick={() => mediaRef.current?.click()}
                />
                {!urlOpen ? (
                  <AttachBtn
                    icon={<Link2 size={14} strokeWidth={1.5} aria-hidden="true" />}
                    tooltip="Paste a website you like"
                    active={!!refUrl}
                    onClick={() => { setUrlDraft(refUrl); setUrlOpen(true) }}
                  />
                ) : (
                  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                    <Link2 size={12} aria-hidden="true"
                      style={{ position: 'absolute', left: 8, color: 'var(--text-3)', pointerEvents: 'none', zIndex: 1 }} />
                    <input
                      ref={urlInputRef}
                      type="url"
                      value={urlDraft}
                      placeholder="paste URL..."
                      onChange={e => setUrlDraft(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitUrl()
                        if (e.key === 'Escape') { setUrlOpen(false); setUrlDraft('') }
                      }}
                      onBlur={commitUrl}
                      style={{
                        height: 28, width: 190,
                        background: 'var(--surface-3)', border: '1px solid var(--border-2)',
                        borderRadius: 'var(--r-md)', padding: '0 8px 0 26px',
                        fontSize: 12, color: 'var(--text-1)', outline: 'none',
                        animation: 'fadeIn 200ms var(--ease-out)',
                      }}
                    />
                  </div>
                )}
                {pdfFile && (
                  <FilePill label={pdfFile.name}
                    onRemove={() => { setPdfFile(null); if (pdfRef.current) pdfRef.current.value = '' }} />
                )}
                {mediaFile && (
                  <FilePill label={mediaFile.name}
                    onRemove={() => { setMediaFile(null); if (mediaRef.current) mediaRef.current.value = '' }} />
                )}
                {refUrl && !urlOpen && (
                  <FilePill label={getDomain(refUrl)} icon={<Link2 size={10} aria-hidden="true" />}
                    onRemove={() => setRefUrl('')} />
                )}
              </div>

              {/* Right — char count + submit */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: charColor, fontVariantNumeric: 'tabular-nums', transition: 'color 150ms' }}>
                  {charCount}/500
                </span>
                <motion.button
                  type="button"
                  onClick={submit}
                  disabled={empty}
                  whileTap={!empty ? { scale: 0.97 } : undefined}
                  transition={{ duration: 0.1, ease: [0.32, 0.72, 0, 1] }}
                  style={{
                    height: 32, padding: '0 14px', borderRadius: 'var(--r-md)',
                    background: 'var(--accent)', color: 'white', border: 'none',
                    cursor: empty ? 'not-allowed' : 'pointer',
                    fontSize: 'var(--text-sm)', fontWeight: 500,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    opacity: empty ? 0.4 : 1, transition: 'opacity 150ms',
                    flexShrink: 0,
                  }}
                >
                  Build free <ArrowRight size={12} strokeWidth={2} aria-hidden="true" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input ref={pdfRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) setPdfFile(f); e.target.value = '' }} />
          <input ref={mediaRef} type="file" accept="image/*,video/*" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) setMediaFile(f); e.target.value = '' }} />
        </div>

        <p className="text-[var(--text-3)]" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--sp-3)' }}>
          No credit card needed · First 48 hours free
        </p>
      </div>
    </section>
  )
}
