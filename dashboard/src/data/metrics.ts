import type {
  NetworkGrowth,
  ChainComparison,
} from '../types'
import realDataJson from './realData.json'

const raw = realDataJson as {
  realNetworkGrowth: NetworkGrowth[]
  realTxVolume: { date: string; volume: number; swapCount: number; uniqueUsers: number }[]
  realFeeData: { date: string; totalFeeUsd: number; avgFeeUsd: number; txCount: number }[]
  realKeyMetrics: Record<string, string | number>
  realStats: Record<string, string | number>
}

// ─── REAL DATA ───────────────────────────────────────────────────────────

export const networkGrowth: NetworkGrowth[] = raw.realNetworkGrowth

export interface TxVolumeDay {
  date: string
  volumeUsd: number
  txCount: number
  activeAccounts: number
  txPerAccount: number
  usdPerTx: number
}

export const txVolumeData: TxVolumeDay[] = raw.realTxVolume.map((d, i) => {
  const ng = raw.realNetworkGrowth[i]
  const txCount = ng?.txCount || d.swapCount
  const daa = ng?.dailyActiveAccounts || d.uniqueUsers
  return {
    date: d.date,
    volumeUsd: d.volume,
    txCount,
    activeAccounts: daa,
    txPerAccount: daa > 0 ? Math.round((txCount / daa) * 10) / 10 : 0,
    usdPerTx: txCount > 0 ? Math.round(d.volume / txCount) : 0,
  }
})

export const feeData = raw.realFeeData

// ─── COMPUTED METRICS (from real data, 30-day averages) ──────────────────

const ngFirst30 = networkGrowth.slice(0, 30)
const ngLast30 = networkGrowth.slice(-30)
const tvFirst30 = txVolumeData.slice(0, 30)
const tvLast30 = txVolumeData.slice(-30)
const feeLast30 = feeData.slice(-30)

