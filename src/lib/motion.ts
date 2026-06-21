import type { Variants, Transition } from 'framer-motion'

export const transition: Record<string, Transition> = {
  fast:   { duration: 0.12, ease: [0.32, 0.72, 0, 1] },
  base:   { duration: 0.2,  ease: [0.32, 0.72, 0, 1] },
  slow:   { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
  spring: { type: 'spring', stiffness: 400, damping: 30 },
}

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: transition.base },
}

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: transition.base },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transition.base },
}

export const slideInLeft: Variants = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: transition.base },
}

export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } },
}
