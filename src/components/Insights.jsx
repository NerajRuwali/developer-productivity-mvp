import React from 'react';

/**
 * Insights Component v2
 *
 * Displays:
 *   1. A summary banner at the top (one-line takeaway)
 *   2. A list of insight cards with severity badges and color coding
 *
 * Props:
 *   summary  - string, the one-line summary from the engine
 *   insights - array of insight objects with severity, problem, reasoning, impact, action
 */

// Maps severity string to a display label
const severityLabel = (level) => {
  if (level === 'critical') return 'CRITICAL';
  if (level === 'warning') return 'WARNING';
  return 'INFO';
};

const Insights = ({ summary, insights }) => {
  return (
    <div className="insights-container">
      <h2>Insights</h2>

      {/* Summary banner -- gives managers a quick one-line read */}
      <div className={`summary-banner summary-${insights[0]?.severity || 'info'}`}>
        <p>{summary}</p>
      </div>

      {/* Insight cards list */}
      <div className="insights-list">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`insight-item severity-${insight.severity}${insight.isPositive ? ' positive' : ''}`}
          >
            <div className="insight-header">
              <span className={`severity-badge badge-${insight.severity}`}>
                {severityLabel(insight.severity)}
              </span>
              <h4>{insight.problem}</h4>
            </div>
            <p><strong>Why:</strong> {insight.reasoning}</p>
            {/* Show contextual note only when the engine provides one */}
            {insight.context && (
              <p className="insight-context">{insight.context}</p>
            )}
            <p><strong>Impact:</strong> {insight.impact}</p>
            <p className="insight-action"><strong>Action:</strong> {insight.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;
