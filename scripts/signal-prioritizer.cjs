// Signal Prioritizer - Sorts leads by opportunity score
// Free implementation (no dependencies)

const fs = require('fs');
const signalsDir = '/root/.openclaw/workspace/memory/client-signals';

function prioritize() {
    const files = fs.readdirSync(signalsDir).filter(f => f.startsWith('scan-'));
    let priorities = [];
    
    for (const file of files.slice(-3)) {
        const data = JSON.parse(fs.readFileSync(`${signalsDir}/${file}`));
        for (const lead of data.leads || []) {
            let score = 0;
            if (lead.query === 'partnership') score += 10;
            if (lead.query === 'voice agent') score += 8;
            if (lead.query === 'collaboration') score += 7;
            priorities.push({ ...lead, score });
        }
    }
    
    return priorities.sort((a, b) => b.score - a.score);
}

module.exports = { prioritize };