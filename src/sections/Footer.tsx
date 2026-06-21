import { useState } from 'react'
import { Logo } from '@/components/Logo'

/* ── Data ── */

const SOCIAL_LINKS = [
  { label: 'X',         href: 'https://x.com/upmyb' },
  { label: 'LinkedIn',  href: 'https://linkedin.com/company/upmyb' },
  { label: 'YouTube',   href: 'https://youtube.com/@upmyb' },
  { label: 'WhatsApp',  href: 'https://wa.me/919876543210' },
]

const LINK_COLUMNS = [
  {
    header: 'Product',
    links: [
      { label: 'Builder',           href: '/builder'   },
      { label: 'GEO Engine',        href: '/geo'       },
      { label: 'Pricing',           href: '/pricing'   },
      { label: 'Changelog',         href: '/changelog' },
      { label: 'Roadmap',           href: '/roadmap'   },
      { label: 'Status',            href: '/status'    },
    ],
  },
  {
    header: 'Company',
    links: [
      { label: 'About',    href: '/about'    },
      { label: 'Blog',     href: '/blog'     },
      { label: 'Careers',  href: '/careers'  },
      { label: 'Press',    href: '/press'    },
      { label: 'Partners', href: '/partners' },
      { label: 'Contact',  href: '/contact'  },
    ],
  },
  {
    header: 'Resources',
    links: [
      { label: 'Documentation',   href: '/docs'          },
      { label: 'Help Center',     href: '/help'          },
      { label: 'API Reference',   href: '/api'           },
      { label: 'Community',       href: '/community'     },
      { label: 'Affiliate Program', href: '/affiliate'   },
      { label: 'Case Studies',    href: '/case-studies'  },
    ],
  },
  {
    header: 'Legal',
    links: [
      { label: 'Privacy Policy',   href: '/privacy'  },
      { label: 'Terms of Service', href: '/terms'    },
      { label: 'Refund Policy',    href: '/refund'   },
      { label: 'Security',         href: '/security' },
      { label: 'GST Invoice',      href: '/gst'      },
      { label: 'Cookie Policy',    href: '/cookies'  },
    ],
  },
]

/* ── Shared link atoms ── */

function FooterLink({ href, children }: { href: string; children: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 13, fontWeight: 400,
        color: hovered ? 'var(--text-1)' : 'var(--text-2)',
        textDecoration: 'none', padding: '3px 0',
        display: 'inline-block', transition: 'color 120ms', cursor: 'pointer',
      }}
    >
      {children}
    </a>
  )
}

function SocialLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 13, fontWeight: 400,
        color: hovered ? 'var(--text-2)' : 'var(--text-3)',
        textDecoration: 'none', transition: 'color 120ms', cursor: 'pointer',
      }}
    >
      {label}
    </a>
  )
}

function LegalLink({ href, children }: { href: string; children: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 12, fontWeight: 400,
        color: hovered ? 'var(--text-3)' : 'var(--text-4)',
        textDecoration: 'none', transition: 'color 120ms', cursor: 'pointer',
      }}
    >
      {children}
    </a>
  )
}

/* ── Brand column ── */

function BrandColumn() {
  const [emailHovered, setEmailHovered] = useState(false)
  return (
    <div
      className="col-span-2 md:col-span-1 border-b md:border-b-0 border-[var(--border-1)]"
      style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)',
        paddingBottom: 'var(--sp-6)',
      }}
    >
      {/* Logo row */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Logo size={15} />
      </div>

      {/* Brand statement */}
      <p style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-3)', lineHeight: 1.6, maxWidth: 210, margin: 0 }}>
        Website builder for Indian businesses.
        Get found on ChatGPT and Perplexity automatically.
        ₹1,999/month.
      </p>

      {/* Social links */}
      <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        {SOCIAL_LINKS.map(s => (
          <SocialLink key={s.label} href={s.href} label={s.label} />
        ))}
      </div>

      {/* Contact */}
      <div>
        <a
          href="mailto:support@upmyb.com"
          onMouseEnter={() => setEmailHovered(true)}
          onMouseLeave={() => setEmailHovered(false)}
          style={{
            fontSize: 12, color: emailHovered ? 'var(--text-3)' : 'var(--text-4)',
            display: 'block', textDecoration: 'none', transition: 'color 120ms',
          }}
        >
          support@upmyb.com
        </a>
        <span style={{ fontSize: 12, color: 'var(--text-4)', display: 'block', marginTop: 2 }}>
          Hyderabad · Bangalore
        </span>
      </div>
    </div>
  )
}

/* ── Link column ── */

interface LinkColumnProps {
  header: string
  links:  { label: string; href: string }[]
}

function LinkColumn({ header, links }: LinkColumnProps) {
  return (
    <div>
      <span style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--text-3)',
        marginBottom: 'var(--sp-4)', display: 'block',
      }}>
        {header}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
        {links.map(link => (
          <FooterLink key={link.href} href={link.href}>{link.label}</FooterLink>
        ))}
      </div>
    </div>
  )
}

/* ── Legal row ── */

const LEGAL_ROW_LINKS = [
  { label: 'Privacy',  href: '/privacy'  },
  { label: 'Terms',    href: '/terms'    },
  { label: 'Sitemap',  href: '/sitemap'  },
]

function LegalRow() {
  return (
    <div
      style={{ maxWidth: 1120, margin: '0 auto', padding: 'var(--sp-5) var(--sp-6)' }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-2"
    >
      {/* Copyright */}
      <span style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 400 }}>
        © 2026 Upmyb Technologies Pvt. Ltd.
      </span>

      {/* Made in India */}
      <span style={{ fontSize: 12, color: 'var(--text-4)' }}>
        Made in India
      </span>

      {/* Secondary links */}
      <div className="flex items-center" style={{ gap: 0 }}>
        {LEGAL_ROW_LINKS.map((link, i) => (
          <span key={link.href} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <span style={{
                fontSize: 12, color: 'var(--text-4)',
                padding: '0 var(--sp-1)', userSelect: 'none',
              }}>
                ·
              </span>
            )}
            <LegalLink href={link.href}>{link.label}</LegalLink>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Main footer ── */

export function Footer() {
  return (
    <footer style={{ background: 'var(--surface-1)', borderTop: '1px solid var(--border-1)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: 'var(--sp-16) var(--sp-6) 0' }}>
        {/* Main grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]"
          style={{
            gap: 'var(--sp-8)',
            paddingBottom: 'var(--sp-12)',
            borderBottom: '1px solid var(--border-1)',
          }}
        >
          <BrandColumn />
          {LINK_COLUMNS.map(col => (
            <LinkColumn key={col.header} header={col.header} links={col.links} />
          ))}
        </div>
      </div>

      {/* Legal row — outside the padded container so it can be full-bleed bordered */}
      <LegalRow />
    </footer>
  )
}
