# QUICK GMAIL API SETUP FOR ZION EMAIL RESPONDER V44+
# Follow these steps to activate the live email responder

## 🚀 QUICK SETUP GUIDE (5 MINUTES)

### **Step 1: Get Google Cloud Credentials**
1. Go to: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Create new project: `Zion Tech Group Email Responder V44+`
3. Enable **Gmail API** for this project
4. Go to **APIs & Services → Credentials**
5. Create **OAuth 2.0 Client ID** → Application type: **Desktop application**
6. Download the JSON file (contains your CLIENT_ID and CLIENT_SECRET)

### **Step 2: Generate Refresh Token**
Run this command in your terminal (update the path to your downloaded JSON):

```bash
# Install required packages if needed
pip3 install google-auth-oauthlib google-auth-httplib2

# Generate refresh token (UPDATE THIS PATH)
python3 -c "
import os
from google_auth_oauthlib.flow import InstalledAppFlow

# REPLACE THIS WITH THE ACTUAL PATH TO YOUR DOWNLOADED JSON
CREDENTIALS_FILE = '/path/to/your/downloaded/credentials.json'
TOKEN_FILE = '/tmp/token.json'

if not os.path.exists(CREDENTIALS_FILE):
    print('Error: Please update CREDENTIALS_FILE path to your downloaded JSON')
    exit(1)

SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
creds = flow.run_local_server(port=0)

print('\\n✅ COPY THESE VALUES:')
print(f'GMAIL_CLIENT_ID={creds.client_id}')
print(f'GMAIL_CLIENT_SECRET={creds.client_secret}')
print(f'GMAIL_REFRESH_TOKEN={creds.refresh_token}')
"
```

### **Step 3: Configure .env File**
1. Go to your project root: `/Users/klebergarciaalcatrao/`
2. Edit (or create) `.env` file
3. Add these lines (replace with your actual values from Step 2):
   ```
   GMAIL_CLIENT_ID=your_actual_client_id_here
   GMAIL_CLIENT_SECRET=your_actual_client_secret_here
   GMAIL_REFRESH_TOKEN=your_actual_refresh_token_here
   EMAIL_SERVICE=gmail
   ```
4. Save the file

### **Step 4: Start the Email Responder**
```bash
cd /Users/klebergarciaalcatrao/scripts
python3 email-responder-v44.0.py
```

### **✅ Verification:**
When running successfully, you'll see:
```
[v44] Predictive response system initialized
[v44] Loaded 0 feedback entries for learning
[v44] Checking for new emails...
[v44] Processing email: [subject] from [sender]
[v44] Intent detected: [intent] → Action: [action]
[v44] Reply-all decision: [true/false] (Reason: [policy reason])
```

### **📝 Notes:**
- The responder will process emails autonomously, analyzing each case-by-case
- It will enforce reply-all when appropriate (partnerships/invoices → reply-all enabled)
- It learns from feedback to continuously improve
- Monitor logs: `~/.hermes/logs/email-responder-*.log`

### **🔒 Security:**
- Keep your `.env` file secure (never commit to version control)
- You can revoke access anytime in Google Cloud Console

**You're ready! Follow these steps and the Zion Email Responder V44+ will begin live autonomous operation.**

When you've completed these steps and started the responder, let me know and I'll help you verify it's working or answer any questions.