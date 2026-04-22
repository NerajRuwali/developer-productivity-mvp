/**
 * Metrics Calculation Module
 *
 * Takes raw engineering data (issues, PRs, deployments, bugs)
 * and returns a single metrics object with 5 key productivity numbers.
 *
 * Every function handles empty/missing data safely.
 */

// Helper: returns the number of days between two date strings
const daysBetween = (start, end) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(end) - new Date(start)) / msPerDay);
};

/**
 * Cycle Time  --  average days from issue start to issue end.
 * Tells us how long work stays "in progress".
 */
const calculateCycleTime = (issues) => {
  if (!issues || issues.length === 0) return 0;

  const total = issues.reduce((sum, issue) => {
    return sum + daysBetween(issue.startDate, issue.endDate);
  }, 0);

  return Math.round((total / issues.length) * 10) / 10; // one decimal
};

/**
 * Lead Time  --  average days from PR created to PR merged.
 * Tells us how long code waits before reaching production.
 */
const calculateLeadTime = (prs) => {
  if (!prs || prs.length === 0) return 0;

  // Only count PRs that have actually been merged
  const merged = prs.filter((pr) => pr.status === 'merged' && pr.mergedDate);
  if (merged.length === 0) return 0;

  const total = merged.reduce((sum, pr) => {
    return sum + daysBetween(pr.createdDate, pr.mergedDate);
  }, 0);

  return Math.round((total / merged.length) * 10) / 10;
};

/**
 * Bug Rate  --  percentage of bugs relative to total issues.
 * Higher number means worse quality.
 */
const calculateBugRate = (bugs, issues) => {
  if (!issues || issues.length === 0) return 0;
  if (!bugs) return 0;

  return Math.round((bugs.length / issues.length) * 100);
};

/**
 * Deployment Frequency  --  total deployments in the period.
 * Higher is better (shows CI/CD maturity).
 */
const calculateDeploymentFrequency = (deployments) => {
  if (!deployments) return 0;
  return deployments.length;
};

/**
 * PR Throughput  --  number of PRs merged in the period.
 * Shows how much code is flowing through review.
 */
const calculatePRThroughput = (prs) => {
  if (!prs) return 0;
  return prs.filter((pr) => pr.status === 'merged').length;
};

/**
 * Main entry point: calculates all five metrics from raw data.
 * This is the only function App.jsx needs to call.
 */
export const calculateMetrics = (data) => {
  return {
    cycleTime: calculateCycleTime(data.issues),
    leadTime: calculateLeadTime(data.prs),
    bugRate: calculateBugRate(data.bugs, data.issues),
    deploymentFrequency: calculateDeploymentFrequency(data.deployments),
    prThroughput: calculatePRThroughput(data.prs),
  };
};
