import { useState } from 'react'
import { ArrowRight, FileText, Loader2, Paperclip, Link2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import type { BuildData } from '@/types/build'

interface Props {
  data:      BuildData
  onBack:    () => void
  onSuccess: (phone: string) => void
}

function getDomain(url: string): string {
  try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '') }
  catch { return url.slice(0, 18) }
}

export function PhoneEntry({ data, onBack, onSuccess }: Props) {
  const [phone,    setPhone]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [focused,  setFocused]  = useState(false)

  const digits  = phone.replace(/\D/g, '').slice(0, 10)
  const display = digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits
  const ready   = digits.length === 10

  const firstAttachment = data.pdfFile?.name ?? data.mediaFile?.name ?? (data.refUrl ? getDomain(data.refUrl) : null)
  const attachIcon      = data.refUrl && !data.pdfFile && !data.mediaFile
    ? <Link2  size={10} aria-hidden="true" />
    : <Paperclip size={10} aria-hidden="true" />

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhone(raw)
  }

  const handleSubmit = async () => {
    if (!ready || loading) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800)) // stub — replace with real OTP send API
    setLoading(false)
    onSuccess(digits)
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--canvas)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'var(--sp-6)', position: 'relative',
    }}>
      {/* Top-left logo */}
      <button
        type="button"
        onClick={onBack}
        style={{
          position: 'absolute', top: 'var(--sp-5)', left: 'var(--sp-6)',
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
        aria-label="Back to home"
      >
        <Logo size={14} />
      </button>

      {/* Center card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        style={{
          width: '100%', maxWidth: 380,
          display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)',
        }}
      >
        {/* Idea preview */}
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-1)',
          borderRadius: 'var(--r-lg)',
          padding: 'var(--sp-4)',
          display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start',
        }}>
          <div style={{
            width: 28, height: 28, flexShrink: 0,
            background: 'var(--surface-3)', borderRadius: 'var(--r-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={13} style={{ color: 'var(--text-3)' }} aria-hidden="true" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-3)',
            }}>
              Your idea
            </span>
            <p style={{
              fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, margin: 0,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {data.idea}
            </p>
            {firstAttachment && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                marginTop: 4, fontSize: 11, color: 'var(--text-3)',
              }}>
                <span style={{ display: 'flex', color: 'var(--text-3)' }}>{attachIcon}</span>
                {firstAttachment}
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
            <h1 style={{
              fontSize: 22, fontWeight: 700, color: 'var(--text-1)',
              letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0,
            }}>
              What's your number?
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>
              We'll send a 6-digit OTP. No password. No spam.
            </p>
          </div>

          {/* Phone input */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'var(--surface-2)',
            border: `1px solid ${focused ? 'var(--accent)' : 'var(--border-2)'}`,
            borderRadius: 'var(--r-lg)',
            overflow: 'hidden',
            transition: 'border-color 150ms',
            boxShadow: focused ? '0 0 0 3px var(--accent-glow)' : 'none',
          }}>
            {/* +91 prefix */}
            <div style={{
              padding: '0 var(--sp-3)', height: 48,
              display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
              borderRight: '1px solid var(--border-2)', flexShrink: 0,
            }}>
              <span style={{ fontSize: 16 }}>🇮🇳</span>
              <span style={{
                fontSize: 14, fontWeight: 500, color: 'var(--text-2)',
                fontVariantNumeric: 'tabular-nums',
              }}>+91</span>
            </div>

            {/* Number field */}
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={11}
              autoFocus
              autoComplete="tel-national"
              placeholder="98765 43210"
              value={display}
              onChange={handleInput}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              style={{
                flex: 1, height: 48,
                background: 'transparent', border: 'none', outline: 'none',
                padding: '0 var(--sp-4)',
                fontSize: 16, fontWeight: 500, color: 'var(--text-1)',
                letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums',
                caretColor: 'var(--accent)',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          {/* Send OTP button */}
          <motion.button
            type="button"
            disabled={!ready || loading}
            onClick={handleSubmit}
            whileTap={ready && !loading ? { scale: 0.98 } : undefined}
            transition={{ duration: 0.1, ease: [0.32, 0.72, 0, 1] }}
            style={{
              width: '100%', height: 44,
              borderRadius: 'var(--r-lg)', border: 'none',
              fontSize: 14, fontWeight: 600,
              cursor: !ready || loading ? (loading ? 'wait' : 'not-allowed') : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 'var(--sp-2)',
              background: ready ? 'var(--accent)' : 'var(--surface-3)',
              color: ready ? 'white' : 'var(--text-3)',
              transition: 'background 200ms, color 200ms',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={14} style={{ animation: 'spin 600ms linear infinite' }} aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Send OTP
                {ready && <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />}
              </>
            )}
          </motion.button>

          {/* Fine print */}
          <p style={{
            fontSize: 11, color: 'var(--text-4)',
            textAlign: 'center', lineHeight: 1.6, margin: 0,
          }}>
            By continuing you agree to our{' '}
            <FinePrintLink href="/terms">Terms of Service</FinePrintLink>
            {' '}and{' '}
            <FinePrintLink href="/privacy">Privacy Policy</FinePrintLink>.{' '}
            We'll only use your number for account access.
          </p>
        </div>
      </motion.div>

      {/* Step indicator */}
      <span style={{
        position: 'absolute', bottom: 'var(--sp-5)', right: 'var(--sp-6)',
        fontSize: 11, color: 'var(--text-4)',
      }}>
        Step 1 of 2
      </span>
    </div>
  )
}

/* ── Fine print link ── */
function FinePrintLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        color: hov ? 'var(--text-2)' : 'var(--text-3)',
        textDecoration: 'underline',
        textDecorationColor: 'var(--border-3)',
        transition: 'color 120ms',
      }}
    >
      {children}
    </a>
  )
}
