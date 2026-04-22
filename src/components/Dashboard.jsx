import React from 'react';
import MetricCard from './MetricCard';

/**
 * Dashboard Component
 * Arranges metric cards in a grid.
 */
const Dashboard = ({ metrics }) => {
  return (
    <div className="dashboard-container">
      <div className="metrics-grid">
        <MetricCard title="Cycle Time" value={metrics.cycleTime} unit="days" />
        <MetricCard title="Lead Time" value={metrics.leadTime} unit="days" />
        <MetricCard title="Bug Rate" value={metrics.bugRate} unit="%" />
        <MetricCard title="Deployments" value={metrics.deploymentFrequency} unit="this week" />
        <MetricCard title="PR Throughput" value={metrics.prThroughput} unit="merged" />
      </div>
    </div>
  );
};

export default Dashboard;
