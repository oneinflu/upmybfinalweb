import { useState, useCallback } from 'react'
import { AppContext, readBuild, readPhone, readAnswers, SS_BUILD, SS_PHONE, SS_ANSWERS } from './appStore'
import type { BuildData } from '@/types/build'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [buildData, _setBuildData] = useState<BuildData | null>(readBuild)
  const [phone,     _setPhone]     = useState<string>(readPhone)
  const [answers,   _setAnswers]   = useState<Record<string, string | string[]>>(readAnswers)

  const setBuildData = useCallback((d: BuildData) => {
    sessionStorage.setItem(SS_BUILD, JSON.stringify({ idea: d.idea, refUrl: d.refUrl }))
    _setBuildData(d)
  }, [])

  const setPhone = useCallback((p: string) => {
    sessionStorage.setItem(SS_PHONE, p)
    _setPhone(p)
  }, [])

  const setAnswers = useCallback((a: Record<string, string | string[]>) => {
    sessionStorage.setItem(SS_ANSWERS, JSON.stringify(a))
    _setAnswers(a)
  }, [])

  return (
    <AppContext.Provider value={{ buildData, phone, answers, setBuildData, setPhone, setAnswers }}>
      {children}
    </AppContext.Provider>
  )
}
