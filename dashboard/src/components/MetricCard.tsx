import { motion } from 'framer-motion'

interface MetricCardProps {
  label: string
  value: string
  change: string
  positive?: boolean
  delay?: number
}

export function MetricCard({ label, value, change, positive = true, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      className="p-5 rounded-xl border"
      style={{
        background: 'var(--color-card)',
        borderColor: 'var(--color-card-border)',
      }}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
    >
      <span
        className="text-[10px] uppercase tracking-[0.15em] font-mono block mb-2"
        style={{ color: 'var(--color-ink-muted)' }}
      >
        {label}
      </span>
      <span
        className="text-3xl md:text-4xl font-semibold block tracking-tight count-in"
        style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-mono)' }}
      >
        {value}
      </span>
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className="text-xs font-mono font-medium px-1.5 py-0.5 rounded"
          style={{
            color: positive ? 'var(--color-signal-up)' : 'var(--color-signal-down)',
            background: positive ? 'var(--color-signal-up-soft)' : 'var(--color-signal-down-soft)',
          }}
        >
          {change}
        </span>
        <span className="text-[10px] font-mono" style={{ color: 'var(--color-ink-muted)' }}>
          6 months
        </span>
      </div>
    </motion.div>
  )
}
