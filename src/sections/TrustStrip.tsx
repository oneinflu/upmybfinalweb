import { useState } from 'react'

interface Brand {
  name:     string
  size:     number
  weight:   number
  tracking: string
}

const BRANDS: Brand[] = [
  { name: 'TATA',      size: 32, weight: 900, tracking: '0.16em'  },
  { name: 'Infosys',   size: 28, weight: 700, tracking: '-0.01em' },
  { name: 'Zomato',    size: 30, weight: 700, tracking: '-0.02em' },
  { name: 'CRED',      size: 34, weight: 900, tracking: '0.12em'  },
  { name: 'OYO',       size: 40, weight: 900, tracking: '0.18em'  },
  { name: 'Nykaa',     size: 30, weight: 700, tracking: '0.04em'  },
  { name: 'Razorpay',  size: 27, weight: 600, tracking: '0.01em'  },
  { name: 'Flipkart',  size: 29, weight: 700, tracking: '-0.01em' },
  { name: 'Meesho',    size: 28, weight: 700, tracking: '-0.01em' },
  { name: 'PhonePe',   size: 28, weight: 700, tracking: '-0.01em' },
  { name: 'Swiggy',    size: 30, weight: 700, tracking: '-0.02em' },
  { name: 'Zepto',     size: 28, weight: 600, tracking: '-0.01em' },
]

function Dot() {
  return (
    <span
      aria-hidden="true"
      style={{
        display:      'inline-block',
        width:        6,
        height:       6,
        borderRadius: '50%',
        background:   'rgba(255,255,255,0.15)',
        flexShrink:   0,
      }}
    />
  )
}

export function TrustStrip() {
  const [paused, setPaused] = useState(false)

  return (
    <section
      style={{
        background: '#08090A',
        padding:    '64px 0',
        position:   'relative',
        overflow:   'hidden',
      }}
    >
      {/* Label */}
      <p
        style={{
          fontSize:      12,
          fontWeight:    500,
          color:         'white',
          opacity:       0.28,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          textAlign:     'center',
          margin:        '0 0 40px 0',
          lineHeight:    1,
        }}
      >
        Trusted by businesses across India
      </p>

      {/* Marquee track */}
      <div
        style={{ position: 'relative', overflow: 'hidden' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          style={{
            display:            'flex',
            alignItems:         'center',
            width:              'max-content',
            animation:          'marquee 32s linear infinite',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span
              key={i}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <span
                style={{
                  fontSize:      brand.size,
                  fontWeight:    brand.weight,
                  letterSpacing: brand.tracking,
                  color:         'white',
                  opacity:       0.55,
                  fontFamily:    'Inter, sans-serif',
                  lineHeight:    1,
                  whiteSpace:    'nowrap',
                  padding:       '0 56px',
                  display:       'inline-block',
                  transition:    'opacity 100ms ease',
                }}
                onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '1')}
                onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '0.55')}
              >
                {brand.name}
              </span>
              <Dot />
            </span>
          ))}
        </div>

        {/* Left edge fade */}
        <div
          aria-hidden="true"
          style={{
            position:      'absolute',
            top: 0, left: 0, bottom: 0,
            width:         200,
            background:    'linear-gradient(to right, #08090A 30%, transparent 100%)',
            pointerEvents: 'none',
            zIndex:        1,
          }}
        />
        {/* Right edge fade */}
        <div
          aria-hidden="true"
          style={{
            position:      'absolute',
            top: 0, right: 0, bottom: 0,
            width:         200,
            background:    'linear-gradient(to left, #08090A 30%, transparent 100%)',
            pointerEvents: 'none',
            zIndex:        1,
          }}
        />
      </div>
    </section>
  )
}
