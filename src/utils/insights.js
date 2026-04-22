/**
 * Insight Engine v4 - Micro-polish
 *
 * Changes from v3:
 *   - Titles now include the metric value for immediate clarity
 *   - Wording is confident (no "usually", "may", or "suggests")
 *   - Added one positive signal to show balanced analysis
 *   - Cap raised to 4 insights to fit positive signal alongside problems
 */

// Severity weight used for sorting (lower number = more urgent)
const SEVERITY_WEIGHT = { critical: 1, warning: 2, info: 3 };

/**
 * Builds a precise one-line summary based on the most severe insight.
 * Mentions root cause, not just the symptom.
 */
const buildSummary = (insights) => {
  if (insights.length === 0) {
    return 'Your development pipeline looks healthy with no major bottlenecks.';
  }

  const top = insights[0];

  // Specific summaries tied to known problem titles
  const summaryMap = {
    critical: {
      'High Bug Rate With Fast Merges':
        'High defect risk due to fast merges and insufficient review depth.',
      'Slow Release Pipeline':
        'Completed code is stuck in the pipeline due to manual release gates.',
    },
    warning: {
      'Cycle Time Elevated':
        'Sprint velocity at risk due to oversized tickets or unclear requirements.',
      'Development Bottleneck':
        'Low output detected. Work is blocked during the development phase.',
    },
  };

  // Match the title up to the first " (" to handle metric-annotated titles
  const baseTitle = top.problem.split(' (')[0];
  const specificSummary = summaryMap[top.severity]?.[baseTitle];

  if (specificSummary) {
    return specificSummary;
  }

  // Fallback summaries by severity
  if (top.severity === 'critical') {
    return 'Critical issue detected: ' + top.problem + '. Needs immediate attention.';
  }
  if (top.severity === 'warning') {
    return 'Potential slowdown: ' + top.problem + '. Worth reviewing this sprint.';
  }
  return 'Pipeline is stable. No urgent action needed.';
};

/**
 * Main entry point. Called by App.jsx.
 * Input:  metrics object with cycleTime, leadTime, bugRate, deploymentFrequency, prThroughput
 * Output: { summary: string, insights: array }
 */
