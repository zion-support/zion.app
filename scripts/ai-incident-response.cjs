const { Octokit } = require("@octokit/rest");
const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  const token = core.getInput("token", { required: true });
  const octokit = new Octokit({ auth: token });
  const context = github.context;
  const issue = context.payload.issue;
  if (!issue) return;
  if (issue.labels.some(l => l.name === "incident")) {
    await octokit.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      body: `⚠️ Thank you for reporting the incident. Our AI Incident Response Bot will review and handle it.`
    });
  }
}

run().catch(err => core.setFailed(err.message));
