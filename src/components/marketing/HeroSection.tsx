import { motion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface HeroSectionProps {
  eyebrow?: string
  headline: string
  headlineSecondLine?: string
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
  },
}

export function HeroSection({
  eyebrow,
  headline,
  headlineSecondLine,
  description,
  primaryCta,
  secondaryCta,
}: HeroSectionProps) {
  return (
    <section aria-label="Hero" className="w-full bg-[var(--canvas)] pt-[140px] pb-24">
      <div className="mx-auto max-w-[var(--container-2xl)] px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-[720px]"
        >
          {/* Eyebrow */}
          {eyebrow && (
            <motion.p
              variants={item}
              className={cn(
                'text-[var(--text-sm)] font-medium uppercase',
                'tracking-[0.12em] leading-none',
                'text-[var(--accent)]',
                'mb-6'
              )}
            >
              {eyebrow}
            </motion.p>
          )}

          {/* Headline */}
          <motion.h1
            variants={item}
            className={cn(
              'font-bold text-[var(--text-1)]',
              'text-[clamp(36px,5vw,var(--text-5xl))]',
              'leading-[0.95] tracking-[-0.04em]',
              'mb-6'
            )}
          >
            {headline}
            {headlineSecondLine && (
              <>
                <br />
                <span className="text-[var(--text-3)]">
                  {headlineSecondLine}
                </span>
              </>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={item}
            className={cn(
              'text-[var(--text-xl)] font-normal leading-relaxed',
              'text-[var(--text-2)]',
              'max-w-[640px]',
              'mb-4'
            )}
          >
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <PrimaryCta href={primaryCta.href} label={primaryCta.label} />
            {secondaryCta && (
              <SecondaryCta href={secondaryCta.href} label={secondaryCta.label} />
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

interface CtaProps { href: string; label: string }

function PrimaryCta({ href, label }: CtaProps) {
  return (
    <motion.a
      href={href}
      whileHover={{ opacity: 0.9 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        'inline-flex items-center gap-2',
        'h-11 px-5 rounded-[var(--r-lg)]',
        'text-[var(--text-lg)] font-medium text-white leading-none',
        'bg-[var(--accent)]',
        'select-none',
        'focus-visible:outline-none focus-visible:ring-1.5',
        'focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[var(--canvas)]'
      )}
    >
      {label}
      <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
    </motion.a>
  )
}

function SecondaryCta({ href, label }: CtaProps) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-1.5',
        'text-[var(--text-lg)] font-medium leading-none',
        'text-[var(--text-2)] hover:text-[var(--text-1)]',
        'focus-visible:outline-none focus-visible:ring-1.5',
        'focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[var(--canvas)]',
        'rounded-[var(--r-sm)]'
      )}
    >
      {label}
    </a>
  )
}
