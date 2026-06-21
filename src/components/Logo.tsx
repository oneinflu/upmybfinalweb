interface LogoProps {
  size?: number // font-size in px
}

/** Two-tone "UpMyB" wordmark — "Up" in accent, "MyB" in primary text color. */
export function Logo({ size = 15 }: LogoProps) {
  return (
    <span style={{ fontSize: size, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
      <span style={{ color: 'var(--accent)' }}>Up</span>
      <span style={{ color: 'var(--text-1)' }}>MyB</span>
    </span>
  )
}