export const generateInsights = (metrics) => {
  const insights = [];

  // ── CRITICAL RULES ─────────────────────────────────────────

  // Rule 1: Speed over Quality (multi-metric)
  // High PR count + high bugs = shallow reviews and weak test coverage.
  if (metrics.prThroughput > 4 && metrics.bugRate > 25) {
    insights.push({
      severity: 'critical',
      problem: 'High Bug Rate With Fast Merges (' + metrics.bugRate + '% defects)',
      reasoning:
        metrics.prThroughput +
        ' PRs merged with a ' +
        metrics.bugRate +
        '% bug rate. This indicates rushed reviews or weak test coverage.',
      impact:
        'Technical debt grows fast. The next sprint will lose velocity to rework and hotfixes.',
      context:
        'This pattern often appears during high-pressure sprints when teams cut corners to ship faster.',
      action:
        'Require at least one approval per PR. Add a pre-merge checklist covering tests, edge cases, and error handling.',
    });
  }

  // Rule 2: Slow Release Pipeline (multi-metric)
  // Code is done but not reaching users. This is a process bottleneck.
  if (metrics.leadTime > 3 && metrics.deploymentFrequency < 3) {
    insights.push({
      severity: 'critical',
      problem: 'Slow Release Pipeline (' + metrics.deploymentFrequency + ' deploys)',
      reasoning:
        'Lead time averages ' +
        metrics.leadTime +
        ' days with only ' +
        metrics.deploymentFrequency +
        ' deployments. Finished code is sitting idle instead of reaching users.',
      impact:
        'Delayed user feedback, stale branches, and growing merge conflict risk.',
      context:
        'Common in teams without a dedicated DevOps process or those relying on manual deployment steps.',
      action:
        'Automate the staging deployment step. Target at least one production release per week.',
    });
  }

  // ── WARNING RULES ──────────────────────────────────────────

  // Rule 3: Elevated cycle time (single-metric)
  // 4-7 days is a yellow flag. Tickets are either too large or blocked.
  if (metrics.cycleTime >= 4 && metrics.cycleTime <= 7) {
    insights.push({
      severity: 'warning',
      problem: 'Cycle Time Elevated (' + metrics.cycleTime + ' days)',
      reasoning:
        'Average cycle time is ' +
        metrics.cycleTime +
        ' days. Healthy sprints see 2-3 day cycles. This indicates tickets are too large or have hidden blockers.',
      impact:
        'Sprint commitments become unreliable and planning accuracy drops.',
      context:
        'Often caused by unclear acceptance criteria, scope creep mid-ticket, or waiting on dependencies from other teams.',
      action:
        'Break tickets into sub-tasks of 1-2 days. Flag any ticket open for more than 3 days in standup.',
    });
  }

  // Rule 4: Development bottleneck (multi-metric)
  // High cycle time + low PR throughput = work is stuck in dev.
  if (metrics.cycleTime > 5 && metrics.prThroughput < 4) {
    insights.push({
      severity: 'warning',
      problem: 'Development Bottleneck (' + metrics.prThroughput + ' PRs merged)',
      reasoning:
        'Cycle time is ' +
        metrics.cycleTime +
        ' days with only ' +
        metrics.prThroughput +
        ' PRs merged. Very little code is making it through the pipeline.',
      impact:
        'Work-in-progress piles up, making sprint reviews thin and goals harder to hit.',
      context: null,
      action:
        'Pair-program on blocked items. Consider WIP limits to force focus on finishing over starting.',
    });
  }

  // ── INFO RULES ─────────────────────────────────────────────

  // Rule 5: Low deployment frequency (standalone observation)
  if (metrics.deploymentFrequency <= 2) {
    insights.push({
      severity: 'info',
      problem: 'Low Deployment Frequency (' + metrics.deploymentFrequency + ' this period)',
      reasoning:
        'Only ' +
        metrics.deploymentFrequency +
        ' deployments this period. Modern teams target daily or bi-daily releases.',
      impact:
        'Large batch releases carry more risk and make it harder to isolate failures.',
      context: null,
      action:
        'Move toward smaller, more frequent releases. Even 1 extra deploy per week reduces batch risk.',
    });
  }

  // Rule 6: Positive signal - Strong PR throughput
  // Balanced dashboards show what is working well, not just problems.
  // This helps teams maintain morale and recognize good patterns.
  if (metrics.prThroughput >= 5) {
    insights.push({
      severity: 'info',
      isPositive: true,
      problem: 'Strong PR Activity (' + metrics.prThroughput + ' merged)',
      reasoning:
        metrics.prThroughput +
        ' PRs merged this period. This confirms the team is maintaining strong delivery momentum.',
      impact:
        'Consistent PR flow keeps the codebase evolving and reduces long-lived branch risk.',
      context: null,
      action:
        'Maintain this pace while improving quality checks to ensure throughput does not come at the cost of stability.',
    });
  }

  // ── EDGE CASE: Everything is healthy ───────────────────────
  if (insights.length === 0) {
    return {
      summary: 'Your development pipeline looks healthy with no major bottlenecks.',
      insights: [
        {
          severity: 'info',
          isPositive: true,
          problem: 'Healthy Pipeline',
          reasoning:
            'All metrics are within acceptable ranges. The team is delivering steadily with good quality.',
          impact: 'Current workflow is sustainable. No immediate risks detected.',
          context: null,
          action:
            'Continue monitoring. Consider setting stretch goals for cycle time or deploy frequency.',
        },
      ],
    };
  }

  // Sort by severity: critical first, then warning, then info
  insights.sort(
    (a, b) => SEVERITY_WEIGHT[a.severity] - SEVERITY_WEIGHT[b.severity]
  );

  // Cap at 4 insights (allows room for problems + one positive signal)
  const topInsights = insights.slice(0, 4);
  const summary = buildSummary(topInsights);

  return { summary, insights: topInsights };
};
