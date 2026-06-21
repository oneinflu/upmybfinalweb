import { Navbar } from '@/components/Navbar'
import { Hero } from '@/sections/Hero'
import { TrustStrip } from '@/sections/TrustStrip'
import { FeatureGrid } from '@/sections/FeatureGrid'
import { GeoFeatures } from '@/sections/GeoFeatures'
import { Pricing } from '@/sections/Pricing'
import { Footer } from '@/sections/Footer'
import type { BuildData } from '@/types/build'

interface LandingPageProps {
  onSubmit?: (data: BuildData) => void
}

export function LandingPage({ onSubmit }: LandingPageProps) {
  return (
    <div className="min-h-dvh bg-[var(--canvas)]">
      <Navbar />
      <Hero onSubmit={onSubmit} />
      <TrustStrip />
      <FeatureGrid />
      <GeoFeatures />
      <Pricing />
      <Footer />
    </div>
  )
}
