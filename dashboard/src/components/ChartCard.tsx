import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  description: string
  query: string
  insight: string
  children: ReactNode
  id?: string
}

export function ChartCard({ title, description, query, insight, children, id }: ChartCardProps) {
  const [showQuery, setShowQuery] = useState(false)

  return (
    <motion.div
      id={id}
      className="rounded-xl border overflow-hidden"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-card-border)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="p-5 md:p-6 pb-0">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h3
            className="text-base md:text-lg font-medium"
            style={{ color: 'var(--color-ink)' }}
          >
            {title}
          </h3>
          <button
            onClick={() => setShowQuery(!showQuery)}
            className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full border transition-all duration-300 cursor-pointer shrink-0"
            style={{
              color: showQuery ? 'var(--color-card)' : 'var(--color-accent)',
              background: showQuery ? 'var(--color-accent)' : 'transparent',
              borderColor: 'var(--color-accent)',
            }}
          >
            {showQuery ? 'HIDE SQL' : 'VIEW SQL'}
          </button>
        </div>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-ink-muted)' }}>
          {description}
        </p>
      </div>

      <AnimatePresence>
        {showQuery && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mx-5 md:mx-6 mb-4 rounded-lg p-4 overflow-x-auto"
              style={{ background: 'var(--color-code-bg)' }}
            >
              <pre
                className="text-xs leading-relaxed whitespace-pre-wrap"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-ink-soft)' }}
              >
                {query}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-2 pb-2">
        {children}
      </div>

      <div
        className="px-5 md:px-6 py-3 border-t flex items-start gap-2"
        style={{ borderColor: 'var(--color-card-border)', background: 'var(--color-signal-up-soft)' }}
      >
        <span style={{ color: 'var(--color-signal-up)' }} className="text-xs mt-0.5">&#9654;</span>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-signal-up)', fontFamily: 'var(--font-mono)' }}>
          {insight}
        </p>
      </div>
    </motion.div>
  )
}
