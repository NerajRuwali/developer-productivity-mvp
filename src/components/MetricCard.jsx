import React from 'react';

/**
 * MetricCard Component
 * Displays a single metric with a title and value.
 */
const MetricCard = ({ title, value, unit }) => {
  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <div className="metric-value">
        {value} <span className="unit">{unit}</span>
      </div>
    </div>
  );
};

export default MetricCard;
