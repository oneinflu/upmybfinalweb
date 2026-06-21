import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider } from '@/context/AppContext'
import { useApp } from '@/context/useApp'
import { LandingPage } from '@/pages/LandingPage'
import { Discovery } from '@/screens/Discovery'
import { PhoneEntry } from '@/screens/PhoneEntry'
import { OTPVerify } from '@/screens/OTPVerify'
import { BuilderLoading } from '@/screens/BuilderLoading'
import { Builder } from '@/screens/Builder'
import { Dashboard } from '@/screens/Dashboard'

const FADE = {
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  exit:       { opacity: 0 },
  transition: { duration: 0.2, ease: 'easeInOut' },
} as const

/* ── Route guards — redirect to / if required state is missing ── */

function RequireBuild({ children }: { children: React.ReactNode }) {
  const { buildData } = useApp()
  if (!buildData?.idea) return <Navigate to="/" replace />
  return <>{children}</>
}

function RequirePhone({ children }: { children: React.ReactNode }) {
  const { buildData, phone } = useApp()
  if (!buildData?.idea) return <Navigate to="/" replace />
  if (!phone)           return <Navigate to="/phone" replace />
  return <>{children}</>
}

/* ── Animated wrapper ── */

function Fade({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <motion.div key={id} {...FADE} style={{ minHeight: '100dvh' }}>
      {children}
    </motion.div>
  )
}

/* ── Route components ── */

function LandingRoute() {
  const nav = useNavigate()
  const { setBuildData } = useApp()
  return (
    <Fade id="landing">
      <LandingPage
        onSubmit={data => { setBuildData(data); nav('/discover') }}
      />
    </Fade>
  )
}

function DiscoveryRoute() {
  const nav = useNavigate()
  const { buildData, setAnswers } = useApp()
  return (
    <Fade id="discovery">
      <Discovery
        data={buildData!}
        onBack={() => nav('/')}
        onDone={ans => { setAnswers(ans); nav('/phone') }}
      />
    </Fade>
  )
}

function PhoneRoute() {
  const nav = useNavigate()
  const { buildData, setPhone } = useApp()
  return (
    <Fade id="phone">
      <PhoneEntry
        data={buildData!}
        onBack={() => nav('/discover')}
        onSuccess={ph => { setPhone(ph); nav('/verify') }}
      />
    </Fade>
  )
}

function OTPRoute() {
  const nav = useNavigate()
  const { phone } = useApp()
  return (
    <Fade id="otp">
      <OTPVerify
        phone={phone}
        onBack={() => nav('/phone')}
        onSuccess={() => nav('/loading')}
      />
    </Fade>
  )
}

function LoadingRoute() {
  const nav = useNavigate()
  const { buildData } = useApp()
  return (
    <motion.div key="loading" {...FADE} style={{ minHeight: '100dvh' }}>
      <BuilderLoading
        idea={buildData!.idea}
        onDone={() => nav('/builder')}
      />
    </motion.div>
  )
}

function BuilderRoute() {
  const nav = useNavigate()
  const { buildData } = useApp()
  return (
    <motion.div key="builder" {...FADE} style={{ height: '100dvh' }}>
      <Builder
        idea={buildData!.idea}
        onDashboard={() => nav('/dashboard')}
      />
    </motion.div>
  )
}

function DashboardRoute() {
  const nav = useNavigate()
  return (
    <Fade id="dashboard">
      <Dashboard onBackToBuilder={() => nav('/builder')} />
    </Fade>
  )
}

/* ── Scroll to top on route change ── */

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

/* ── Root with AnimatePresence ── */

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <>
      <ScrollReset />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingRoute />} />

          <Route path="/discover" element={
            <RequireBuild><DiscoveryRoute /></RequireBuild>
          } />

          <Route path="/phone" element={
            <RequireBuild><PhoneRoute /></RequireBuild>
          } />

          <Route path="/verify" element={
            <RequirePhone><OTPRoute /></RequirePhone>
          } />

          <Route path="/loading" element={
            <RequireBuild><LoadingRoute /></RequireBuild>
          } />

          <Route path="/builder" element={
            <RequireBuild><BuilderRoute /></RequireBuild>
          } />

          <Route path="/dashboard" element={
            <RequireBuild><DashboardRoute /></RequireBuild>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AnimatedRoutes />
    </AppProvider>
  )
}
