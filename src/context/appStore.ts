import { createContext } from 'react'
import type { BuildData } from '@/types/build'

/* ── Serialise BuildData to/from sessionStorage (File fields dropped on refresh) ── */

export const SS_BUILD   = 'upmyb_build'
export const SS_PHONE   = 'upmyb_phone'
export const SS_ANSWERS = 'upmyb_answers'

export function readBuild(): BuildData | null {
  try {
    const raw = sessionStorage.getItem(SS_BUILD)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return { idea: parsed.idea ?? '', pdfFile: null, mediaFile: null, refUrl: parsed.refUrl ?? '' }
  } catch { return null }
}

export function readPhone(): string {
  return sessionStorage.getItem(SS_PHONE) ?? ''
}

export function readAnswers(): Record<string, string | string[]> {
  try {
    return JSON.parse(sessionStorage.getItem(SS_ANSWERS) ?? '{}')
  } catch { return {} }
}

/* ── Context shape ── */

export interface AppContextValue {
  buildData: BuildData | null
  phone:     string
  answers:   Record<string, string | string[]>
  setBuildData: (d: BuildData) => void
  setPhone:     (p: string) => void
  setAnswers:   (a: Record<string, string | string[]>) => void
}

export const AppContext = createContext<AppContextValue | null>(null)
