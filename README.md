# Developer Productivity Dashboard

A React-based dashboard that analyzes engineering team data and generates actionable insights using multi-metric reasoning. Built as an MVP to demonstrate product thinking, data-driven decision making, and clean frontend architecture.

## Features

- **5 Key Metrics** — Cycle Time, Lead Time, Bug Rate, Deployment Frequency, PR Throughput
- **Multi-Metric Insight Engine** — Combines multiple signals to generate meaningful insights instead of simple threshold checks
- **Severity-Based Prioritization** — Insights are classified as CRITICAL, WARNING, or INFO and sorted by urgency
- **Positive Signal Detection** — Highlights what is working well alongside problems for balanced analysis
- **One-Line Summary** — Auto-generated summary with root-cause language for quick decision-making

## Tech Stack

- **Frontend:** React 18 (Vite)
- **Styling:** Vanilla CSS (Lavender theme)
- **Logic:** Pure JavaScript (no external libraries)
- **Data:** Static JSON (swappable with API)

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx      # Metric cards grid
│   ├── MetricCard.jsx      # Individual metric display
│   └── Insights.jsx        # Insight cards with severity badges
├── utils/
│   ├── metrics.js          # Metric calculation logic
│   └── insights.js         # Multi-metric insight engine
├── data/
│   └── devData.json        # Sample engineering data
├── App.jsx                 # Main app - connects data, logic, and UI
├── main.jsx                # React entry point
└── index.css               # Global styles (lavender theme)
```

## Data Flow

```
devData.json → calculateMetrics() → generateInsights() → UI Components
```

1. Raw engineering data (issues, PRs, deployments, bugs) is loaded from JSON
2. `calculateMetrics()` computes 5 productivity metrics from the raw data
3. `generateInsights()` applies multi-metric reasoning rules to produce prioritized insights
4. React components render the metrics and insights on the dashboard

## Metrics Explained

| Metric | What It Measures | Category |
|--------|-----------------|----------|
| Cycle Time | Avg days from issue start to done | Speed |
| Lead Time | Avg days from PR created to merged | Efficiency |
| Bug Rate | Bugs as % of total issues | Quality |
| Deployment Frequency | Number of deployments in period | Delivery |
| PR Throughput | Number of merged PRs | Velocity |

## Insight Engine

The insight engine uses **multi-metric reasoning** instead of simple if-else checks:

| Rule | Metrics Combined | Insight |
|------|-----------------|---------|
| Speed vs Quality | PR Throughput + Bug Rate | Detects when fast merges cause defects |
| Release Bottleneck | Lead Time + Deploy Frequency | Identifies blocked release pipelines |
| Task Overload | Cycle Time (4-7 days) | Flags oversized tickets |
| Dev Bottleneck | Cycle Time + PR Throughput | Spots stuck development work |
| Positive Signal | PR Throughput (high) | Highlights strong delivery momentum |

Each insight includes: **Problem**, **Reasoning**, **Context**, **Impact**, and **Action**.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/NerajRuwali/developer-productivity-mvp.git
cd developer-productivity-mvp
npm install
npm run dev
```

The app will start at `http://localhost:5173/`

## How to Swap Data

Replace the static JSON import in `App.jsx` with an API call:

```javascript
// Current (static)
import devData from './data/devData.json';

// Future (API)
const [devData, setDevData] = useState(null);
useEffect(() => {
  fetch('/api/sprint-data')
    .then(res => res.json())
    .then(data => setDevData(data));
}, []);
```

The metrics and insights logic remains unchanged.

## Design Decisions

| Decision | Reasoning |
|----------|-----------|
| Static JSON over API | Keeps MVP simple and self-contained |
| No state management library | Data flow is simple enough for props |
| Multi-metric rules over ML | Transparent, debuggable, and interview-explainable |
| Top 4 insight cap | Prevents dashboard overload, forces prioritization |
| Positive signals included | Balanced analysis builds trust in the tool |

## Future Improvements

- Trend detection across multiple sprints
- Configurable thresholds per team
- LLM-powered natural language summaries
- API integration with GitHub/Jira
- Team comparison view

## Author

**Neeraj Ruwali**

## License

This project is open source and available under the [MIT License](LICENSE).
