import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Check } from 'lucide-react'

type LineState = 'pending' | 'active' | 'done'

const LINES = [
  'Reading your business description',
  'Identifying your industry and location',
  'Selecting the best layout',
  'Generating section options',
  'Preparing your workspace',
] as const

// Timings: [activateAt, doneAt] in ms from mount
const SCHEDULE: [number, number][] = [
  [300,  900],
  [900,  1500],
  [1500, 2000],
  [2000, 2400],
  [2400, 3000],
]
const NAVIGATE_AT = 3200

interface Props {
  idea:      string
  userName?: string
  onDone:    () => void
}

export function BuilderLoading({ idea, onDone }: Props) {
  const [states, setStates] = useState<LineState[]>(Array(5).fill('pending') as LineState[])
  const onDoneRef = useRef(onDone)
  useEffect(() => { onDoneRef.current = onDone }, [onDone])

  useEffect(() => {
    const set = (idx: number, state: LineState) =>
      setStates(prev => { const n = [...prev] as LineState[]; n[idx] = state; return n })

    const timers: ReturnType<typeof setTimeout>[] = []

    SCHEDULE.forEach(([activateAt, doneAt], i) => {
      timers.push(setTimeout(() => set(i, 'active'), activateAt))
      timers.push(setTimeout(() => set(i, 'done'),   doneAt))
    })

    timers.push(setTimeout(() => onDoneRef.current(), NAVIGATE_AT))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{
        minHeight: '100dvh',
        background: 'var(--canvas)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'var(--sp-6)',
      }}
    >
      <div style={{
        maxWidth: 440, width: '100%',
        display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)',
      }}>
        {/* Idea echo */}
        <div>
          <p style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text-3)',
            margin: '0 0 var(--sp-2) 0',
          }}>
            Building from your idea
          </p>
          <p style={{
            fontSize: 15, fontWeight: 500, color: 'var(--text-1)',
            lineHeight: 1.5, fontStyle: 'italic',
            borderLeft: '2px solid var(--border-3)',
            paddingLeft: 'var(--sp-4)',
            margin: 0,
          }}>
            {idea}
          </p>
        </div>

        {/* Status lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {LINES.map((label, i) => (
            <StatusLine key={i} label={label} state={states[i]} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Status line ── */

function StatusLine({ label, state }: { label: string; state: LineState }) {
  const visible = state !== 'pending'

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
        height: 28,
        opacity: visible ? 1 : 0,
        animation: visible ? 'fadeIn 250ms var(--ease-out)' : 'none',
      }}
    >
      {/* Icon slot */}
      <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {state === 'active' && (
          <Loader2
            size={13}
            style={{ color: 'var(--text-3)', animation: 'spin 1s linear infinite' }}
            aria-hidden="true"
          />
        )}
        {state === 'done' && (
          <Check
            size={13}
            style={{ color: 'var(--success)' }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Label */}
      <span style={{
        fontSize: 13,
        color: state === 'active' ? 'var(--text-2)'
             : state === 'done'   ? 'var(--text-3)'
             :                      'var(--text-4)',
        transition: 'color 200ms',
      }}>
        {label}
      </span>
    </div>
  )
}
