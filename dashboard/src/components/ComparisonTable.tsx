import { motion } from 'framer-motion'
import type { ChainComparison } from '../types'

interface ComparisonTableProps {
  data: ChainComparison[]
}

export function ComparisonTable({ data }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-rule)' }}>
            {['Chain', 'DAA', 'Avg Tx Fee', 'TPS'].map((h) => (
              <th
                key={h}
                className={`py-3 px-4 text-[10px] uppercase tracking-[0.15em] font-mono font-medium ${h === 'Chain' ? 'text-left' : 'text-right'}`}
                style={{ color: 'var(--color-ink-muted)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <motion.tr
              key={row.chain}
              className="border-b"
              style={{
                borderColor: 'var(--color-card-border)',
                background: row.chain === 'NEAR' ? 'var(--color-accent-soft)' : 'transparent',
              }}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <td className="py-3.5 px-4 font-medium" style={{ color: 'var(--color-ink)' }}>
                <div className="flex items-center gap-2">
                  {row.chain === 'NEAR' && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-accent)' }} />
                  )}
                  {row.chain}
                </div>
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-xs" style={{ color: 'var(--color-ink-soft)' }}>
                {row.dailyActiveAccounts >= 1000000
                  ? `${(row.dailyActiveAccounts / 1000000).toFixed(1)}M`
                  : `${(row.dailyActiveAccounts / 1000).toFixed(0)}K`}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-xs" style={{ color: 'var(--color-ink-soft)' }}>
                ${row.avgTxFee < 0.01 ? row.avgTxFee.toFixed(4) : row.avgTxFee.toFixed(2)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-xs" style={{ color: 'var(--color-ink-soft)' }}>
                {row.tps.toLocaleString()}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
