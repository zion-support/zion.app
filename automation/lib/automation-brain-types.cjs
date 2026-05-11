const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const TIMELINE_FILE = path.join(REPORTS_DIR, 'automation-timeline.json');

/**
 * @typedef {'audit' | 'implementation' | 'site_improvement' | 'conversion_guard' | 'deployment' | 'other'} AutomationCategory
 */

/**
 * @typedef {'auto_applied' | 'backlog_only' | 'needs_review' | 'skipped' | 'info'} AutomationDecision
 */

/**
 * @typedef {Object} AutomationEvent
 * @property {string} id - Stable identifier (e.g. agent-step-timestamp)
 * @property {string} timestamp - ISO timestamp when the event occurred
 * @property {string} agent - Name of the agent emitting the event
 * @property {AutomationCategory} category - High level category
 * @property {AutomationDecision} decision - What was decided or done
 * @property {string} summary - Short human-readable summary
 * @property {Object} [meta] - Optional extra metadata (commit hash, counts, etc.)
 */

function ensureReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

/**
 * Append a single AutomationEvent to the shared timeline file.
 * The file structure is:
 * {
 *   \"events\": AutomationEvent[]
 * }
 *
 * @param {AutomationEvent} event
 */
function recordAutomationEvent(event) {
  try {
    ensureReportsDir();
    /** @type {{ events?: AutomationEvent[] }} */
    let existing = {};
    if (fs.existsSync(TIMELINE_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(TIMELINE_FILE, 'utf8')) || {};
      } catch {
        existing = {};
      }
    }

    const events = Array.isArray(existing.events) ? existing.events : [];
    events.push(event);

    const payload = {
      updatedAt: new Date().toISOString(),
      events,
    };

    fs.writeFileSync(TIMELINE_FILE, JSON.stringify(payload, null, 2));
  } catch (e) {
    // Failing to record an event must never break the parent agent
     
    console.log(`[AutomationBrain] Failed to record event: ${e.message}`);
  }
}

module.exports = {
  recordAutomationEvent,
};

