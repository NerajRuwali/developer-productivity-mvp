import React from 'react';
import Dashboard from './components/Dashboard';
import Insights from './components/Insights';
import { calculateMetrics } from './utils/metrics';
import { generateInsights } from './utils/insights';

// Step 1: Import real data from the JSON file.
// To swap data sources later, replace this import with a fetch() call or API.
import devData from './data/devData.json';

/**
 * App Component
 *
 * This is the central hub of the application.
 * Data flows in one direction:  JSON -> metrics -> insights -> UI
 *
 * No useState or useEffect needed here because the data is static JSON.
 * When you move to an API later, wrap these in a useEffect.
 */
function App() {
  // Step 2: Calculate all five metrics from the raw data.
  const metrics = calculateMetrics(devData);

  // Step 3: Generate prioritized insights based on the calculated metrics.
  // The engine returns { summary, insights } where summary is a one-line takeaway.
  const { summary, insights } = generateInsights(metrics);

  return (
    <div className="app-main">
      <header>
        <h1>Developer Productivity Dashboard</h1>
        <p className="subtitle">Sprint performance overview</p>
      </header>

      <main>
        <Dashboard metrics={metrics} />
        <Insights summary={summary} insights={insights} />
      </main>
    </div>
  );
}

export default App;
