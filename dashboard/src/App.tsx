import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Sidebar } from './components/Sidebar'
import { Section, FadeIn } from './components/Section'
import { MetricCard } from './components/MetricCard'
import { ChartCard } from './components/ChartCard'
import { ComparisonTable } from './components/ComparisonTable'
import { CostAdvantage } from './components/CostAdvantage'
import { Scorecard } from './components/Scorecard'
import { Tour } from './components/Tour'
import { WelcomeOverlay } from './components/WelcomeOverlay'
import { useTheme, THEME_COLORS } from './ThemeContext'
import {
  networkGrowth, txVolumeData, economicDensity,
  chainComparison, keyMetrics, queries, scorecardSummary,
} from './data/metrics'

const SECTIONS = [
  { id: 'thesis', label: 'The Thesis', icon: '◆' },
  { id: 'density', label: 'Economic Density', icon: '↗' },
  { id: 'growth', label: 'Network Activity', icon: '≡' },
  { id: 'volume', label: 'Value Flow', icon: '$' },
  { id: 'costs', label: 'Cost Structure', icon: '↓' },
  { id: 'comparison', label: 'vs. Others', icon: '≡' },
  { id: 'wrong', label: 'What We Got Wrong', icon: '✗' },
  { id: 'conditions', label: 'What Has to Be True', icon: '☐' },
  { id: 'verdict', label: 'Verdict', icon: '⚖' },
]

function formatDate(date: string) {
  return new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}
