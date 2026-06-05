const fs = require('fs');
const path = require('path');

const BOT_RESULTS_DIR = path.join(__dirname, '..', '..', '..', 'bot_results');
const MEMORY_DIR = path.join(__dirname, '..', '..', '..', 'memory');

function readFileSafe(p) {
  try {
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf-8');
  } catch {}
  return null;
}

function parseSummary(text) {
  const bots = [];
  let ok = 0;
  let fail = 0;
  if (!text) return { bots, ok, fail };
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z0-9_@]+)\s*\|\s*(.+?)\s*\|\s*(.+)\s*$/);
    if (m) {
      const name = m[1].replace(/^@/, '');
      bots.push({ name, username: name.replace(/_/g, '').toLowerCase(), role: m[2].trim() });
      continue;
    }
    const bare = line.match(/^(OK|FAIL)\s*:\s*([A-Za-z0-9_]+)$/i);
    if (bare) {
      const val = 1;
      if (bare[1].toUpperCase() === 'OK') ok += val; else fail += val;
      bots.push({ name: bare[2], username: bare[2].replace(/_/g, '').toLowerCase(), role: 'deployed' });
      continue;
    }
    const num = line.match(/^(OK|FAIL)\s*=\s*(\d+)/i);
    if (num) {
      const v = parseInt(num[2], 10) || 0;
      if (num[1].toUpperCase() === 'OK') ok = v; else fail = v;
    }
  }
  return { bots, ok, fail };
}

function parseMonitorFiles(files) {
  const agents = new Map();
  const recentActivity = [];
  for (const file of files) {
    const text = readFileSafe(path.join(MEMORY_DIR, file));
    if (!text) continue;
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line) continue;
      const assignMatch = line.match(/^@(?<name>[A-Za-z0-9_]+)\s+→\s+(?<kind>ASSIGN|DONE)\s*←\s*:?\s*(?<desc>.+)$/);
      if (assignMatch) {
        const name = assignMatch.groups.name;
        const username = name.replace(/_/g, '').toLowerCase();
        const kind = assignMatch.groups.kind;
        const desc = assignMatch.groups.desc.trim();
        if (!agents.has(username)) agents.set(username, { name, username, role: '', status: 'unknown', lastSeen: null, taskCount: 0, actions: [] });
        const ag = agents.get(username);
        ag.actions.push({ ts: '', description: `${kind}: ${desc}` });
        ag.taskCount += 1;
        recentActivity.push({ ts: '', agent: name, action: `${kind} — ${desc}` });
        continue;
      }
      const statusMatch = line.match(/^@[A-Za-z0-9_]+\s+→\s+STATUS:\s*(online|offline|unknown)/i);
      if (statusMatch) {
        const s = statusMatch[1].toLowerCase();
        for (const [, ag] of agents) if (ag.status === 'unknown') ag.status = s;
      }
      const dateM = line.match(/(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}(:\d{2})?)/);
      if (dateM) {
        for (const [, ag] of agents) if (!ag.lastSeen || ag.lastSeen < dateM[1]) ag.lastSeen = dateM[1];
      }
    }
  }
  return {
    agents: Array.from(agents.values()).map(a => ({ id: a.username, name: a.name, username: a.username, role: a.role, status: a.status, lastSeen: a.lastSeen, taskCount: a.taskCount, recentActions: a.actions.slice(-10) })),
    recentActivity: recentActivity.slice(0, 100),
  };
}

function listRecentMonitorFiles() {
  try {
    if (!fs.existsSync(MEMORY_DIR)) return [];
    return fs.readdirSync(MEMORY_DIR).filter(f => /^\d{4}-\d{2}-\d{2}-monitor[-_.].*\.md$/i.test(f)).sort((a, b) => (a < b ? 1 : -1));
  } catch { return []; }
}

exports.handler = async () => {
  const summaryText = readFileSafe(path.join(BOT_RESULTS_DIR, 'summary.txt'));
  const { bots: summaryBots, ok, fail } = parseSummary(summaryText);
  const monitorFiles = listRecentMonitorFiles().slice(0, 50);
  const { agents: monitorAgents, recentActivity } = parseMonitorFiles(monitorFiles);

  const roster = summaryBots.length ? summaryBots : [
    { name: 'Neo_kleber_bot', username: 'neokleberbot', role: 'Foreman / Orchestrator' },
    { name: 'Kilo_openclaw_kleber_bot', username: 'kilokleberbot', role: 'Coder / Research' },
    { name: 'Rocket_kleber_bot', username: 'rocketkleberbot', role: 'Integrator' },
    { name: 'Tablet_kleber_bot', username: 'tabletkleberbot', role: 'UX Tester' },
    { name: 'Windows_carol_bot', username: 'windowscarolbot', role: 'Specialist' },
    { name: 'Windows_quel_bot', username: 'windowsquelbot', role: 'Specialist' },
  ];

  const agents = roster.map((b, idx) => {
    const existing = monitorAgents.find(a => a.name.toLowerCase() === b.name.toLowerCase() || a.username === b.username);
    return {
      id: existing?.id || `bot-${idx}`,
      name: existing?.name || b.name,
      username: existing?.username || b.username,
      role: existing?.role || b.role || 'online',
      status: existing?.status || 'online',
      lastSeen: existing?.lastSeen || null,
      taskCount: existing?.taskCount ?? 0,
      recentActions: existing?.recentActions || [],
    };
  });

  const seen = new Set();
  const deduped = [];
  for (const item of recentActivity) {
    const k = `${item.agent}::${item.action}`;
    if (seen.has(k)) continue;
    seen.add(k);
    deduped.unshift(item);
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ generatedAt: new Date().toISOString(), agents, recentActivity: deduped.slice(0, 100), fleet: { online: roster.length, total: roster.length, ok, fail } }),
  };
};
