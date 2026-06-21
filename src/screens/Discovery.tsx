import { useState, useEffect, useRef } from 'react'
import { ArrowUp, ChevronLeft, ChevronRight, Zap, X, Plus } from 'lucide-react'
import { detectType, getTypeLabel, QUESTIONS, type BusinessType, type Question } from '@/data/questions'
import { Logo } from '@/components/Logo'
import type { BuildData } from '@/types/build'

interface Props {
  data:      BuildData
  onDone:    (answers: Record<string, string | string[]>) => void
  onBack:    () => void
}

interface HistoryItem {
  key:  string
  role: 'user' | 'ai'
  text: string
}

interface CostItem {
  label:  string
  amount: string
}

function buildCosts(answers: Record<string, string | string[]>, bType: BusinessType): CostItem[] {
  const items: CostItem[] = [
    { label: 'Upmyb Business plan', amount: '₹1,999/mo' },
  ]
  const pay = answers.payment as string[] | undefined
  if (pay?.includes('upi-cards')) items.push({ label: 'Razorpay (2% per transaction)', amount: '₹200–2,000/mo*' })
  const feat = answers.features as string[] | undefined
  if (feat?.includes('reminders') || answers.reminders === 'yes') items.push({ label: 'SMS / WhatsApp reminders', amount: '~₹150–500/mo*' })
  const del = answers.delivery as string
  if (del && !['pickup', 'none', 'digital', undefined].includes(del)) items.push({ label: 'Shiprocket shipping', amount: '₹45–80/order*' })
  if (bType === 'education') items.push({ label: 'Video hosting (Backblaze B2)', amount: '~₹50–200/mo*' })
  if (answers.domain === 'buy') items.push({ label: 'Custom domain (GoDaddy)', amount: '₹800–1,200/year' })
  return items
}

