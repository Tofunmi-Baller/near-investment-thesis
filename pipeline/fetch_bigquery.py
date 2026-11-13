#!/usr/bin/env python3
"""
Fetch NEAR onchain metrics from BigQuery public dataset.

Requires:
  pip install google-cloud-bigquery pandas
  GOOGLE_APPLICATION_CREDENTIALS env var pointing to a service account JSON

Cost note: NEAR covers dataset storage. You pay standard BigQuery query costs.
Filtering on block_date keeps scans (and costs) minimal.
"""

import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

from google.cloud import bigquery

OUTPUT_DIR = Path(__file__).parent.parent / "data" / "raw"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

DAYS = 180
END_DATE = datetime.utcnow().strftime("%Y-%m-%d")
START_DATE = (datetime.utcnow() - timedelta(days=DAYS)).strftime("%Y-%m-%d")

QUERIES = {
    "network_growth": f"""
        SELECT
            block_date,
            COUNT(DISTINCT signer_account_id) AS daily_active_accounts,
            COUNT(DISTINCT CASE
                WHEN receipt_predecessor_account_id = 'system'
                THEN receiver_account_id END) AS new_accounts,
            COUNT(DISTINCT CASE
                WHEN action_kind = 'DEPLOY_CONTRACT'
                THEN receiver_account_id END) AS contract_deploys,
            COUNT(*) AS tx_count
        FROM `bigquery-public-data.crypto_near_mainnet_us.receipt_actions`
        WHERE block_date BETWEEN '{START_DATE}' AND '{END_DATE}'
        GROUP BY block_date
        ORDER BY block_date
    """,
    "agent_activity": f"""
        SELECT
            block_date,
            COUNT(*) AS agent_tx_count,
            COUNT(DISTINCT signer_account_id) AS unique_agents,
            SUM(SAFE_CAST(JSON_VALUE(args_json, '$.deposit') AS NUMERIC) / 1e24) AS agent_spend_near
        FROM `bigquery-public-data.crypto_near_mainnet_us.receipt_actions`
        WHERE block_date BETWEEN '{START_DATE}' AND '{END_DATE}'
            AND (signer_account_id LIKE '%.agent.near'
                 OR signer_account_id LIKE '%.agents.near')
        GROUP BY block_date
        ORDER BY block_date
    """,
    "stablecoin_flows": f"""
        SELECT
            block_date,
            SUM(CASE WHEN receiver_account_id IN ('a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near', 'usdc.near', '17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1')
                THEN SAFE_CAST(JSON_VALUE(args_json, '$.amount') AS NUMERIC) / 1e6 ELSE 0 END) AS usdc_volume,
            SUM(CASE WHEN receiver_account_id IN ('dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near', 'usdt.tether-token.near')
                THEN SAFE_CAST(JSON_VALUE(args_json, '$.amount') AS NUMERIC) / 1e6 ELSE 0 END) AS usdt_volume
        FROM `bigquery-public-data.crypto_near_mainnet_us.receipt_actions`
        WHERE block_date BETWEEN '{START_DATE}' AND '{END_DATE}'
            AND action_kind = 'FUNCTION_CALL'
            AND method_name = 'ft_transfer'
        GROUP BY block_date
        ORDER BY block_date
    """,
}


def run_queries():
    client = bigquery.Client()
    for name, query in QUERIES.items():
        print(f"Running query: {name}...")
        df = client.query(query).to_dataframe()
        output_path = OUTPUT_DIR / f"{name}.json"
        records = df.to_dict(orient="records")
        for r in records:
            for k, v in r.items():
                if hasattr(v, "isoformat"):
                    r[k] = v.isoformat()
        with open(output_path, "w") as f:
            json.dump(records, f, indent=2, default=str)
        print(f"  -> {output_path} ({len(records)} rows)")


if __name__ == "__main__":
    try:
        run_queries()
        print("\nAll queries complete. Data written to data/raw/")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        print("Ensure GOOGLE_APPLICATION_CREDENTIALS is set.", file=sys.stderr)
        sys.exit(1)