function formatK(v: number) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
  return v.toString()
}
function formatUSD(v: number) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(0)}M`
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`
  return `$${v.toFixed(0)}`
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg px-3 py-2 text-xs shadow-lg border"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-card-border)', color: 'var(--color-ink)' }}>
      <p className="font-mono mb-1" style={{ color: 'var(--color-ink-muted)' }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-mono">
          {entry.name}: {typeof entry.value === 'number' && entry.value > 10000
            ? formatK(entry.value) : entry.value?.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

const chartMargin = { top: 8, right: 16, left: 0, bottom: 0 }


function rolling7<T extends Record<string, any>>(data: T[], key: string): (T & Record<string, number>)[] {
  return data.map((d, i) => {
    const start = Math.max(0, i - 6)
    let sum = 0
    for (let j = start; j <= i; j++) sum += (data[j][key] || 0)
    return { ...d, [`${key}_7d`]: Math.round(sum / (i - start + 1)) }
  })
}

const smoothedNetwork = rolling7(networkGrowth, 'dailyActiveAccounts')
const smoothedVolume = rolling7(txVolumeData, 'volumeUsd')
const sampledNetworkGrowth = networkGrowth.filter((_, i) => i % 3 === 0)
const sampledTxVolume = txVolumeData.filter((_, i) => i % 2 === 0)

export default function App() {
  const { theme } = useTheme()
  const [activeSection, setActiveSection] = useState('thesis')
  const [runTour, setRunTour] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  const { accent, green, purple, red, yellow, grid, axis } = THEME_COLORS[theme]

  useEffect(() => {
    const visited = localStorage.getItem('thesis-toured')
    if (!visited) {
      const t = setTimeout(() => setShowWelcome(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  const handleNavigate = useCallback((id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { for (const e of entries) { if (e.isIntersecting) setActiveSection(e.target.id) } },
      { rootMargin: '-40% 0px -40% 0px' }
    )
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="noise">
      <WelcomeOverlay show={showWelcome}
        onStartTour={() => { setShowWelcome(false); localStorage.setItem('thesis-toured', 'true'); requestAnimationFrame(() => setRunTour(true)) }}
        onDismiss={() => { setShowWelcome(false); localStorage.setItem('thesis-toured', 'true') }}
      />
      <Tour run={runTour} onFinish={() => { setRunTour(false); localStorage.setItem('thesis-toured', 'true') }} />
      <Sidebar sections={SECTIONS} activeSection={activeSection} onNavigate={handleNavigate} onStartTour={() => setRunTour(true)} />

      <main className="ml-16 md:ml-56">

        {/* ── HERO ── */}
        <section id="thesis" className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-20 relative">
          <div id="section-hero">
            <motion.p className="text-[11px] font-mono tracking-[0.2em] uppercase mb-6"
              style={{ color: 'var(--color-accent)' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              NEAR Hackathon 2026 &middot; Track 02: Investment Thesis &middot; Data as of {networkGrowth[networkGrowth.length - 1]?.date || '2026-11-11'}
            </motion.p>

            <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight max-w-4xl"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}>
              Fewer users. <span style={{ color: 'var(--color-accent)' }}>More value per transaction.</span>{' '}
              What NEAR's data actually shows.
            </motion.h1>

            <motion.p className="mt-6 text-base md:text-lg leading-relaxed max-w-2xl"
              style={{ color: 'var(--color-ink-soft)' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
              NEAR's daily active accounts fell 46% in six months. Most analysts would stop there.
              But value per transaction doubled, activity per account rose 52%, and contract deploys quadrupled.
              This is the signature of a chain shifting from retail speculation to economic infrastructure.
            </motion.p>

            <motion.div className="mt-4 flex items-center gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <a href="#density" onClick={(e) => { e.preventDefault(); handleNavigate('density') }}
                className="text-sm font-medium px-5 py-2.5 rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'var(--color-accent)', color: '#fff' }}>
                See the evidence &#8595;
              </a>
              <span className="text-xs font-mono" style={{ color: 'var(--color-ink-muted)' }}>
                All data from NEARBlocks public API &middot; {keyMetrics.nearPrice} &middot; {keyMetrics.marketCap} mcap
              </span>
            </motion.div>
          </div>

          {/* Key metrics — honest numbers */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-5 gap-3" id="tour-metrics">
            <MetricCard label="Daily Active Accounts" value={keyMetrics.daa} change={keyMetrics.daaChange} positive={keyMetrics.daaPositive} delay={0.1} />
            <MetricCard label="Value / Transaction" value={keyMetrics.usdPerTx} change={keyMetrics.usdPerTxChange} positive={keyMetrics.usdPerTxPositive} delay={0.2} />
            <MetricCard label="Tx / Account" value={keyMetrics.txPerAccount} change={keyMetrics.txPerAccountChange} positive={keyMetrics.txPerAccountPositive} delay={0.3} />
            <MetricCard label="Volume / Day" value={keyMetrics.volumePerDay} change={keyMetrics.volumeChange} positive={keyMetrics.volumePositive} delay={0.4} />
            <MetricCard label="Avg Tx Fee" value={keyMetrics.avgFee} change="30d avg" positive={true} delay={0.5} />
          </div>

          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <span className="text-lg" style={{ color: 'var(--color-ink-muted)' }}>&#8964;</span>
          </motion.div>
        </section>

        {/* ── 01: ECONOMIC DENSITY (the thesis chart) ── */}
        <Section id="density" number="01" title="The economic density thesis"
          subtitle="Indexed to day 1 = 100. Accounts are falling, but each remaining account does more and moves more value. This is not a dying chain — it's a concentrating one.">
          <ChartCard id="tour-chart-example"
            title="Economic Density: DAA vs Activity vs Value (indexed)"
            description="Three metrics indexed to 100 on May 16. A rising density line above a falling DAA line is the thesis in one chart."
            query={queries.economicDensity}
            insight={`DAA index at ${economicDensity[economicDensity.length-1]?.daaIndex || '?'}, tx/account index at ${economicDensity[economicDensity.length-1]?.txPerAccountIndex || '?'}, USD/tx index at ${economicDensity[economicDensity.length-1]?.usdPerTxIndex || '?'}.`}>
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={economicDensity} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10, fill: axis }} />
                <YAxis tick={{ fontSize: 10, fill: axis }} domain={[0, 'auto']} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="daaIndex" name="DAA (indexed)" stroke={red} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="txPerAccountIndex" name="Tx/Account (indexed)" stroke={accent} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="usdPerTxIndex" name="USD/Tx (indexed)" stroke={green} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Section>

        {/* ── 02: NETWORK ACTIVITY ── */}
        <Section id="growth" number="02" title="Network activity: the honest picture"
          subtitle="DAA declined from ~117K to ~63K (30-day averages). Transactions also fell 22%, but contract deployment activity quadrupled.">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Daily Active Accounts (7-day avg)"
              description="Unique signers per day, with 7-day rolling average smoothing spike days."
              query={queries.networkGrowth}
              insight={`30-day avg DAA fell from ${(Math.round(117000/1000))}K to ${keyMetrics.daa}. The Oct spikes (~176K) need investigation — likely airdrop or bot events.`}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={smoothedNetwork} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10, fill: axis }} />
                  <YAxis tickFormatter={formatK} tick={{ fontSize: 10, fill: axis }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="dailyActiveAccounts" name="Daily (raw)" stroke={accent} fill={accent} fillOpacity={0.04} strokeWidth={1} strokeOpacity={0.3} />
                  <Area type="monotone" dataKey="dailyActiveAccounts_7d" name="7-day avg" stroke={accent} fill={accent} fillOpacity={0.08} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="New Accounts & Contract Activity"
              description="New accounts created and unique contracts active per day."
              query={queries.networkGrowth}
              insight="New accounts declining in line with DAA. Contract activity rising ~4x suggests builder retention despite user churn.">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={sampledNetworkGrowth} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10, fill: axis }} />
                  <YAxis tickFormatter={formatK} tick={{ fontSize: 10, fill: axis }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="newAccounts" name="New Accounts" fill={accent} fillOpacity={0.6} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="contractDeploys" name="Unique Contracts" fill={purple} fillOpacity={0.6} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </Section>

        {/* ── 03: VALUE FLOW ── */}
        <Section id="volume" number="03" title="Value flow is growing despite fewer users"
          subtitle="Daily USD transfer volume rose 56% (30-day avg) while accounts fell. The remaining users are moving real money.">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Daily Transfer Volume (USD, 7-day avg)"
              description="Total USD value of on-chain transfers per day."
              query={queries.txVolume}
              insight={`30-day avg volume: ${keyMetrics.volumePerDay}/day, ${keyMetrics.volumeChange} from the first 30 days of this window.`}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={smoothedVolume} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10, fill: axis }} />
                  <YAxis tickFormatter={formatUSD} tick={{ fontSize: 10, fill: axis }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="volumeUsd" name="Daily (raw)" stroke={green} fill={green} fillOpacity={0.04} strokeWidth={1} strokeOpacity={0.3} />
                  <Area type="monotone" dataKey="volumeUsd_7d" name="7-day avg" stroke={green} fill={green} fillOpacity={0.08} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Value per Transaction"
              description="Average USD moved per transaction. Rising value/tx with falling DAA = economic concentration."
              query={queries.txVolume}
              insight={`USD/tx doubled from ~$142 to ~$287. Fewer casual transactions, more economically significant ones.`}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={sampledTxVolume} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10, fill: axis }} />
                  <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 10, fill: axis }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="usdPerTx" name="USD/Tx" stroke={yellow} fill={yellow} fillOpacity={0.08} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </Section>

        {/* ── 04: COST STRUCTURE ── */}
        <Section id="costs" number="04" title="NEAR's cost structure for agents"
          subtitle="Low fees matter for AI agents making thousands of micro-transactions. But the comparison must be honest.">
          <CostAdvantage />
        </Section>

        {/* ── 05: CHAIN COMPARISON ── */}
        <Section id="comparison" number="05" title="How NEAR compares"
          subtitle="NEAR benchmarked on verifiable metrics. Columns without reliable cross-chain data have been removed.">
          <ChartCard title="Cross-Chain Comparison"
            description="NEAR vs. major L1/L2 chains. NEAR DAA and fee data are real; other chains are approximate from public explorers."
            query={queries.chainComparison}
            insight="NEAR has the lowest fees but also the lowest DAA and TPS in this set. The thesis rests on account-model advantages, not raw throughput.">
            <ComparisonTable data={chainComparison} />
          </ChartCard>
        </Section>

        {/* ── 06: WHAT WE GOT WRONG ── */}
        <Section id="wrong" number="06" title="What we got wrong"
          subtitle="Intellectual honesty is the strongest signal of analytical rigor. Here's what we tested and what failed.">
          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn>
              <div className="rounded-xl border p-6" style={{ background: 'var(--color-signal-down-soft)', borderColor: 'var(--color-card-border)' }}>
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-sm" style={{ color: 'var(--color-signal-down)' }}>
                  <span>&#10007;</span> Hypotheses that failed
                </h4>
                <ul className="space-y-3">
                  {[
                    'H1: "DAA is accelerating." False. DAA declined 46% over 6 months (30-day averages).',
                    'H2: "TX volume leads DAA with a lag." False. Correlation R² = 1.8%, slightly negative. No predictive power.',
                    'H3: "Contract deploys grew 6300%." Misleading. Day-1 value was 1; 30-day avg growth is ~4x. The metric may not measure deploys.',
                    'H4: "Agent activity is the fastest-growing segment." Unverifiable without BigQuery access. We cannot distinguish agent accounts from the API.',
                  ].map((item, i) => (
                    <motion.li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--color-ink-soft)' }}
                      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      <span style={{ color: 'var(--color-signal-down)' }} className="mt-0.5 shrink-0">&#10007;</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="rounded-xl border p-6" style={{ background: 'var(--color-signal-up-soft)', borderColor: 'var(--color-card-border)' }}>
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-sm" style={{ color: 'var(--color-signal-up)' }}>
                  <span>&#10003;</span> What the data does support
                </h4>
                <ul className="space-y-3">
                  {[
                    'Value per transaction doubled ($135 → $288, 30d avg). Remaining users are moving real money.',
                    'Activity per account rose 52% (7.3 → 11.1 tx/account). Each account is more engaged.',
                    'Daily USD volume rose 56% ($122M → $190M) despite 46% fewer accounts.',
                    'Contract activity grew ~4x (9.8 → 40.6/day). Builder retention through user decline.',
                    'Fees at $0.007/tx — sub-cent but rising (was $0.003). Still viable for high-frequency use.',
                  ].map((item, i) => (
                    <motion.li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--color-ink-soft)' }}
                      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      <span style={{ color: 'var(--color-signal-up)' }} className="mt-0.5 shrink-0">&#10003;</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </Section>

        {/* ── 07: WHAT HAS TO BE TRUE ── */}
        <Section id="conditions" number="07" title="What has to be true"
          subtitle={`Six conditions for the thesis to convert from plausible to proven. Current tally: ${scorecardSummary.met} met, ${scorecardSummary['in-progress']} in progress, ${scorecardSummary['not-met']} not met, ${scorecardSummary.unmeasured} unmeasured.`}>
          <Scorecard />
        </Section>

        {/* ── 08: VERDICT ── */}
        <Section id="verdict" number="08" title="Verdict"
          subtitle="The economic density thesis is plausible but unproven. Here's where it stands.">
          <FadeIn>
            <div className="rounded-xl border p-6 md:p-8 max-w-3xl" style={{ background: 'var(--color-card)', borderColor: 'var(--color-card-border)' }} id="section-verdict">
              <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--color-ink-soft)' }}>
                NEAR is shedding retail users while becoming more economically dense. Value per transaction has doubled.
                Activity per remaining account is up 52%. Builder activity (contract deploys) is growing through the user decline.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--color-ink-soft)' }}>
                This pattern is <em>consistent with</em> a shift toward infrastructure and agent use, but it does not <em>prove</em> it.
                The agent thesis requires BigQuery-level data to verify (filtering by *.agent.near accounts, function-call key usage patterns).
                The per-account and per-transaction economics are improving, and NEAR's account model
                (named accounts, scoped keys, sub-accounts) remains structurally suited for agent economies.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--color-ink)' }}>
                <strong>Valuation:</strong> at a {keyMetrics.marketCap} market cap and ~$1.6M annualized fees (last 30 days),
                NEAR trades at roughly 2,700x price-to-fees. The bull case requires fee revenue to grow 100x+, which at current
                per-tx fees means ~68M transactions/day (~780 sustained TPS) vs ~8 TPS today.
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-soft)' }}>
                The scorecard above defines the specific, quantified conditions under which this thesis would be confirmed or killed.
                Until more conditions are met, the correct position is: watch, don't commit.
              </p>
            </div>
          </FadeIn>
        </Section>

        {/* Footer */}
        <footer className="px-6 md:px-12 lg:px-20 py-12 border-t" style={{ borderColor: 'var(--color-rule)' }}>
          <div className="max-w-2xl">
            <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--color-ink-muted)' }}>Data sources</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>
              All network data from{' '}
              <code className="px-1 rounded" style={{ background: 'var(--color-code-bg)' }}>api.nearblocks.io/v1/charts</code>{' '}
              and{' '}
              <code className="px-1 rounded" style={{ background: 'var(--color-code-bg)' }}>api.nearblocks.io/v1/stats</code>.
              No authentication required. Run{' '}
              <code className="px-1 rounded" style={{ background: 'var(--color-code-bg)' }}>python3 pipeline/fetch_nearblocks.py && npm run build</code>{' '}
              to regenerate from source. Cross-chain comparison data is approximate from public explorers.
            </p>
          </div>
          <p className="mt-6 text-xs font-mono" style={{ color: 'var(--color-ink-muted)' }}>
            NEAR Hackathon 2026 &middot; Track 02: Investment Thesis
          </p>
        </footer>
      </main>
    </div>
  )
}
