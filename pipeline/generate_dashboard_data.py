#!/usr/bin/env python3
"""
Transform raw BigQuery + API data into the JSON format the dashboard consumes.
Reads from data/raw/, writes to dashboard/public/data/.
"""

import json
from pathlib import Path

RAW_DIR = Path(__file__).parent.parent / "data" / "raw"
OUT_DIR = Path(__file__).parent.parent / "dashboard" / "public" / "data"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def load_raw(name: str) -> list:
    path = RAW_DIR / f"{name}.json"
    if not path.exists():
        print(f"  Warning: {path} not found, skipping {name}")
        return []
    with open(path) as f:
        return json.load(f)


def transform_network_growth(data: list) -> list:
    return [
        {
            "date": row["block_date"] if isinstance(row.get("block_date"), str) else str(row.get("block_date", "")),
            "dailyActiveAccounts": int(row.get("daily_active_accounts", 0)),
            "newAccounts": int(row.get("new_accounts", 0)),
            "contractDeploys": int(row.get("contract_deploys", 0)),
            "txCount": int(row.get("tx_count", 0)),
        }
        for row in data
    ]


def transform_agent_activity(data: list) -> list:
    return [
        {
            "date": row["block_date"] if isinstance(row.get("block_date"), str) else str(row.get("block_date", "")),
            "agentTxCount": int(row.get("agent_tx_count", 0)),
            "uniqueAgents": int(row.get("unique_agents", 0)),
            "agentSpend": float(row.get("agent_spend_near", 0)),
        }
        for row in data
    ]


def transform_stablecoin_flows(data: list) -> list:
    return [
        {
            "date": row["block_date"] if isinstance(row.get("block_date"), str) else str(row.get("block_date", "")),
            "usdcVolume": float(row.get("usdc_volume", 0)),
            "usdtVolume": float(row.get("usdt_volume", 0)),
            "totalVolume": float(row.get("usdc_volume", 0)) + float(row.get("usdt_volume", 0)),
        }
        for row in data
    ]


def transform_intents_volume(data: list) -> list:
    return [
        {
            "date": row.get("date", ""),
            "volume": float(row.get("volume_usd", row.get("volume", 0))),
            "swapCount": int(row.get("swap_count", row.get("swapCount", 0))),
            "uniqueUsers": int(row.get("unique_users", row.get("uniqueUsers", 0))),
        }
        for row in data
    ]


def main():
    transforms = {
        "network_growth": transform_network_growth,
        "agent_activity": transform_agent_activity,
        "stablecoin_flows": transform_stablecoin_flows,
        "intents_volume": transform_intents_volume,
    }

    for name, transform_fn in transforms.items():
        raw = load_raw(name)
        if raw:
            result = transform_fn(raw)
            out_path = OUT_DIR / f"{name}.json"
            with open(out_path, "w") as f:
                json.dump(result, f, indent=2)
            print(f"  {name}: {len(result)} rows -> {out_path}")
        else:
            print(f"  {name}: no raw data, skipped")

    print("\nDashboard data generated.")


if __name__ == "__main__":
    main()
