# GMAIL API SETUP GUIDE FOR ZION EMAIL RESPONDER V44+
# Step-by-step instructions to activate the live email responder

## 🚀 STEP-BY-STEP GMAIL API SETUP GUIDE

### **Overview:**
The Zion Email Responder V44+ system is built, tested, and ready. It only needs Gmail API configuration to begin live autonomous email processing.

### **📋 STEP-BY-STEP SETUP INSTRUCTIONS:**

#### **Step 1: Create Google Cloud Project & Enable Gmail API**
1. Go to: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Click the project dropdown → **"NEW PROJECT"**
3. Project name: `Zion Tech Group Email Responder V44+`
4. Click **CREATE**
5. With project selected, go to **APIs & Services → Library**
6. Search for **"Gmail API"** and click on it
7. Click **ENABLE**

#### **Step 2: Create OAuth 2.0 Credentials**
1. In Google Cloud Console, go to **APIs & Services → Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted for consent screen:
   - Click **CONFIGURE CONSENT SCREEN**
   - Application type: **External**
   - App name: `Zion Tech Group Email Responder V44+`
   - User support email: `kleber@ziontechgroup.com`
   - Developer contact email: `kleber@ziontechgroup.com`
   - Click **SAVE AND CONTINUE** (skip scopes for now)
   - Click **BACK TO DASHBOARD**
4. Back in Credentials page:
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Application type: **Desktop application**
   - Name: `Zion Email Responder V44+`
   - Click **CREATE**
5. You'll see a dialog with your credentials:
   - **Client ID** (starts with `...apps.googleusercontent.com`)
   - **Client secret**
   - Click **DOWNLOAD JSON** (save this file as `credentials.json` somewhere secure)

#### **Step 3: Generate Refresh Token**
Run this command in your terminal to generate the refresh token:

```bash
# Install required package if needed
pip3 install google-auth-oauthlib google-auth-httplib2

# Run the token generator (replace path with your credentials.json location)
python3 -c "
import os
from google_auth_oauthlib.flow import InstalledAppFlow

# UPDATE THIS PATH TO WHERE YOU SAVED credentials.json
CREDENTIALS_FILE = '/full/path/to/your/credentials.json'
TOKEN_FILE = '/full/path/to/your/token.json'

if not os.path.exists(CREDENTIALS_FILE):
    print('Error: credentials.json not found at:', CREDENTIALS_FILE)
    print('Please update the CREDENTIALS_FILE path in this script')
    exit(1)

SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
creds = flow.run_local_server(port=0)

# Save the credentials for next run
with open(TOKEN_FILE, 'w') as token:
    token.write(creds.to_json())

print('\\n✅ SUCCESS! Your tokens:')
print('CLIENT_ID:', creds.client_id)
print('CLIENT_SECRET:', creds.client_secret)
print('REFRESH_TOKEN:', creds.refresh_token)
print('\\n📝 Add these to your .env file:')
print(f'GMAIL_CLIENT_ID={creds.client_id}')
print(f'GMAIL_CLIENT_SECRET={creds.client_secret}')
print(f'GMAIL_REFRESH_TOKEN={creds.refresh_token}')
"
```

#### **Step 4: Configure .env File**
1. Go to your project root: `/Users/klebergarciaalcatrao/`
2. Edit the `.env` file (create if it doesn't exist)
3. Add these lines:
   ```
   # Gmail API Configuration for Zion Email Responder V44+
   GMAIL_CLIENT_ID=your_actual_client_id_here
   GMAIL_CLIENT_SECRET=your_actual_client_secret_here
   GMAIL_REFRESH_TOKEN=your_actual_refresh_token_here
   EMAIL_SERVICE=gmail
   ```
4. Save the file

#### **Step 5: Start the Email Responder**
```bash
cd /Users/klebergarciaalcatrao/scripts
python3 email-responder-v44.0.py
```

### **📊 What Happens Next:**
- The responder will start processing emails autonomously
- It analyzes each email case-by-case using AI
- Determines appropriate action (including enforcing reply-all when needed)
- Learns from feedback to continuously improve
- Logs activity to: `~/.hermes/logs/email-responder-*.log`

### **✅ Verification:**
When running successfully, you'll see output like:
```
[v44] Predictive response system initialized
[v44] Loaded 0 feedback entries for learning
[v44] Checking for new emails...
[v44] Processing email: [subject] from [sender]
[v44] Intent detected: [intent] → Action: [action]
[v44] Reply-all decision: [true/false] (Reason: [policy reason])
```

### **🎯 Next Steps After Activation:**
1. Monitor the logs to see the responder in action
2. Set up a cronjob for 24/7 email processing (optional)
3. Review the generated insights in the feedback logs
4. Let the system learn and improve over time

### **🔒 Security Notes:**
- Keep your `.env` file secure and never commit it to version control
- The refresh token allows ongoing access to your Gmail account
- You can revoke access anytime in Google Cloud Console
- Consider using a dedicated service account for production use

**Ready when you are! Just follow these steps and the Zion Email Responder V44+ will begin live autonomous operation.**