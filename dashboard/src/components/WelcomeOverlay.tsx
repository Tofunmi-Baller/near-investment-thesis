import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WelcomeOverlayProps {
  show: boolean
  onStartTour: () => void
  onDismiss: () => void
}

export function WelcomeOverlay({ show, onStartTour, onDismiss }: WelcomeOverlayProps) {
  const [startingTour, setStartingTour] = useState(false)

  const handleStartTour = () => {
    setStartingTour(true)
    onStartTour()
  }

  const visible = show && !startingTour

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onDismiss}
          />

          <motion.div
            className="relative rounded-2xl border p-8 md:p-10 max-w-md w-full text-center"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-card-border)' }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white text-xl font-bold"
              style={{ background: 'var(--color-accent)' }}
            >
              N
            </div>

            <h2
              className="text-2xl font-normal mb-2"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
            >
              NEAR Investment Thesis
            </h2>

            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              An interactive, evidence-backed analysis of NEAR Protocol.
              8 chapters of real on-chain data — all verifiable.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleStartTour}
                className="w-full py-3 px-4 rounded-xl text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                style={{ background: 'var(--color-accent)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                Take the guided tour
              </button>

              <button
                onClick={onDismiss}
                className="w-full py-3 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                style={{ color: 'var(--color-ink-muted)', background: 'var(--color-paper-alt)' }}
              >
                Skip &mdash; I'll explore on my own
              </button>
            </div>

            <p
              className="mt-4 text-[10px] font-mono"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              You can restart the tour anytime from the sidebar
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