export function Discovery({ data, onDone, onBack }: Props) {
  const [bType]                         = useState<BusinessType>(() => detectType(data.idea))
  const [currentQ,     setCurrentQ]     = useState(0)
  const [answers,      setAnswers]      = useState<Record<string, string | string[]>>({})
  const [history,      setHistory]      = useState<HistoryItem[]>(() => [{ key: 'idea', role: 'user', text: data.idea }])
  const [exiting,      setExiting]      = useState(false)
  const [chatInput,    setChatInput]    = useState('')
  const [chatFocused,  setChatFocused]  = useState(false)
  const [showCostModal,setShowCostModal]= useState(false)
  const [showAiLine2,  setShowAiLine2]  = useState(false)

  const threadRef    = useRef<HTMLDivElement>(null)
  const textareaRef  = useRef<HTMLTextAreaElement>(null)

  const questions  = QUESTIONS[bType]
  const question   = questions[currentQ]
  const isLast     = currentQ === questions.length - 1
  const totalQ     = questions.length
  const now        = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) +
                     ' at ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  useEffect(() => {
    const t = setTimeout(() => setShowAiLine2(true), 400)
    return () => clearTimeout(t)
  }, [])

  /* scroll thread to bottom whenever history grows */
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [history, showAiLine2])

  const submitAnswer = (ans: string | string[]) => {
    const displayAns = Array.isArray(ans) ? ans.join(', ') : ans
    setHistory(prev => [
      ...prev,
      { key: `q-${currentQ}`, role: 'ai',  text: question.question },
      { key: `a-${currentQ}`, role: 'user', text: displayAns },
    ])
    setAnswers(prev => ({ ...prev, [question.id]: ans }))

    if (isLast) { setShowCostModal(true); return }

    setExiting(true)
    setTimeout(() => { setCurrentQ(c => c + 1); setExiting(false) }, 200)
  }

  const sendFreeText = () => {
    const t = chatInput.trim()
    if (!t) return
    submitAnswer(t)
    setChatInput('')
  }

  const goBack  = () => { if (currentQ > 0) setCurrentQ(c => c - 1) }
  const goForward = () => {
    const cur = answers[question.id]
    if (cur !== undefined && cur !== '') submitAnswer(cur)
  }

  const hasAnswer = answers[question.id] !== undefined && answers[question.id] !== ''

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--canvas)' }}>

      {/* Top bar */}
      <div style={{
        height: 52, flexShrink: 0,
        background: 'var(--surface-1)', borderBottom: '1px solid var(--border-1)',
        padding: '0 var(--sp-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button type="button" onClick={onBack} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Logo size={14} />
        </button>

        {/* Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Step {currentQ + 1} of {totalQ}</span>
          <div style={{ width: 200, height: 2, background: 'var(--border-2)', borderRadius: 'var(--r-full)' }}>
            <div style={{
              height: '100%', background: 'var(--accent)', borderRadius: 'var(--r-full)',
              width: `${((currentQ + 1) / totalQ) * 100}%`,
              transition: 'width 400ms var(--ease-out)',
            }} />
          </div>
        </div>

        <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-3)' }}>
          Save &amp; continue later
        </button>
      </div>

      {/* Conversation thread */}
      <div ref={threadRef} style={{
        flex: 1, overflowY: 'auto', padding: 'var(--sp-6)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

          {/* Timestamp */}
          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-4)', margin: 0 }}>{now}</p>

          {/* Conversation */}
          {history.map((item, idx) => (
            <div
              key={item.key}
              style={{
                alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: item.role === 'user' ? '60%' : '70%',
                animation: 'fadeIn 200ms var(--ease-out)',
                animationDelay: `${idx * 20}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {item.role === 'user' ? (
                <div style={{
                  background: 'var(--surface-3)', border: '1px solid var(--border-2)',
                  borderRadius: 'var(--r-lg) var(--r-sm) var(--r-lg) var(--r-lg)',
                  padding: 'var(--sp-3) var(--sp-4)',
                  fontSize: 14, color: 'var(--text-1)', lineHeight: 1.5,
                }}>
                  {item.text}
                </div>
              ) : (
                <div style={{
                  background: 'var(--surface-2)', border: '1px solid var(--border-1)',
                  borderRadius: 'var(--r-sm) var(--r-lg) var(--r-lg) var(--r-lg)',
                  padding: 'var(--sp-3) var(--sp-4)',
                  fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5,
                }}>
                  {item.text}
                </div>
              )}
            </div>
          ))}

          {/* AI init bubbles */}
          {history.length === 1 && (
            <div style={{ alignSelf: 'flex-start', maxWidth: '70%', animation: 'fadeIn 300ms var(--ease-out)' }}>
              <div style={{
                background: 'var(--surface-2)', border: '1px solid var(--border-1)',
                borderRadius: 'var(--r-sm) var(--r-lg) var(--r-lg) var(--r-lg)',
                padding: 'var(--sp-3) var(--sp-4)',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)' }}>Waiting for answers</span>
                {showAiLine2 && (
                  <span style={{ fontSize: 13, color: 'var(--text-3)', animation: 'fadeIn 300ms var(--ease-out)' }}>
                    Analysing {getTypeLabel(bType)} requirements
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current question card */}
      <div style={{ flexShrink: 0, padding: '0 var(--sp-6) var(--sp-4)', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%', maxWidth: 660,
          background: 'var(--surface-2)', border: '1px solid var(--border-2)',
          borderRadius: 'var(--r-xl)', overflow: 'hidden',
          animation: exiting ? 'slideUpExit 150ms ease-in forwards' : 'slideUp 250ms var(--ease-out)',
        }}>
          <QuestionCard
            question={question}
            currentAnswer={answers[question.id]}
            onAnswer={ans => setAnswers(prev => ({ ...prev, [question.id]: ans }))}
            isFirst={currentQ === 0}
            isLast={isLast}
            hasAnswer={hasAnswer}
            onBack={goBack}
            onForward={goForward}
            onSkip={() => {
              if (!question.required) {
                setExiting(true)
                setTimeout(() => { setCurrentQ(c => c + 1); setExiting(false) }, 200)
              }
            }}
            onSubmit={submitAnswer}
          />
        </div>
      </div>

      {/* Bottom input bar */}
      <div style={{ flexShrink: 0, borderTop: '1px solid var(--border-1)', background: 'var(--surface-1)', padding: 'var(--sp-3) var(--sp-6)' }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <div style={{
            background: 'var(--surface-2)',
            border: `1px solid ${chatFocused ? 'var(--accent)' : 'var(--border-2)'}`,
            borderRadius: 'var(--r-xl)', overflow: 'hidden', transition: 'border-color 150ms',
          }}>
            <textarea
              ref={textareaRef}
              value={chatInput}
              placeholder="Tell me instead..."
              onFocus={() => setChatFocused(true)}
              onBlur={() => setChatFocused(false)}
              onChange={e => {
                setChatInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendFreeText() } }}
              style={{
                width: '100%', minHeight: 48, maxHeight: 120,
                background: 'transparent', border: 'none', outline: 'none',
                resize: 'none', padding: 'var(--sp-3) var(--sp-4)',
                fontFamily: 'Inter, sans-serif', fontSize: 14,
                color: 'var(--text-1)', lineHeight: 1.5,
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--sp-3) var(--sp-3)' }}>
              <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
                <AttachBtn icon={<Plus size={14} />} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <SendRound hasInput={!!chatInput.trim()} onClick={sendFreeText} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost summary modal */}
      {showCostModal && (
        <CostModal
          answers={answers}
          bType={bType}
          onClose={() => setShowCostModal(false)}
          onBuild={() => { setShowCostModal(false); onDone(answers) }}
        />
      )}
    </div>
  )
}

/* ── Question card ── */

function QuestionCard({ question, currentAnswer, onAnswer, isFirst, isLast, hasAnswer, onBack, onForward, onSkip, onSubmit }: {
  question: Question
  currentAnswer: string | string[] | undefined
  onAnswer: (ans: string | string[]) => void
  isFirst: boolean; isLast: boolean; hasAnswer: boolean
  onBack: () => void; onForward: () => void; onSkip: () => void
  onSubmit: (ans: string | string[]) => void
}) {
  return (
    <>
      {/* Header */}
      <div style={{ padding: 'var(--sp-5) var(--sp-5) var(--sp-4)', borderBottom: '1px solid var(--border-1)' }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.4, letterSpacing: '-0.01em', margin: 0 }}>
          {question.question}
        </p>
      </div>

      {/* Options / Text */}
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', minHeight: 120 }}>
        {question.type === 'text' ? (
          <TextQuestion
            placeholder={question.placeholder}
            value={(currentAnswer as string) ?? ''}
            onChange={v => onAnswer(v)}
          />
        ) : (
          (question.options ?? []).map(opt => (
            <OptionRow
              key={opt.value}
              option={opt}
              type={question.type}
              selected={
                question.type === 'multi'
                  ? (Array.isArray(currentAnswer) ? currentAnswer.includes(opt.value) : false)
                  : currentAnswer === opt.value
              }
              onToggle={() => {
                if (question.type === 'multi') {
                  const prev = Array.isArray(currentAnswer) ? currentAnswer : []
                  onAnswer(prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value])
                } else {
                  onAnswer(opt.value)
                }
              }}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderTop: '1px solid var(--border-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          <NavArrow icon={<ChevronLeft size={14} />} disabled={isFirst} onClick={onBack} />
          <NavArrow icon={<ChevronRight size={14} />} disabled={!hasAnswer} onClick={onForward} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          {!question.required && (
            <SkipBtn label={question.skipLabel} onClick={onSkip} />
          )}
          <ContinueBtn
            isLast={isLast}
            disabled={!hasAnswer && question.required}
            onClick={() => {
              if (hasAnswer) onSubmit(currentAnswer!)
              else if (!question.required) onSkip()
            }}
          />
        </div>
      </div>
    </>
  )
}

function OptionRow({ option, type, selected, onToggle }: {
  option: { value: string; label: string; description: string }
  type: 'single' | 'multi'; selected: boolean; onToggle: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)',
        padding: 'var(--sp-3)', borderRadius: 'var(--r-lg)',
        background: selected ? 'var(--accent-dim)' : hov ? 'var(--surface-3)' : 'transparent',
        border: `1px solid ${selected ? 'rgba(94,106,210,0.25)' : hov ? 'var(--border-2)' : 'transparent'}`,
        cursor: 'pointer', transition: 'all 150ms', marginBottom: 4,
      }}
    >
      {/* Radio / Checkbox */}
      <div style={{
        width: 16, height: 16, flexShrink: 0, marginTop: 2,
        borderRadius: type === 'multi' ? 'var(--r-sm)' : '50%',
        border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--border-3)'}`,
        background: selected ? 'var(--accent)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 150ms',
      }}>
        {selected && type === 'multi' && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {selected && type === 'single' && (
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', margin: 0, lineHeight: 1.3 }}>{option.label}</p>
        <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.4, margin: '2px 0 0' }}>{option.description}</p>
      </div>
    </div>
  )
}

function TextQuestion({ placeholder, value, onChange }: { placeholder?: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder ?? 'Your answer...'}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onChange={e => onChange(e.target.value)}
      autoFocus
      style={{
        width: '100%', height: 44,
        background: 'var(--surface-3)',
        border: `1px solid ${focused ? 'var(--accent)' : 'var(--border-2)'}`,
        borderRadius: 'var(--r-lg)', outline: 'none',
        padding: '0 var(--sp-4)',
        fontSize: 14, color: 'var(--text-1)', fontFamily: 'Inter, sans-serif',
        transition: 'border-color 150ms',
      }}
    />
  )
}

function NavArrow({ icon, disabled, onClick }: { icon: React.ReactNode; disabled: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30,
        background: hov && !disabled ? 'var(--surface-4)' : 'var(--surface-3)',
        border: '1px solid var(--border-2)', borderRadius: 'var(--r-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: 'var(--text-3)', opacity: disabled ? 0.3 : 1, transition: 'all 120ms',
      }}
    >
      {icon}
    </button>
  )
}

function SkipBtn({ label, onClick }: { label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 32, padding: '0 var(--sp-4)',
        background: 'transparent',
        border: `1px solid ${hov ? 'var(--border-2)' : 'transparent'}`,
        borderRadius: 'var(--r-md)', cursor: 'pointer',
        fontSize: 13, fontWeight: 500,
        color: hov ? 'var(--text-2)' : 'var(--text-3)', transition: 'all 120ms',
      }}
    >
      {label}
    </button>
  )
}

