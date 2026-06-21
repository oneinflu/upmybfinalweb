import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { Text } from '@/components/shared/Text'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'
import { ArrowRight, Zap } from 'lucide-react'

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-8 py-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl flex flex-col gap-8 items-center text-center"
      >
        <motion.div variants={fadeUp} className="flex flex-col gap-3 items-center">
          <Badge variant="accent">Now in beta</Badge>
          <Text as="h1" variant="display" balance>
            Your creative workspace,
            <br />
            <span className="text-[var(--text-3)]">reimagined.</span>
          </Text>
          <Text variant="body" color="secondary" balance className="max-w-md">
            upmyb is a focused tool for building and shipping.
            Fast, minimal, and built for the way you think.
          </Text>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <Button variant="primary" size="lg" icon={<Zap size={14} />} iconRight={<ArrowRight size={14} />}>
            Get started
          </Button>
          <Button variant="ghost" size="lg">
            Learn more
          </Button>
        </motion.div>

        <motion.div variants={fadeUp} className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Fast', desc: 'Sub-100ms interactions' },
            { label: 'Focused', desc: 'Zero-noise interface' },
            { label: 'Flexible', desc: 'Works your way' },
          ].map((item) => (
            <Card key={item.label} interactive padding="md" className="text-left">
              <Text as="h3" variant="subheading">{item.label}</Text>
              <Text variant="caption" color="secondary" className="mt-1">{item.desc}</Text>
            </Card>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
