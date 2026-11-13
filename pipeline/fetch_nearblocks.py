#!/usr/bin/env python3
"""
Fetch real NEAR network data from NEARBlocks public API.
No authentication needed. Outputs JSON files for the dashboard.
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timedelta

import requests

OUTPUT_DIR = Path(__file__).parent.parent / "dashboard" / "src" / "data"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

API_BASE = "https://api.nearblocks.io/v1"


def fetch_charts():
    print("Fetching NEARBlocks chart data (full history)...")
    resp = requests.get(f"{API_BASE}/charts", timeout=30)
    resp.raise_for_status()
    data = resp.json()
    charts = data.get("charts", [])
    print(f"  Got {len(charts)} days of data")
    return charts


def fetch_stats():
    print("Fetching current NEAR stats...")
    resp = requests.get(f"{API_BASE}/stats", timeout=30)
    resp.raise_for_status()
    data = resp.json()
    return data.get("stats", [{}])[0]


def to_date(iso: str) -> str:
    return iso.split("T")[0]


def transform_network_growth(charts: list) -> list:
    cutoff = (datetime.utcnow() - timedelta(days=180)).strftime("%Y-%m-%d")
    result = []
    for c in charts:
        d = to_date(c["date"])
        if d < cutoff:
            continue
        result.append({
            "date": d,
            "dailyActiveAccounts": int(c.get("active_accounts", 0)),
            "newAccounts": int(c.get("new_accounts", 0)),
            "contractDeploys": int(c.get("unique_contracts", 0)),
            "txCount": int(c.get("txns", 0)),
        })
    return result


def transform_tx_volume(charts: list) -> list:
    cutoff = (datetime.utcnow() - timedelta(days=180)).strftime("%Y-%m-%d")
    result = []
    for c in charts:
        d = to_date(c["date"])
        if d < cutoff:
            continue
        vol_usd = float(c.get("txn_volume_usd", 0))
        result.append({
            "date": d,
            "volume": vol_usd,
            "swapCount": int(c.get("txns", 0)),
            "uniqueUsers": int(c.get("active_accounts", 0)),
        })
    return result


def transform_fee_data(charts: list) -> list:
    cutoff = (datetime.utcnow() - timedelta(days=180)).strftime("%Y-%m-%d")
    result = []
    for c in charts:
        d = to_date(c["date"])
        if d < cutoff:
            continue
        fee_usd = float(c.get("txn_fee_usd", 0))
        txns = int(c.get("txns", 0))
        result.append({
            "date": d,
            "totalFeeUsd": fee_usd,
            "avgFeeUsd": fee_usd / txns if txns > 0 else 0,
            "txCount": txns,
        })
    return result


def compute_key_metrics(charts: list, stats: dict) -> dict:
    recent_180 = [c for c in charts if to_date(c["date"]) >= (datetime.utcnow() - timedelta(days=180)).strftime("%Y-%m-%d")]
    if not recent_180:
        return {}

    latest = recent_180[-1]
    earliest = recent_180[0]

    latest_daa = int(latest.get("active_accounts", 0))
    earliest_daa = int(earliest.get("active_accounts", 0))
    daa_growth = round(((latest_daa - earliest_daa) / earliest_daa * 100), 1) if earliest_daa > 0 else 0

    total_txns_180d = sum(int(c.get("txns", 0)) for c in recent_180)
    total_vol_180d = sum(float(c.get("txn_volume_usd", 0)) for c in recent_180)
    total_fee_180d = sum(float(c.get("txn_fee_usd", 0)) for c in recent_180)
    avg_fee = total_fee_180d / total_txns_180d if total_txns_180d > 0 else 0

    latest_new_contracts = int(latest.get("unique_contracts", 0))
    earliest_new_contracts = int(earliest.get("unique_contracts", 0))
    contract_growth = ((latest_new_contracts - earliest_new_contracts) / earliest_new_contracts * 100) if earliest_new_contracts > 0 else 0

    near_price = float(stats.get("near_price", 0))

    latest_txns = int(latest.get("txns", 0))
    earliest_txns = int(earliest.get("txns", 0))
    txn_growth = round(((latest_txns - earliest_txns) / earliest_txns * 100), 1) if earliest_txns > 0 else 0

    return {
        "totalVolume180d": f"${total_vol_180d / 1e9:.1f}B",
        "volumeGrowthRate": f"{txn_growth:+.0f}%",
        "dailyActiveAccounts": f"{latest_daa / 1000:.0f}K",
        "accountGrowthRate": f"{daa_growth:+.0f}%",
        "uniqueContractsDaily": str(latest_new_contracts),
        "contractGrowthRate": f"{contract_growth:+.0f}%",
        "avgTxCost": f"${avg_fee:.4f}",
        "txCostNote": f"{1 / avg_fee:.0f}x cheaper than ETH" if avg_fee > 0 else "N/A",
        "nearPrice": f"${near_price:.2f}",
        "totalTxns180d": total_txns_180d,
        "marketCap": f"${float(stats.get('market_cap', 0)) / 1e9:.1f}B",
        "dailyTxCount": f"{latest_txns / 1000:.0f}K",
        "txGrowthRate": f"{txn_growth:+.0f}%",
    }


def main():
    charts = fetch_charts()
    stats = fetch_stats()

    network_growth = transform_network_growth(charts)
    tx_volume = transform_tx_volume(charts)
    fee_data = transform_fee_data(charts)
    key_metrics = compute_key_metrics(charts, stats)

    outputs = {
        "realNetworkGrowth": network_growth,
        "realTxVolume": tx_volume,
        "realFeeData": fee_data,
        "realKeyMetrics": key_metrics,
        "realStats": stats,
    }

    out_path = OUTPUT_DIR / "realData.json"
    with open(out_path, "w") as f:
        json.dump(outputs, f, indent=2)
    print(f"\nWrote {out_path}")
    print(f"  Network growth: {len(network_growth)} days")
    print(f"  TX volume: {len(tx_volume)} days")
    print(f"  Fee data: {len(fee_data)} days")
    print(f"  Key metrics: {list(key_metrics.keys())}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
