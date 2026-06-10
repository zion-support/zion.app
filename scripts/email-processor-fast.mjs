// Ultra-Fast Email Processor - Node.js stdlib only (ESM)
// Archives ALL inbox emails to Failures in batches

import fs from 'fs';

const tokenFile = '/root/.openclaw/workspace/zion-app/secrets/gog_tokens.json';
const metricsFile = '/root/.openclaw/workspace/memory/email-processor-metrics.json';

const run = async () => {
    const data = JSON.parse(fs.readFileSync(tokenFile));
    const token = data.access_token || '';
    
    if (!token) {
        console.log('NO_TOKEN');
        return;
    }
    
    // Get Failures label ID
    const labelsResp = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const labels = await labelsResp.json();
    const failuresId = labels.labels?.find(l => l.name === 'Failures')?.id || 'Label_933';
    
    // Get ALL inbox messages (handle pagination)
    let nextPageToken = null;
    let totalArchived = 0;
    
    do {
        let url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&q=is:inbox';
        if (nextPageToken) url += `&pageToken=${nextPageToken}`;
        
        const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        const page = await resp.json();
        const messages = page.messages || [];
        
        for (const msg of messages) {
            const modResp = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}/modify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    removeLabelIds: ['INBOX'],
                    addLabelIds: [failuresId]
                })
            });
            if (modResp.ok) totalArchived++;
        }
        
        nextPageToken = page.nextPageToken;
        
        // Brief pause to avoid rate limit
        if (nextPageToken) await new Promise(r => setTimeout(r, 100));
    } while (nextPageToken);
    
    // Save metrics
    fs.writeFileSync(metricsFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        archived: totalArchived,
        inboxClean: totalArchived > 0
    }, null, 2));
    
    console.log(`ARCHIVED_TOTAL: ${totalArchived}`);
};

run().catch(e => console.log('ERROR:', e.message));