function ContinueBtn({ isLast, disabled, onClick }: { isLast: boolean; disabled: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 32, padding: '0 var(--sp-5)',
        background: disabled ? 'var(--accent)' : hov ? 'var(--accent-hover)' : 'var(--accent)',
        color: 'white', border: 'none', borderRadius: 'var(--r-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 13, fontWeight: 600, opacity: disabled ? 0.4 : 1,
        transition: 'all 150ms', display: 'flex', alignItems: 'center', gap: 4,
      }}
    >
      {isLast ? 'Build my site →' : 'Continue'}
    </button>
  )
}

/* ── Cost summary modal ── */

function CostModal({ answers, bType, onClose, onBuild }: {
  answers: Record<string, string | string[]>
  bType: BusinessType; onClose: () => void; onBuild: () => void
}) {
  const [editHov, setEditHov] = useState(false)
  const [buildHov, setBuildHov] = useState(false)
  const costs = buildCosts(answers, bType)

  const totalLow  = costs.reduce((a, c) => a + parseInt(c.amount.replace(/[^\d]/g, '') || '0'), 0)
  const totalHigh = totalLow + 2000

  const summaryRows: { label: string; value: string }[] = [
    { label: 'Business', value: (answers.name as string) || '—' },
    { label: 'Type',     value: bType.charAt(0).toUpperCase() + bType.slice(1) },
    { label: 'Auth',     value: (answers.auth as string)?.replace(/-/g, ' ') || '—' },
    { label: 'Domain',   value: answers.domain === 'have' ? 'Your own domain' : answers.domain === 'buy' ? 'Buy new domain' : 'Free subdomain' },
    { label: 'Hosting',  value: answers.hosting === 'own' ? 'Own server' : 'Upmyb hosting' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(12,12,14,0.80)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-4)' }}>
      <div style={{
        width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
        background: 'rgba(18,18,20,0.88)', backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--r-xl)',
        padding: 'var(--sp-6)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 24px 48px rgba(0,0,0,0.6)',
        animation: 'modalIn 350ms var(--ease-spring)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-5)' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', margin: 0 }}>Here's what we're building</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '4px 0 0', lineHeight: 1.5 }}>Based on your answers. You can change anything later.</p>
          </div>
          <CloseIconBtn onClick={onClose} />
        </div>

        {/* Summary */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-1)', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 'var(--sp-5)' }}>
          {summaryRows.map((row, i) => (
            <div key={row.label} style={{ display: 'flex', gap: 'var(--sp-3)', padding: 'var(--sp-3) var(--sp-4)', borderBottom: i < summaryRows.length - 1 ? '1px solid var(--border-1)' : 'none' }}>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', width: 80, flexShrink: 0, paddingTop: 1 }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', flex: 1 }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Costs */}
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', margin: '0 0 var(--sp-3)' }}>Monthly running costs</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {costs.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--sp-2) 0', borderBottom: '1px solid var(--border-1)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{c.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}>{c.amount}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--sp-3)', marginTop: 'var(--sp-3)', borderTop: '1px solid var(--border-2)' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Estimated total</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              ₹{totalLow.toLocaleString('en-IN')}–{totalHigh.toLocaleString('en-IN')}/mo*
            </span>
          </div>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-4)', margin: 'var(--sp-2) 0 0' }}>* Variable costs depend on usage. Upmyb subscription is fixed.</p>

        {/* Build button */}
        <button
          type="button"
          onClick={onBuild}
          onMouseEnter={() => setBuildHov(true)}
          onMouseLeave={() => setBuildHov(false)}
          style={{
            width: '100%', height: 44, marginTop: 'var(--sp-5)',
            background: buildHov ? 'var(--accent-hover)' : 'var(--accent)',
            color: 'white', border: 'none', borderRadius: 'var(--r-lg)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-2)',
            transition: 'background 150ms',
          }}
        >
          <Zap size={14} aria-hidden="true" />
          Start building
        </button>
        <p
          onClick={onClose}
          onMouseEnter={() => setEditHov(true)}
          onMouseLeave={() => setEditHov(false)}
          style={{ textAlign: 'center', marginTop: 'var(--sp-3)', fontSize: 12, color: editHov ? 'var(--text-2)' : 'var(--text-3)', cursor: 'pointer', transition: 'color 120ms' }}
        >
          Want to change something?
        </p>
      </div>
    </div>
  )
}

/* ── Atoms ── */

function AttachBtn({ icon }: { icon: React.ReactNode }) {
  const [hov, setHov] = useState(false)
  return (
    <button type="button" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 28, height: 28, background: hov ? 'var(--surface-3)' : 'transparent',
        border: '1px solid var(--border-2)', borderRadius: 'var(--r-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--text-3)', transition: 'all 120ms',
      }}>
      {icon}
    </button>
  )
}

function SendRound({ hasInput, onClick }: { hasInput: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button type="button" onClick={onClick} disabled={!hasInput}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32, borderRadius: '50%', border: 'none',
        background: hasInput ? (hov ? 'var(--accent-hover)' : 'var(--accent)') : 'var(--surface-4)',
        color: hasInput ? 'white' : 'var(--text-4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: hasInput ? 'pointer' : 'not-allowed', transition: 'background 150ms',
      }}>
      <ArrowUp size={14} aria-hidden="true" />
    </button>
  )
}

function CloseIconBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 28, height: 28, background: hov ? 'var(--surface-3)' : 'transparent',
        border: `1px solid ${hov ? 'var(--border-2)' : 'transparent'}`,
        borderRadius: 'var(--r-md)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hov ? 'var(--text-1)' : 'var(--text-3)', transition: 'all 120ms', flexShrink: 0,
      }}>
      <X size={14} aria-hidden="true" />
    </button>
  )
}
