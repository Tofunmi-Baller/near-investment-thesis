# Fewer Users, More Value: What NEAR's Data Actually Shows

**Claim:** NEAR Protocol's daily active accounts fell 46% over six months — but value per transaction doubled, activity per account rose 52%, and contract deploys quadrupled. This pattern is consistent with a chain shifting from retail speculation to economic infrastructure. The thesis is plausible but unproven; this document lays out what must be true for it to hold.

---

## The Data (May 16 – Nov 11, 2026)

All figures are 30-day averages unless noted. Source: [NEARBlocks public API](https://api.nearblocks.io/v1/charts), no authentication required.

| Metric | First 30 days | Last 30 days | Change |
|--------|--------------|-------------|--------|
| Daily active accounts | 116,900 | 62,900 | **-46%** |
| New accounts/day | 16,800 | 9,500 | -43% |
| Transactions/day | 854,600 | 663,800 | -22% |
| USD transfer volume/day | $121.8M | $190.3M | **+56%** |
| USD per transaction | $135 | $288 | **+114%** |
| Transactions per account | 7.3 | 11.1 | **+52%** |
| Unique contracts/day | 9.8 | 40.6 | **+4.1x** |
| Fee revenue/day | $2,101 | $4,469 | +113% |
| Avg fee per transaction | $0.0025 | $0.0066 | +164% |

**Notable anomalies:** Four days (Oct 3, 4, 7 and Nov 10) show DAA spikes to ~176K against a baseline of 50–80K. These appear to be a single recurring campaign or bot batch (nearly identical caps). The 30-day median DAA (54K) is more reliable than the mean (63K).

---

## The Thesis

NEAR is shedding casual users while becoming more economically dense. The remaining accounts transact more frequently and move significantly more value per transaction. Contract deployment activity is rising through the user decline, suggesting builder retention.

This pattern is **consistent with** a shift toward infrastructure, settlement, and agent use cases — but the data **does not prove** it. The per-account and per-transaction economics are improving, and NEAR's account model (named accounts, function-call access keys, sub-accounts) remains structurally suited for autonomous agent economies. Whether agents are the cause of the density shift, or whether it's exchange consolidation, whale activity, or something else entirely, cannot be determined from the available data.

---

## What We Got Wrong

We tested several hypotheses before arriving at the current thesis. Documenting the failures matters.

1. **"DAA is accelerating."** False. DAA declined 46% over 6 months (30-day averages). The 30-day median is 54K, and the 7-day average bottomed at ~50K on Nov 2.

2. **"Transaction volume is a leading indicator of DAA."** False. We tested correlation at lags of 0, 5, 10, 20, and 30 days. The best R² was 1.8%, and the correlation was negative at every lag. No predictive power.

3. **"Contract deploys grew 6,300%."** Misleading. The first day of the window had 1 deploy; the last had 64. On 30-day averages the growth is 4.1x (9.8 → 40.6/day). Additionally, the NEARBlocks field (`unique_contracts`) may not measure new deploys specifically.

4. **"Agent activity is the fastest-growing on-chain segment."** Unverifiable from the NEARBlocks API. Distinguishing agent accounts (e.g., `*.agent.near`) from regular accounts requires BigQuery-level data access.

---

## What Has to Be True

For the "economic density" thesis to convert from plausible to proven, six conditions need to be met. Currently: 0 met, 2 in progress, 2 unmeasured.

### a. User-base floor (In progress)

The 30-day median DAA is 54K. On Nov 3, DAA stepped from ~47K to 72–79K and has held for 8 days. This step is unexplained.

- **Stabilized:** 30-day median ≥ 75K (Aug–Sep level), 7-day average never below 65K.
- **Proven:** 30-day median ≥ 85K (Jul–Aug level).
- **Kill level:** 7-day average below 50K — a new floor.

### b. Density persists without spike dependence (In progress)

USD/tx is U-shaped ($135, $60, $53, $96, $349, $288). The latest window is down 17% from its peak. Eight of the top volume days fall in a single four-week stretch (Sep 18 – Oct 13), including a $901M day.

- **Stabilized:** 30-day median USD/tx ≥ $200 and median volume ≥ $150M/day for 90 more days.
- **Kill level:** USD/tx returns below $100 (the Jun–Aug range), making "density" a temporary event.

### c. Transactions recover (Not met)

Transactions fell 22% (854K → 664K/day). The "tx per account" ratio rose partly because DAA fell faster — a denominator effect.

- **Met:** 30-day avg transactions ≥ 855K with DAA flat or rising.
- **Kill level:** Continued decline in both.

### d. Fee revenue scales (Not met, right direction)

The last 30 days annualize to $1.63M in fee revenue, up from $0.77M for the first 30. At $4.5B market cap, that's roughly 2,700x price-to-fees.

- **Signal:** $5M annualized (~900x P/F).
- **Meaningful:** $10M annualized (~450x P/F).
- **Reality check:** Even $10M doesn't justify the valuation. The bull case needs fees up 100x, which at $0.0066/tx means ~68M tx/day (~780 sustained TPS) vs ~7.7 TPS today. The thesis requires both low fees and 100x throughput growth.

### e. Volume attribution (Unmeasured)

The $190M/day in transfer volume could be real economic settlement or exchange/custodian wallet reshuffling. The NEARBlocks API cannot distinguish the two.

- **Measurable via:** BigQuery analysis of sender concentration (top-10 senders' share of volume), stablecoin contract transfer share (via DefiLlama).

### f. Agent attribution (Unmeasured)

No baseline exists for agent-specific activity from public APIs.

- **Step 1:** Measurement exists (share of transactions signed by function-call access keys, or accounts above 100 tx/day, sourced from BigQuery).
- **Step 2:** That share rises for three consecutive months.

---

## Valuation Context

| Metric | Value |
|--------|-------|
| NEAR price | $3.41 |
| Market cap | $4.5B |
| Circulating supply | 1.25B of 1.31B total (95.4%) |
| 180-day annualized fees | $1.07M |
| Last-30-day annualized fees | $1.63M |
| Price-to-fees (last 30d) | ~2,700x |

The bull case for NEAR requires fee revenue growth of 100x+ to reach conventional L1 valuation multiples. This requires either massive autonomous-agent adoption (the structural thesis), NEAR becoming a dominant cross-chain settlement layer, or both. Neither is proven.

---

## Verdict

NEAR's economic density is rising while its user count falls. This is not a dying chain — it's a concentrating one. The question is whether the concentration leads to infrastructure-grade utility (settlement, agents, cross-chain routing) or simply reflects a shrinking user base doing fewer but larger transactions.

The structural advantages — named accounts, function-call access keys, sub-accounts, sub-cent fees — remain real and unmatched. The data is consistent with the thesis. It does not yet confirm it.

**Current scorecard: 0 of 6 conditions met, 2 in progress, 2 unmeasured.**

---

*Data source: [NEARBlocks public API](https://api.nearblocks.io/v1/charts). Run `make rebuild` to regenerate all data and charts from source. No credentials required.*
