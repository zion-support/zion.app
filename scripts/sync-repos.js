// sync-repos.js
// Cross‑repo issue synchronizer (source → target)
// Requires:
//   GITHUB_TOKEN   - token with repo scope
//   SOURCE_OWNER   - owner of source repo
//   SOURCE_REPO    - name of source repo
//   TARGET_OWNER   - owner of target repo
//   TARGET_REPO    - name of target repo
//   SYNC_LABEL     - optional label to add on synced items (default: "cross-repo-sync")
//   DRY_RUN        - if set to "true", only logs actions without making changes

const { Octokit } = require("@octokit/rest");

// Configuration from environment
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("Error: GITHUB_TOKEN environment variable is required");
  process.exit(1);
}

const octokit = new Octokit({ auth: token });

const source = {
  owner: process.env.SOURCE_OWNER,
  repo: process.env.SOURCE_REPO
};
const target = {
  owner: process.env.TARGET_OWNER,
  repo: process.env.TARGET_REPO
};

const syncLabel = process.env.SYNC_LABEL || "cross-repo-sync";
const dryRun = process.env.DRY_RUN === "true";

if (!source.owner || !source.repo || !target.owner || !target.repo) {
  console.error("Error: SOURCE_OWNER, SOURCE_REPO, TARGET_OWNER, TARGET_REPO are required");
  process.exit(1);
}

console.log(`Starting sync: ${source.owner}/${source.repo} → ${target.owner}/${target.repo}`);
if (dryRun) console.log("DRY RUN MODE - no changes will be made");

// Helper to log actions
const logAction = (action, details) => {
  const prefix = dryRun ? "[DRY RUN] " : "";
  console.log(`${prefix}${action}: ${details}`);
};

// Fetch all open issues from source (with pagination)
async function fetchSourceIssues() {
  const issues = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await octokit.issues.listForRepo({
      ...source,
      state: "open",
      per_page: perPage,
      page,
    });

    issues.push(...response.data);
    if (response.data.length < perPage) break;
    page++;
  }

  return issues;
}

// Fetch all issues from target (open and closed) to check for existing
async function fetchTargetIssues() {
  const issues = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await octokit.issues.listForRepo({
      ...target,
      state: "all",
      per_page: perPage,
      page,
    });

    issues.push(...response.data);
    if (response.data.length < perPage) break;
    page++;
  }

  return issues;
}

// Create or update an issue in target
async function syncIssue(sourceIssue, targetIssuesMap) {
  const { title, body, labels, state } = sourceIssue;

  // Check if issue already exists in target by title (simple approach)
  // Better would be to use a custom identifier in body, but title is ok for demo
  const existing = targetIssuesMap.get(title);

  if (existing) {
    logAction("Issue already exists in target", `${title} (${existing.html_url})`);
    // Optionally sync state or labels here
    return;
  }

  // Prepare issue data for target
  const issueData = {
    title,
    body: body || "",
    labels: [...(labels || []).map(l => l.name), syncLabel].filter(Boolean), // ensure syncLabel is included
    state,
  };

  if (dryRun) {
    logAction("Would create issue in target", `${title}`);
    return;
  }

  try {
    const response = await octokit.issues.create({
      ...target,
      ...issueData,
    });
    logAction("Created issue in target", `${response.data.title} (${response.data.html_url})`);
  } catch (error) {
    console.error(`Failed to create issue "${title}":`, error.message);
    // Continue with other issues
  }
}

// Main sync function
async function runSync() {
  try {
    console.log("Fetching source issues...");
    const sourceIssues = await fetchSourceIssues();
    logAction("Fetched source issues", `${sourceIssues.length} open issues`);

    console.log("Fetching target issues...");
    const targetIssues = await fetchTargetIssues();
    const targetIssuesMap = new Map();
    targetIssues.forEach(issue => {
      targetIssuesMap.set(issue.title, issue); // Simple map by title
    });
    logAction("Fetched target issues", `${targetIssues.length} total issues`);

    // Process each source issue
    for (const issue of sourceIssues) {
      await syncIssue(issue, targetIssuesMap);
    }

    logAction("Sync completed", "All source issues processed");
  } catch (error) {
    console.error("Sync failed:", error.message);
    process.exit(1);
  }
}

runSync();
