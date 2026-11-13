#!/usr/bin/env python3
"""
Fetch NEAR Intents volume data from the Intents Explorer API.

Requires:
  pip install requests
  NEAR_INTENTS_JWT env var with your partner dashboard JWT
"""

import json
import os
import sys
from pathlib import Path

import requests

OUTPUT_DIR = Path(__file__).parent.parent / "data" / "raw"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

API_BASE = "https://explorer-api.near-intents.org"
JWT = os.environ.get("NEAR_INTENTS_JWT", "")


def fetch_intents_volume():
    if not JWT:
        print("Warning: NEAR_INTENTS_JWT not set. Using public endpoint.", file=sys.stderr)

    headers = {}
    if JWT:
        headers["Authorization"] = f"Bearer {JWT}"

    print("Fetching intents volume (180 days)...")
    resp = requests.get(
        f"{API_BASE}/v1/analytics/volume",
        params={"interval": "daily", "days": 180},
        headers=headers,
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()

    output_path = OUTPUT_DIR / "intents_volume.json"
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  -> {output_path} ({len(data)} records)")
    return data


if __name__ == "__main__":
    try:
        fetch_intents_volume()
        print("\nIntents data fetched successfully.")
    except requests.exceptions.RequestException as e:
        print(f"API error: {e}", file=sys.stderr)
        print("Check your NEAR_INTENTS_JWT and network connectivity.", file=sys.stderr)
        sys.exit(1)