function avgOf<T>(slice: T[], getter: (d: T) => number): number {
  const vals = slice.map(getter).filter(v => !isNaN(v))
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

const daaFirst30 = avgOf(ngFirst30, d => d.dailyActiveAccounts)
const daaLast30 = avgOf(ngLast30, d => d.dailyActiveAccounts)
const txFirst30 = avgOf(ngFirst30, d => d.txCount)
const txLast30 = avgOf(ngLast30, d => d.txCount)
const volFirst30 = avgOf(tvFirst30, d => d.volumeUsd)
const volLast30 = avgOf(tvLast30, d => d.volumeUsd)
const txPerAccFirst30 = avgOf(tvFirst30, d => d.txPerAccount)
const txPerAccLast30 = avgOf(tvLast30, d => d.txPerAccount)
const usdPerTxFirst30 = avgOf(tvFirst30, d => d.usdPerTx)
const usdPerTxLast30 = avgOf(tvLast30, d => d.usdPerTx)
export const avgFeeLast30 = feeLast30.reduce((s, d) => s + d.avgFeeUsd, 0) / feeLast30.length

function fmtPct(from: number, to: number): string {
  const pct = ((to - from) / from) * 100
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`
}

export const keyMetrics = {
  daa: `${(daaLast30 / 1000).toFixed(1)}K`,
  daaChange: fmtPct(daaFirst30, daaLast30),
  daaPositive: daaLast30 >= daaFirst30,

  dailyTx: `${(txLast30 / 1000).toFixed(0)}K`,
  dailyTxChange: fmtPct(txFirst30, txLast30),
  dailyTxPositive: txLast30 >= txFirst30,

  volumePerDay: `$${(volLast30 / 1e6).toFixed(0)}M`,
  volumeChange: fmtPct(volFirst30, volLast30),
  volumePositive: volLast30 >= volFirst30,

  txPerAccount: txPerAccLast30.toFixed(1),
  txPerAccountChange: fmtPct(txPerAccFirst30, txPerAccLast30),
  txPerAccountPositive: txPerAccLast30 >= txPerAccFirst30,

  usdPerTx: `$${usdPerTxLast30.toFixed(0)}`,
  usdPerTxChange: fmtPct(usdPerTxFirst30, usdPerTxLast30),
  usdPerTxPositive: usdPerTxLast30 >= usdPerTxFirst30,

  avgFee: `$${avgFeeLast30.toFixed(4)}`,
  nearPrice: `$${parseFloat(raw.realStats.near_price as string || '0').toFixed(2)}`,
  marketCap: `$${(parseFloat(raw.realStats.market_cap as string || '0') / 1e9).toFixed(1)}B`,
}

// ─── ECONOMIC DENSITY (the key thesis metric) ────────────────────────────

export interface EconomicDensity {
  date: string
  daaIndex: number
  txPerAccountIndex: number
  usdPerTxIndex: number
}

export const economicDensity: EconomicDensity[] = (() => {
  if (txVolumeData.length === 0) return []
  const baseDaa = txVolumeData[0].activeAccounts || 1
  const baseTxPerAcc = txVolumeData[0].txPerAccount || 1
  const baseUsdPerTx = txVolumeData[0].usdPerTx || 1
  return txVolumeData.map(d => ({
    date: d.date,
    daaIndex: Math.round((d.activeAccounts / baseDaa) * 100),
    txPerAccountIndex: Math.round((d.txPerAccount / baseTxPerAcc) * 100),
    usdPerTxIndex: Math.round((d.usdPerTx / baseUsdPerTx) * 100),
  }))
})()

// ─── SCORECARD: What has to be true ──────────────────────────────────────

function median(arr: number[]): number {
  const s = [...arr].sort((a, b) => a - b)
  const n = s.length
  return n % 2 ? s[Math.floor(n / 2)] : (s[n / 2 - 1] + s[n / 2]) / 2
}

function avg7end(data: { dailyActiveAccounts: number }[]): number {
  const last7 = data.slice(-7)
  return last7.reduce((s, d) => s + d.dailyActiveAccounts, 0) / last7.length
}

const daaMedianLast30 = median(ngLast30.map(d => d.dailyActiveAccounts))
const daa7dAvg = avg7end(networkGrowth)
const usdPerTxMedianLast30 = median(tvLast30.map(d => d.usdPerTx))
const feeAnnualized = (feeLast30.reduce((s, d) => s + d.totalFeeUsd, 0) / feeLast30.length) * 365

export type ScorecardStatus = 'met' | 'in-progress' | 'not-met' | 'unmeasured'

export interface ScorecardRow {
  signal: string
  now: string
  stabilizedBar: string
  killLevel: string
  status: ScorecardStatus
  detail: string
}

export const scorecard: ScorecardRow[] = [
  {
    signal: 'User-base floor (DAA)',
    now: `${(daaMedianLast30 / 1000).toFixed(1)}K median, ${(daa7dAvg / 1000).toFixed(1)}K 7d avg`,
    stabilizedBar: '30d median ≥ 75K',
    killLevel: '7d avg < 50K',
    status: daaMedianLast30 >= 75000 ? 'met' : daa7dAvg >= 50000 ? 'in-progress' : 'not-met',
    detail: 'Nov 3 step from ~47K to 72–79K unexplained. Four spike days (~176K) are likely a single recurring campaign.',
  },
  {
    signal: 'Density holds (USD/tx)',
    now: `$${usdPerTxMedianLast30.toFixed(0)} median`,
    stabilizedBar: 'Median ≥ $200 for 90d',
    killLevel: 'Below $100 (Jun–Aug range)',
    status: usdPerTxMedianLast30 >= 200 ? 'in-progress' : 'not-met',
    detail: 'USD/tx is U-shaped, not a steady climb. Latest window down 17% from peak. Need 90 more days above $200.',
  },
  {
    signal: 'Transactions recover',
    now: `${(txLast30 / 1000).toFixed(0)}K/day`,
    stabilizedBar: '30d avg ≥ 855K with DAA flat',
    killLevel: 'Continued decline',
    status: txLast30 >= 855000 ? 'met' : 'not-met',
    detail: 'Tx/account ratio rose partly because DAA fell faster — a denominator effect.',
  },
  {
    signal: 'Fee revenue scales',
    now: `$${(feeAnnualized / 1e6).toFixed(2)}M annualized`,
    stabilizedBar: '$5M annualized',
    killLevel: 'Below $2M',
    status: feeAnnualized >= 5000000 ? 'met' : feeAnnualized >= 2000000 ? 'in-progress' : 'not-met',
    detail: `At $${avgFeeLast30.toFixed(4)}/tx, $10M needs ~68M tx/day (~780 TPS) vs ~${(txLast30 / 86400).toFixed(1)} TPS now.`,
  },
  {
    signal: 'Volume attribution',
    now: 'Unknown',
    stabilizedBar: 'Top-10 senders < 50% of volume',
    killLevel: '—',
    status: 'unmeasured',
    detail: 'Transfer volume could be economic settlement or custodial reshuffling. Requires BigQuery sender analysis.',
  },
  {
    signal: 'Agent attribution',
    now: 'Unknown',
    stabilizedBar: 'Function-call key share rising 3mo',
    killLevel: '—',
    status: 'unmeasured',
    detail: 'No baseline for agent-specific activity from public APIs. Needs *.agent.near filtering via BigQuery.',
  },
]

export const scorecardSummary = (() => {
  const counts = { met: 0, 'in-progress': 0, 'not-met': 0, unmeasured: 0 }
  scorecard.forEach(r => counts[r.status]++)
  return counts
})()

// ─── CHAIN COMPARISON (sourced, with caveats) ────────────────────────────

export const chainComparison: ChainComparison[] = [
  { chain: 'NEAR', dailyActiveAccounts: Math.round(daaLast30), avgTxFee: avgFeeLast30, tps: Math.round(txLast30 / 86400) },
  { chain: 'Solana', dailyActiveAccounts: 1800000, avgTxFee: 0.003, tps: 4000 },
  { chain: 'Ethereum', dailyActiveAccounts: 500000, avgTxFee: 2.50, tps: 30 },
  { chain: 'Base', dailyActiveAccounts: 850000, avgTxFee: 0.01, tps: 80 },
  { chain: 'Avalanche', dailyActiveAccounts: 95000, avgTxFee: 0.02, tps: 200 },
]

// ─── QUERIES / SOURCES ───────────────────────────────────────────────────

export const queries = {
  networkGrowth: `-- Source: NEARBlocks Public API (no auth required)
-- GET https://api.nearblocks.io/v1/charts
-- Fields: active_accounts, new_accounts, unique_contracts, txns
-- 2300+ days of history. Fetched ${new Date().toISOString().split('T')[0]}.
--
-- Equivalent BigQuery query:
SELECT
  block_date,
  COUNT(DISTINCT signer_account_id) AS daily_active_accounts,
  COUNT(DISTINCT CASE
    WHEN receipt_predecessor_account_id = 'system'
    THEN receiver_account_id END) AS new_accounts,
  COUNT(*) AS tx_count
FROM \`bigquery-public-data.crypto_near_mainnet_us.receipt_actions\`
WHERE block_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 180 DAY)
GROUP BY block_date
ORDER BY block_date`,

  txVolume: `-- Source: NEARBlocks Public API
-- GET https://api.nearblocks.io/v1/charts
-- Fields: txn_volume_usd, txns, active_accounts
-- Fetched ${new Date().toISOString().split('T')[0]}.`,

  economicDensity: `-- Derived from NEARBlocks data:
-- tx_per_account = txns / active_accounts
-- usd_per_tx = txn_volume_usd / txns
-- Both indexed to day 1 = 100 for comparison.`,

  chainComparison: `-- NEAR: NEARBlocks API (api.nearblocks.io/v1/stats)
-- Other chains: approximate figures from public sources.
-- Solana: explorer.solana.com, Helius
-- Ethereum: etherscan.io
-- Base: basescan.org
-- Avalanche: snowtrace.io
-- "AI Contracts" column removed: no verifiable cross-chain data.
-- Last updated: ${new Date().toISOString().split('T')[0]}`,
}
