export const tokens = {
  colors: {
    canvas:      '#0C0C0E',
    surface1:    '#111113',
    surface2:    '#161618',
    surface3:    '#1C1C1F',
    surface4:    '#222226',
    border1:     '#1A1A1E',
    border2:     '#222226',
    border3:     '#2C2C32',
    text1:       '#E8E8EE',
    text2:       '#8F8F9E',
    text3:       '#55555F',
    text4:       '#33333A',
    accent:      '#5E6AD2',
    accentDim:   'rgba(94,106,210,0.10)',
    accentGlow:  'rgba(94,106,210,0.20)',
    accentText:  '#8B93E8',
    accentHover: '#6872D8',
    success:     '#4CC38A',
    successDim:  'rgba(76,195,138,0.08)',
    warning:     '#E5A05A',
    danger:      '#E5534B',
  },
  ease: {
    out:    [0.32, 0.72, 0, 1]    as const,
    spring: [0.34, 1.56, 0.64, 1] as const,
    smooth: [0.65, 0, 0.35, 1]    as const,
  },
} as const

export type TokenColor = keyof typeof tokens.colors
