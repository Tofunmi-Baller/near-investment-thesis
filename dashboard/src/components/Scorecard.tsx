import { motion } from 'framer-motion'
import { scorecard, scorecardSummary, type ScorecardStatus } from '../data/metrics'

const statusConfig: Record<ScorecardStatus, { label: string; colorVar: string; bgVar: string }> = {
  'met': { label: 'Met', colorVar: 'var(--color-signal-up)', bgVar: 'var(--color-signal-up-soft)' },
  'in-progress': { label: 'In progress', colorVar: 'var(--color-accent)', bgVar: 'var(--color-accent-soft)' },
  'not-met': { label: 'Not met', colorVar: 'var(--color-signal-down)', bgVar: 'var(--color-signal-down-soft)' },
  'unmeasured': { label: 'Unmeasured', colorVar: 'var(--color-ink-muted)', bgVar: 'var(--color-paper-alt)' },
}

export function Scorecard() {
  const { met, 'in-progress': inProg, 'not-met': notMet, unmeasured } = scorecardSummary

  return (
    <motion.div
      className="rounded-xl border overflow-hidden"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-card-border)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with tally */}
      <div className="p-5 md:p-6 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
        <h3 className="text-base md:text-lg font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
          Falsification Scorecard
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { n: met, label: 'met', color: 'var(--color-signal-up)' },
            { n: inProg, label: 'in progress', color: 'var(--color-accent)' },
            { n: notMet, label: 'not met', color: 'var(--color-signal-down)' },
            { n: unmeasured, label: 'unmeasured', color: 'var(--color-ink-muted)' },
          ].map(({ n, label, color }) => (
            <span key={label} className="text-xs font-mono" style={{ color }}>
              {n} {label}
            </span>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y" style={{ borderColor: 'var(--color-card-border)' }}>
        {scorecard.map((row, i) => {
          const cfg = statusConfig[row.status]
          return (
            <motion.div
              key={row.signal}
              className="p-4 md:px-6"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              style={row.status === 'unmeasured' ? { opacity: 0.6 } : {}}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                  {row.signal}
                </h4>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0"
                  style={{ color: cfg.colorVar, background: cfg.bgVar }}
                >
                  {cfg.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-2">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider block mb-0.5" style={{ color: 'var(--color-ink-muted)' }}>Now</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--color-ink-soft)' }}>{row.now}</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider block mb-0.5" style={{ color: 'var(--color-ink-muted)' }}>Bar to clear</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--color-ink-soft)' }}>{row.stabilizedBar}</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider block mb-0.5" style={{ color: 'var(--color-ink-muted)' }}>Kill level</span>
                  <span className="text-xs font-mono" style={{ color: row.killLevel === '—' ? 'var(--color-ink-muted)' : 'var(--color-signal-down)' }}>{row.killLevel}</span>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                {row.detail}
              </p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
