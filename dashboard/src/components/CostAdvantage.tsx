import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '../ThemeContext'
import { feeData } from '../data/metrics'

const realAvgFee = feeData.slice(-30).reduce((s, d) => s + d.avgFeeUsd, 0) / 30
const nearCostPer1K = Math.round(realAvgFee * 1000 * 100) / 100

const agentCosts = [
  { chain: 'NEAR', costPer1000Tx: nearCostPer1K, color: '#0052D4', highlight: true },
  { chain: 'Solana', costPer1000Tx: 3.00, color: '#14F195', highlight: false },
  { chain: 'Base', costPer1000Tx: 10.00, color: '#0052FF', highlight: false },
  { chain: 'Avalanche', costPer1000Tx: 20.00, color: '#E84142', highlight: false },
  { chain: 'Ethereum', costPer1000Tx: 2500.00, color: '#627EEA', highlight: false },
]

const breakdownData = [
  { operation: 'Token transfer', near: Math.round(realAvgFee * 0.5 * 10000) / 10000, solana: 0.001, base: 0.005, ethereum: 1.2 },
  { operation: 'Contract call', near: Math.round(realAvgFee * 10000) / 10000, solana: 0.003, base: 0.01, ethereum: 2.5 },
  { operation: 'Account creation', near: 0.05, solana: 0.002, base: 0.01, ethereum: 3.0 },
  { operation: 'Storage staking', near: 0.01, solana: 0.002, base: 0.005, ethereum: 0.0 },
]

export function CostAdvantage() {
  const { theme } = useTheme()
  const accent = theme === 'light' ? '#0052D4' : '#5B9DF5'
  const gridColor = theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)'

  return (
    <motion.div
      className="rounded-xl border overflow-hidden"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-card-border)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-5 md:p-6 pb-0">
        <h3 className="text-base md:text-lg font-medium mb-1" style={{ color: 'var(--color-ink)' }}>
          Agent Cost Advantage
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-ink-muted)' }}>
          An AI agent making 1,000 transactions per day. Total daily cost by chain.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 px-5 md:px-6 pb-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ink-muted)' }}>
            Cost per 1,000 transactions
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={agentCosts} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: 'var(--color-ink-muted)' }}
                tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`}
                scale="log" domain={[0.5, 5000]}
              />
              <YAxis type="category" dataKey="chain" tick={{ fontSize: 11, fill: 'var(--color-ink-soft)' }} width={80} />
              <Tooltip content={({ payload }) => {
                if (!payload?.length) return null
                const d = payload[0].payload
                return (
                  <div className="rounded-lg px-3 py-2 text-xs shadow-lg border"
                    style={{ background: 'var(--color-card)', borderColor: 'var(--color-card-border)' }}>
                    <p className="font-semibold" style={{ color: 'var(--color-ink)' }}>{d.chain}</p>
                    <p className="font-mono" style={{ color: 'var(--color-ink-soft)' }}>${d.costPer1000Tx.toFixed(2)} / 1K txs</p>
                    <p className="font-mono" style={{ color: 'var(--color-ink-muted)' }}>${(d.costPer1000Tx * 30).toFixed(2)} / month</p>
                  </div>
                )
              }} />
              <Bar dataKey="costPer1000Tx" radius={[0, 4, 4, 0]}>
                {agentCosts.map((entry, i) => (
                  <Cell key={i} fill={entry.highlight ? accent : `${entry.color}55`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ink-muted)' }}>
            Per-operation breakdown
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--color-rule)' }}>
                {['Operation', 'NEAR', 'SOL', 'Base', 'ETH'].map((h, i) => (
                  <th key={h} className={`py-2 px-2 font-mono font-medium ${i === 0 ? 'text-left' : 'text-right'}`}
                    style={{ color: i === 1 ? accent : 'var(--color-ink-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {breakdownData.map((row) => (
                <tr key={row.operation} style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                  <td className="py-2 px-2" style={{ color: 'var(--color-ink-soft)' }}>{row.operation}</td>
                  <td className="py-2 px-2 text-right font-mono font-semibold" style={{ color: accent }}>${row.near}</td>
                  <td className="py-2 px-2 text-right font-mono" style={{ color: 'var(--color-ink-muted)' }}>${row.solana}</td>
                  <td className="py-2 px-2 text-right font-mono" style={{ color: 'var(--color-ink-muted)' }}>${row.base}</td>
                  <td className="py-2 px-2 text-right font-mono" style={{ color: 'var(--color-ink-muted)' }}>${row.ethereum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-5 md:px-6 py-3 border-t flex items-start gap-2"
        style={{ borderColor: 'var(--color-card-border)', background: 'var(--color-signal-up-soft)' }}>
        <span style={{ color: 'var(--color-signal-up)' }} className="text-xs mt-0.5">&#9654;</span>
        <p className="text-xs" style={{ color: 'var(--color-signal-up)', fontFamily: 'var(--font-mono)' }}>
          At ${nearCostPer1K.toFixed(2)}/1K tx, NEAR is in the same tier as Solana ($3.00). Both are 250-650x cheaper than Ethereum. NEAR's edge is the account model (named accounts, scoped keys), not fees alone.
        </p>
      </div>
    </motion.div>
  )
}
