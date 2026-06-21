import { useState, useEffect } from 'react'

export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const el = document.scrollingElement ?? document.documentElement
    const check = () => setScrolled(el.scrollTop > threshold)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [threshold])

  return scrolled
}
