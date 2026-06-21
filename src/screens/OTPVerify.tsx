import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'

interface Props {
  phone:     string
  onBack:    () => void
  onSuccess: () => void
}

function formatPhone(p: string): string {
  return p.length > 5 ? `${p.slice(0, 5)} ${p.slice(5)}` : p
}

export function OTPVerify({ phone, onBack, onSuccess }: Props) {
  const [otp,         setOtp]         = useState<string[]>(['', '', '', '', '', ''])
  const [focusedIdx,  setFocusedIdx]  = useState<number | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [success,     setSuccess]     = useState(false)
  const [error,       setError]       = useState('')
  const [attempts,    setAttempts]    = useState(0)
  const [shake,       setShake]       = useState(false)
  const [countdown,   setCountdown]   = useState(30)
  const [canResend,   setCanResend]   = useState(false)
  const [isResending, setIsResending] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── Countdown ── */
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timerRef.current!); setCanResend(true); return 0 }
        return c - 1
      })
    }, 1000)
  }

  useEffect(() => {
    startTimer()
    inputRefs.current[0]?.focus()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 350)
  }

  const triggerError = (msg: string) => {
    setError(msg)
    triggerShake()
    setTimeout(() => {
      setOtp(['', '', '', '', '', ''])
      requestAnimationFrame(() => inputRefs.current[0]?.focus())
    }, 320)
  }

  /* ── Verify ── */
  const triggerVerify = async (digits: string[]) => {
    if (loading || success) return
    setLoading(true)
    setError('')

    await new Promise(r => setTimeout(r, 1200)) // stub — replace with real verify API

    // Demo: "000000" simulates an incorrect code so the error/shake/resend states stay reachable.
    if (digits.join('') === '000000') {
      setLoading(false)
      const nextAttempts = attempts + 1
      setAttempts(nextAttempts)
      if (nextAttempts >= 3) setCanResend(true)
      triggerError('Incorrect code. Try again.')
      return
    }

    setLoading(false)
    setSuccess(true)
    setTimeout(onSuccess, 400)
  }

  /* ── Auto-submit ── */
  useEffect(() => {
    if (otp.every(d => d !== '') && !loading && !success) {
      const t = setTimeout(() => triggerVerify(otp), 150)
      return () => clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp])

  /* ── Input handlers ── */
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (otp[index]) {
        const next = [...otp]; next[index] = ''; setOtp(next)
      } else if (index > 0) {
        const next = [...otp]; next[index - 1] = ''; setOtp(next)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft'  && index > 0) { inputRefs.current[index - 1]?.focus() }
      else if (e.key === 'ArrowRight' && index < 5) { inputRefs.current[index + 1]?.focus() }
  }

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1)
    if (!digit) return
    const next = [...otp]; next[index] = digit; setOtp(next)
    if (error) setError('')
    if (index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      const digits = text.split('')
      setOtp(digits)
      inputRefs.current[5]?.focus()
      setTimeout(() => triggerVerify(digits), 100)
    }
  }

  /* ── Resend ── */
  const handleResend = async () => {
    if (isResending || !canResend) return
    setIsResending(true)
    setOtp(['', '', '', '', '', ''])
    setError('')
    setAttempts(0)
    await new Promise(r => setTimeout(r, 800)) // stub
    setIsResending(false)
    setCountdown(30)
    setCanResend(false)
    startTimer()
    requestAnimationFrame(() => inputRefs.current[0]?.focus())
  }

  /* ── Box style helpers ── */
  const boxBorder = (i: number) => {
    if (success) return 'var(--success)'
    if (shake)   return 'var(--danger)'
    if (focusedIdx === i) return 'var(--accent)'
    return otp[i] ? 'var(--border-3)' : 'var(--border-2)'
  }

  const boxBg = (i: number) => {
    if (success) return 'rgba(76,195,138,0.08)'
    if (shake)   return 'rgba(229,83,75,0.06)'
    return (focusedIdx === i || otp[i]) ? 'var(--surface-3)' : 'var(--surface-2)'
  }

  const boxShadow = (i: number) =>
    focusedIdx === i && !shake && !success
      ? '0 0 0 3px var(--accent-glow)'
      : 'none'

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--canvas)',
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
        aria-label="Back"
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
        {/* Header */}
        <div>
          <h1 style={{
            fontSize: 22, fontWeight: 700, color: 'var(--text-1)',
            letterSpacing: '-0.02em', lineHeight: 1.2,
            margin: '0 0 var(--sp-1) 0',
          }}>
            Enter the code
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '0 0 var(--sp-1) 0', lineHeight: 1.5 }}>
            Sent to +91{' '}
            <span style={{ fontWeight: 500, color: 'var(--text-1)' }}>{formatPhone(phone)}</span>
            <ChangeLink onClick={onBack} />
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0 }}>
            Check WhatsApp or SMS
          </p>
        </div>

        {/* OTP boxes + feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div
            onPaste={handlePaste}
            style={{
              display: 'flex', gap: 'var(--sp-2)', justifyContent: 'center',
              animation: shake ? 'shake 300ms var(--ease-out)' : 'none',
            }}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]"
                value={digit}
                disabled={loading || success}
                onChange={e => handleChange(i, e)}
                onKeyDown={e => handleKeyDown(i, e)}
                onFocus={() => setFocusedIdx(i)}
                onBlur={() => setFocusedIdx(null)}
                aria-label={`OTP digit ${i + 1}`}
                style={{
                  width: 46, height: 54,
                  background: boxBg(i),
                  border: `1px solid ${boxBorder(i)}`,
                  borderRadius: 'var(--r-lg)',
                  fontSize: 22, fontWeight: 600,
                  color: 'var(--text-1)', textAlign: 'center',
                  caretColor: 'var(--accent)', outline: 'none',
                  boxShadow: boxShadow(i),
                  transition: 'border-color 150ms, background 150ms, box-shadow 150ms',
                  fontVariantNumeric: 'tabular-nums',
                  fontFamily: 'Inter, sans-serif',
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'wait' : 'text',
                }}
              />
            ))}
          </div>

          {loading && <LoadingDots />}

          {error && !loading && (
            <p style={{
              fontSize: 13, color: 'var(--danger)',
              textAlign: 'center', margin: 0, lineHeight: 1.5,
              animation: 'fadeIn 200ms var(--ease-out)',
            }}>
              {error}
            </p>
          )}
        </div>

        {/* Resend */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!canResend ? (
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
              Resend in {countdown}s
            </span>
          ) : (
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
              Didn't receive it?{' '}
              <ResendLink onClick={handleResend} isResending={isResending} />
            </span>
          )}
        </div>
      </motion.div>

      {/* Step indicator */}
      <span style={{
        position: 'absolute', bottom: 'var(--sp-5)', right: 'var(--sp-6)',
        fontSize: 11, color: 'var(--text-4)',
      }}>
        Step 2 of 2
      </span>
    </div>
  )
}

/* ── Sub-components ── */

function ChangeLink({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none', border: 'none', padding: 0,
        marginLeft: 'var(--sp-2)', fontSize: 13,
        color: hov ? 'var(--text-1)' : 'var(--accent-text)',
        cursor: 'pointer', transition: 'color 120ms',
      }}
    >
      Change
    </button>
  )
}

function ResendLink({ onClick, isResending }: { onClick: () => void; isResending: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isResending}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none', border: 'none', padding: 0,
        fontSize: 13, fontWeight: 500,
        color: isResending ? 'var(--text-3)' : hov ? 'var(--text-1)' : 'var(--accent-text)',
        cursor: isResending ? 'wait' : 'pointer',
        transition: 'color 120ms',
      }}
    >
      {isResending ? 'Sending…' : 'Resend OTP'}
    </button>
  )
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-2)' }}>
      {[0, 150, 300].map((delay, i) => (
        <span
          key={i}
          style={{
            display: 'block', width: 6, height: 6,
            borderRadius: '50%', background: 'var(--accent)',
            animation: 'bounce 600ms ease-in-out infinite',
            animationDelay: `${delay}ms`,
          }}
        />
      ))}
    </div>
  )
}
