# Dashboard

React front end for the NEAR economic density thesis. See the [root README](../README.md) for the thesis, data sources, and limitations.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + static build to dist/
```

- `src/data/realData.json` is written by `pipeline/fetch_nearblocks.py` (run `make rebuild` from the repo root).
- `src/data/metrics.ts` derives every displayed number (30-day averages, indices, scorecard) from that file.
- `src/ThemeContext.tsx` holds the light/dark palette shared by all charts.
