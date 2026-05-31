# 🔑 API Keys Organization & Management
## Zion Tech Group - All Agents Access

**Last Updated:** 2026-05-30
**Managed By:** Kleber Garcia Alcatrão
**Contact:** kleber@ziontechgroup.com | +1 302 464 0950

---

## 📋 API Keys Status

| Provider | Status | Location | Expiry | Notes |
|----------|--------|----------|--------|-------|
| OpenAI | ✅ Active | .env.local | Check dashboard | GPT-4, GPT-3.5 |
| Google Gemini | ✅ Active | .env.local | Check dashboard | Gemini Pro, Ultra |
| GitHub | ✅ Active | Credential helper | PAT-based | Push works, API needs refresh |
| Hunter.io | ⏳ Verify | .env.local | Check dashboard | Email enrichment |
| Apollo.io | ⏳ Verify | .env.local | Check dashboard | Sales intelligence |
| LinkedIn | ⏳ Verify | .env.local | Check dashboard | Social integration |
| Twitter/X | ⏳ Verify | .env.local | Check dashboard | Social posting |
| Hugging Face | ✅ Active | .env.local | Free tier | ML models |
| OpenRouter | ✅ Active | .env.local | Check balance | Multi-model access |
| Cursor | ✅ Active | Local config | Subscription | AI coding |
| Clawfy | ⏳ Verify | .env.local | Check dashboard | Custom AI |
| Gateway | ✅ Active | .env.local | Internal | Hermes gateway |

---

## 🔒 Security Guidelines

1. **NEVER commit API keys to git** - Always use `.env.local`
2. **Rotate keys quarterly** - Set calendar reminders
3. **Use environment variables** - Never hardcode in source
4. **Monitor usage** - Check dashboards weekly
5. **Share securely** - Use encrypted channels only

---

## 📁 File Locations

```
C:\Users\Zion\tmp\zion-clone-test\
├── .env.local                    # Primary API keys (NOT in git)
├── .gitignore                    # Ensures .env.local is excluded
└── docs/
    └── API_KEYS_ORGANIZATION.md  # This document
```

---

## 🤖 Agent Access Instructions

### For All Bots (@windows_carol_bot, @Kilo_openclaw_kleber_bot, @tablet_kleber_bot, @Neo_kleber_bot, @Rocket_Kleber_bot):

1. **Read from .env.local** - All keys are stored there
2. **Never expose keys** - Don't print or log API keys
3. **Report issues** - If a key is expired/invalid, notify Kleber
4. **Use rate limits** - Respect API rate limits to avoid blocks

### Adding New API Keys:

```bash
# Add to .env.local
echo "NEW_API_KEY=your_key_here" >> .env.local

# Verify it's in .gitignore
grep ".env.local" .gitignore

# Test the key
# (depends on the service)
```

---

## 🔄 Key Rotation Schedule

| Quarter | Keys to Rotate | Responsible |
|---------|---------------|-------------|
| Q1 2026 | OpenAI, GitHub | @Neo_kleber_bot |
| Q2 2026 | Google, Hunter | @Kilo_openclaw_kleber_bot |
| Q3 2026 | Apollo, LinkedIn | @tablet_kleber_bot |
| Q4 2026 | Twitter, OpenRouter | @windows_carol_bot |

---

## 🚨 Emergency Contacts

If any API key is compromised:
1. **Immediately revoke** the key at the provider dashboard
2. **Generate new key** and update `.env.local`
3. **Notify Kleber**: +1 302 464 0950
4. **Audit logs** for any unauthorized usage

---

## 📊 Usage Monitoring

Check these dashboards weekly:
- OpenAI: https://platform.openai.com/usage
- Google: https://console.cloud.google.com/apis/dashboard
- GitHub: https://github.com/settings/tokens
- OpenRouter: https://openrouter.ai/activity

---

**Document maintained by Hermes Agent for Zion Tech Group**
**Questions? Contact: kleber@ziontechgroup.com**
