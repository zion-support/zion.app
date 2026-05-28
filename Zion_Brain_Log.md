- [2026-02-24 06:45] Updated crontab with Content Repurposing jobs for daily LinkedIn/Twitter/Instagram at 8/10/11 AM.
- [2026-02-24 06:44] Created zion_content_agent.py – GPT‑4 powered content transformation from Markdown → social media posts.
- [2026-02-24 06:40] Verified dependencies: sendgrid, pandas, scikit-learn now installed.
- [2026-02-23 22:24] Workflow templates added.
- [2026-02-23 22:20] Created memory files for last 2 days.
- [2026-02-23 22:18] SentGrid API key configured; test email sent.
- [2026-02-23 22:10] OpenAI API key configured.
- [2026-02-23 22:05] Telegram token stored in .env.
- [2026-02-23 21:55] OpenClaw gateway restarted on port 18792.
- [2026-02-23 21:50] Selenium fallback agent tested (smoke test passed).
- [2026-02-24 10:53:51] === ML Pipeline: Starting training run ===
- [2026-02-24 10:53:51] Loaded 20 lead records from leads.csv
- [2026-02-24 10:53:51] Preprocessed data: 20 samples, 4 features
- [2026-02-24 10:53:51] GradientBoosting model trained.
- [2026-02-24 10:53:51] Model accuracy: 1.000
- [2026-02-24 10:53:51] Model saved to /Users/kleberalcatrao/.openclaw/workspace/models/conversion_model.pkl
- [2026-02-24 10:53:51] === ML Pipeline: Training completed ===
- [2026-02-24 10:53:51] Test accuracy: 1.000
- [2026-02-24 10:55:29] Model loaded from /Users/kleberalcatrao/.openclaw/workspace/models/conversion_model.pkl
- [2026-02-24 10:55:29] Test prediction: {'time_on_site': 120, 'pages_visited': 5, 'email_opened': 1, 'clicked_cta': 1} -> {'probability': 0.9999780982686993, 'prediction': 1}
- [2026-02-24 11:39:30] DB Init: === DB Init started ===
- [2026-02-24 11:39:30] DB Init: Failed to connect to DB: connection to server at "localhost" (::1), port 5432 failed: FATAL:  password authentication failed for user "zion_user"

- [2026-02-24 11:39:30] DB Init: === DB Init failed: connection to server at "localhost" (::1), port 5432 failed: FATAL:  password authentication failed for user "zion_user"
 ===
- [2026-02-24 11:44:24] DB Init: === DB Init started ===
- [2026-02-24 11:44:24] DB Init: Failed to connect to DB: connection to server at "localhost" (::1), port 5432 failed: FATAL:  password authentication failed for user "zion_user"

- [2026-02-24 11:44:24] DB Init: === DB Init failed: connection to server at "localhost" (::1), port 5432 failed: FATAL:  password authentication failed for user "zion_user"
 ===
- [2026-02-24 11:52:05] DB Init: === DB Init started ===
- [2026-02-24 11:52:05] DB Init: Failed to connect to DB: connection to server at "localhost" (::1), port 5432 failed: FATAL:  password authentication failed for user "zion_user"

- [2026-02-24 11:52:05] DB Init: === DB Init failed: connection to server at "localhost" (::1), port 5432 failed: FATAL:  password authentication failed for user "zion_user"
 ===
- [2026-02-26 08:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 08:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 08:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 08:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 08:35:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 02:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 02:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 02:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 02:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 02:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 02:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 02:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 02:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 02:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 02:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 02:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 02:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 02:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 02:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 02:50:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 02:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 03:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 03:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 03:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 03:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 03:00:03] Onboarding: === Customer Onboarding started ===
- [2026-02-25 03:00:03] DesignSystem: === AI Design System generation started ===
- [2026-02-25 03:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 03:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 03:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 03:05:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 03:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 03:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 03:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 03:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 03:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 03:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 03:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 03:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 03:20:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 03:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 03:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 03:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 03:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 03:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 03:35:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 03:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 03:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 03:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 03:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 03:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 03:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 03:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 03:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 03:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 03:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 04:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 04:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 04:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 04:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 04:00:01] DesignSystem: === AI Design System generation started ===
- [2026-02-25 04:00:01] Onboarding: === Customer Onboarding started ===
- [2026-02-25 04:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 04:00:01] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 04:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 04:05:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 04:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 04:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 04:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 04:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 04:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 04:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 04:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 04:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 04:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 04:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 04:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 04:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 04:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 04:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 04:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 04:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 04:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 04:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 04:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 04:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 04:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 04:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 04:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 04:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 04:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 05:00:00] SecurityPatch: === Security Patch Automation started ===
- [2026-02-25 05:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 05:00:00] SecurityPatch: Running: brew upgrade
- [2026-02-25 05:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 05:00:00] SecurityPatch: Unexpected error: [Errno 2] No such file or directory: 'brew'
- [2026-02-25 05:00:00] SecurityPatch: === Security Patch Automation finished ===
- [2026-02-25 05:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 05:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 05:00:02] SalesPlaybooks: === Sales Playbooks Agent started ===
- [2026-02-25 05:00:02] SalesPlaybooks: Unhandled exception in SalesPlaybooksAgent: relation "deals" does not exist
LINE 10:         FROM deals d
                      ^

- [2026-02-25 05:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-25 05:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-25 05:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 05:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 05:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 05:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 05:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 05:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 05:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 05:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 05:15:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 05:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 05:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 05:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 05:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 05:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 05:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 05:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 05:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 05:30:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 05:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 05:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 05:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 05:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 05:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 05:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 05:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 05:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 05:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 05:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 05:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 06:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 06:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 06:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 06:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 06:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 06:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 06:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-25 06:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-25 06:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 06:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 06:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 06:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 06:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 06:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 06:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 06:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 06:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 06:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 06:15:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 06:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 06:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 06:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 06:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 06:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 06:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 06:25:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 06:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 06:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 06:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 06:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 06:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 06:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 06:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 06:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 06:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 06:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 06:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 06:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 06:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 06:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 06:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 06:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 06:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 06:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 06:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 06:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 06:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 07:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 07:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 07:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 07:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 07:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 07:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 07:00:01] Onboarding: === Customer Onboarding started ===
- [2026-02-25 07:00:01] DesignSystem: === AI Design System generation started ===
- [2026-02-25 07:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 07:00:01] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 07:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 07:00:16] ChurnPredict: === Predictive Churn Modeling started ===
- [2026-02-25 07:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 07:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 07:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 07:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 07:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 07:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 07:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 07:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 07:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 07:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 07:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 07:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 07:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 07:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 07:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 07:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 07:30:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 07:30:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 07:30:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 07:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 07:30:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 07:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 07:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 07:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 07:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 07:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 07:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 07:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 07:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 07:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 07:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 07:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 07:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 07:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 07:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 07:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 08:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 08:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 08:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 08:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 08:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 08:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 08:00:01] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-02-25 08:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-25 08:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-25 08:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 08:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 08:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 08:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 08:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 08:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 08:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 08:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 08:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 08:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 08:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 08:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 08:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 08:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 08:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 08:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 08:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 08:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 08:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 08:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 08:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 08:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 08:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 08:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 08:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 08:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 08:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 08:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 08:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 08:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 08:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 08:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 08:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 08:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 08:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 08:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 08:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 08:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 08:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 09:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 09:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 09:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 09:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 09:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 09:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 09:00:01] Onboarding: === Customer Onboarding started ===
- [2026-02-25 09:00:01] DesignSystem: === AI Design System generation started ===
- [2026-02-25 09:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 09:00:01] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 09:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 09:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 09:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 09:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 09:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 09:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 09:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 09:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 09:15:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 09:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 09:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 09:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-02-25 09:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-02-25 09:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-02-25 09:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 09:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 09:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 09:30:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 09:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 09:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 09:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 09:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 09:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 09:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 09:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 09:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 09:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 09:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 09:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 09:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 09:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 10:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 10:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 10:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 10:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 10:00:01] Onboarding: === Customer Onboarding started ===
- [2026-02-25 10:00:01] DesignSystem: === AI Design System generation started ===
- [2026-02-25 10:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 10:00:01] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 10:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 10:05:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 10:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 10:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 10:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 10:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 10:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 10:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 10:20:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 10:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 10:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 10:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 10:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 10:30:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 10:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 10:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 10:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 10:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 10:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 10:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 10:40:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 10:45:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 10:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 10:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 10:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 10:50:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 10:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 11:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 11:00:02] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 11:00:02] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 11:00:02] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 11:00:07] Onboarding: === Customer Onboarding started ===
- [2026-02-25 11:00:07] Feedback: === Customer Feedback Collection started ===
- [2026-02-25 11:00:07] DesignSystem: === AI Design System generation started ===
- [2026-02-25 11:00:07] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 11:00:07] Feedback: Feedback collection failed: relation "purchases" does not exist
LINE 3:         FROM purchases
                     ^

- [2026-02-25 11:00:07] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 11:00:07] Feedback: === Customer Feedback Collection finished ===
- [2026-02-25 11:00:07] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 11:05:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 11:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 11:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 11:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 11:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 11:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 11:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 11:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 11:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 11:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 11:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 11:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 11:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 11:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 11:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 11:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 11:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 11:40:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 11:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 11:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 11:45:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 11:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 11:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 11:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 11:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 11:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 12:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 12:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 12:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 12:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 12:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-25 12:00:02] Churn: === Churn Prevention started ===
- [2026-02-25 12:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-25 12:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 12:00:02] Churn: Churn prevention failed: relation "customers" does not exist
LINE 3:         FROM customers
                     ^

- [2026-02-25 12:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 12:00:02] Churn: === Churn Prevention finished ===
- [2026-02-25 12:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 12:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 12:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 12:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 12:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 12:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 12:15:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 12:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 12:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 12:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 12:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 12:25:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 12:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 12:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 12:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 12:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 12:35:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 12:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 12:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 12:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 12:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 12:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 12:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 12:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 12:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 12:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 12:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 13:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 13:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 13:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 13:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 13:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-25 13:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-25 13:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 13:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 13:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 13:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 13:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 13:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 13:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 13:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 13:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 13:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 13:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 13:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 13:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 13:25:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 13:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 13:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 13:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 13:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 13:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 13:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 13:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 13:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 13:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 13:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 13:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 13:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 13:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 13:50:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 13:55:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 14:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 14:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 14:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 14:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 14:00:01] DesignSystem: === AI Design System generation started ===
- [2026-02-25 14:00:01] Onboarding: === Customer Onboarding started ===
- [2026-02-25 14:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 14:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 14:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 14:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 14:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 14:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 14:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 14:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 14:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 14:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 14:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 14:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 14:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 14:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 14:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 14:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 14:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 14:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 14:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 14:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 14:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 14:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 14:40:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 14:45:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 14:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 14:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 14:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 14:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 14:55:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 15:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 15:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 15:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 15:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 15:00:01] Onboarding: === Customer Onboarding started ===
- [2026-02-25 15:00:01] DesignSystem: === AI Design System generation started ===
- [2026-02-25 15:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 15:00:01] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 15:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 15:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 15:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 15:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 15:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 15:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 15:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 15:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 15:20:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 15:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 15:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 15:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 15:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 15:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 15:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 15:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 15:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 15:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 15:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 15:40:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 15:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 15:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 15:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 15:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 15:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 15:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 15:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 16:00:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 16:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 16:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 16:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 16:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-25 16:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-25 16:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 16:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 16:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 16:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 16:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 16:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 16:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 16:10:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 16:15:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 16:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 16:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 16:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 16:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 16:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 16:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 16:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 16:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 16:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 16:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 16:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 16:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 16:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 16:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 16:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 16:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 16:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 16:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 16:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 16:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 17:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 17:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 17:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 17:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 17:00:01] Onboarding: === Customer Onboarding started ===
- [2026-02-25 17:00:01] DesignSystem: === AI Design System generation started ===
- [2026-02-25 17:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 17:00:01] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 17:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 17:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 17:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 17:10:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 17:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 17:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 17:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 17:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 17:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 17:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 17:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 17:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 17:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 17:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 17:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 17:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 17:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 17:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 17:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 17:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 17:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 17:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 17:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 17:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 17:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 17:50:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 17:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 18:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 18:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 18:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 18:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 18:00:01] Onboarding: === Customer Onboarding started ===
- [2026-02-25 18:00:01] DesignSystem: === AI Design System generation started ===
- [2026-02-25 18:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 18:00:01] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 18:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 18:05:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 18:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 18:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 18:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 18:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 18:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 18:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 18:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 18:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 18:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 18:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 18:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 18:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 18:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 18:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 18:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 18:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 18:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 18:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 18:40:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 18:45:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 18:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 18:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 18:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 18:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 18:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 19:00:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 19:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 19:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 19:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 19:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-25 19:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-25 19:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 19:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 19:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 19:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 19:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 19:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 19:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 19:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 20:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 20:10:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 20:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 20:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 20:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 20:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 20:20:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 20:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 20:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 20:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 20:30:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 20:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 20:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 20:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 20:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 20:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 20:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 20:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 20:40:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 20:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 20:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 20:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 20:50:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 20:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 20:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 21:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 21:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 21:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 21:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 21:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-25 21:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-25 21:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 21:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 21:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 21:05:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 21:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 21:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 21:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 21:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 21:15:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 21:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 21:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 21:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 21:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 21:25:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 21:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 21:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 21:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 21:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 21:35:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 21:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 21:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 21:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 21:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 21:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 21:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 21:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 21:50:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 21:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 21:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 22:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 22:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 22:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 22:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 22:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-25 22:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-25 22:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 22:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 22:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 22:05:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 22:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 22:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 22:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 22:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 22:15:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 22:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 22:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 22:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 22:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 22:25:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 22:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 22:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 22:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 22:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 22:35:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 22:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 22:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 22:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 22:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 22:45:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 22:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 22:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 22:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 22:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 22:55:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 23:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 23:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 23:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 23:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 23:00:01] DesignSystem: === AI Design System generation started ===
- [2026-02-25 23:00:01] Onboarding: === Customer Onboarding started ===
- [2026-02-25 23:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-02-25 23:00:01] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-25 23:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-02-25 23:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 23:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 23:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 23:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 23:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 23:15:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 23:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 23:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 23:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 23:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 23:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 23:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 23:30:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 23:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 23:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 23:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 23:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 23:40:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 23:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 23:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 23:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 23:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-25 23:50:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-25 23:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-25 23:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-25 23:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 00:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 00:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 00:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 00:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 00:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-26 00:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-26 00:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-26 00:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-26 00:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-26 00:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 00:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 00:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 00:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 00:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 00:15:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 00:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 00:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 00:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 00:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 00:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 00:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 00:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 00:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 00:30:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 00:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 00:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 00:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 00:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 00:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 00:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 00:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 00:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 00:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 00:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 00:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 01:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 01:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 01:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 01:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 01:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-26 01:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-26 01:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-26 01:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-26 01:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-26 01:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 01:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 01:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 01:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 01:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 01:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 01:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 01:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 01:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 01:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 01:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 01:30:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 01:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 01:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 01:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 01:35:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 01:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 01:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 01:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 01:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 01:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 01:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 01:50:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 01:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 01:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 01:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 02:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 02:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 02:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 02:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 02:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-26 02:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-26 02:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-26 02:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-26 02:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-26 02:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 02:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 02:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 02:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 02:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 02:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 02:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 02:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 02:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 02:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 02:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 02:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 02:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 02:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 02:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 02:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 02:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 02:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 02:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 02:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 02:45:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 02:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 02:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 02:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 02:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 02:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 03:00:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 03:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 03:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 03:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 03:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-26 03:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-26 03:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-26 03:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-26 03:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-26 03:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 03:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 03:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 03:10:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 03:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 03:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 03:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 03:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 03:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 03:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 03:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 03:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 03:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 03:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 03:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 03:35:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 03:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 03:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 03:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 03:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 03:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 03:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 03:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 03:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 03:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 03:55:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 04:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 04:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 04:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 04:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 04:00:01] Onboarding: === Customer Onboarding started ===
- [2026-02-26 04:00:01] DesignSystem: === AI Design System generation started ===
- [2026-02-26 04:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-02-26 04:00:01] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-26 04:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-02-26 04:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 04:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 04:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 04:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 04:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 04:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 04:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 04:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 04:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 04:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 04:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 04:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 04:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 04:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 04:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 04:35:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 04:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 04:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 04:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 04:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 04:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 04:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 04:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 04:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 04:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 04:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 05:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 05:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 05:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 05:00:00] SecurityPatch: === Security Patch Automation started ===
- [2026-02-26 05:00:00] SecurityPatch: Running: brew upgrade
- [2026-02-26 05:00:00] SecurityPatch: Unexpected error: [Errno 2] No such file or directory: 'brew'
- [2026-02-26 05:00:00] SecurityPatch: === Security Patch Automation finished ===
- [2026-02-26 05:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 05:00:02] SalesPlaybooks: === Sales Playbooks Agent started ===
- [2026-02-26 05:00:02] SalesPlaybooks: Unhandled exception in SalesPlaybooksAgent: relation "deals" does not exist
LINE 10:         FROM deals d
                      ^

- [2026-02-26 05:00:02] Onboarding: === Customer Onboarding started ===
- [2026-02-26 05:00:02] DesignSystem: === AI Design System generation started ===
- [2026-02-26 05:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-02-26 05:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-26 05:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-02-26 05:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 05:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 05:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 05:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 05:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 05:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 05:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 05:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 05:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 05:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 05:25:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 05:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 05:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 05:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 05:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 05:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 05:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 05:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 05:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 05:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 05:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 05:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 05:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 05:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 05:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 05:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 06:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 06:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 06:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 06:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 06:00:01] Onboarding: === Customer Onboarding started ===
- [2026-02-26 06:00:01] DesignSystem: === AI Design System generation started ===
- [2026-02-26 06:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-02-26 06:00:01] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-26 06:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-02-26 06:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 06:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 06:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 06:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 06:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 06:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 06:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 06:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 06:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 06:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 06:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 06:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 06:30:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 06:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 06:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 06:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 06:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 06:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 06:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 06:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 06:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 06:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 06:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 06:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 06:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 06:55:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 07:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 07:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 07:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 07:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 07:00:01] DesignSystem: === AI Design System generation started ===
- [2026-02-26 07:00:01] Onboarding: === Customer Onboarding started ===
- [2026-02-26 07:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-02-26 07:00:01] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-26 07:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-02-26 07:00:04] ChurnPredict: === Predictive Churn Modeling started ===
- [2026-02-26 07:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 07:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 07:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 07:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 07:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 07:15:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 07:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 07:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 07:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 07:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 07:25:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 07:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 07:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 07:30:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 07:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 07:35:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 07:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 07:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 07:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 07:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 07:45:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 07:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 07:50:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 07:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 07:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 07:55:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 08:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 08:00:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 08:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 08:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 08:00:00] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-02-26 08:00:03] Onboarding: === Customer Onboarding started ===
- [2026-02-26 08:00:03] DesignSystem: === AI Design System generation started ===
- [2026-02-26 08:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-02-26 08:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-02-26 08:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-02-26 08:05:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 08:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 08:10:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 08:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 08:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 08:15:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 08:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 08:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 08:20:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 08:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-02-26 08:25:01] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 08:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-02-26 08:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-02-26 08:40:00] GitHubAutoMerge: === GitHub Auto‑Merge Agent started ===
- [2026-02-26 08:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 19:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 19:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 19:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 19:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 19:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 19:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 20:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 20:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 20:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 20:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-10 20:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-10 20:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-10 20:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-10 20:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-10 20:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 20:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 20:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 20:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 20:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 20:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 20:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 20:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 20:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 20:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 20:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 20:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 20:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 20:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 20:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 21:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 21:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 21:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 21:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-10 21:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-10 21:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-10 21:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-10 21:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-10 21:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 21:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 21:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 21:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 21:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 21:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 21:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 21:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 21:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 21:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 21:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 21:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 21:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 21:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 21:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 22:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 22:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 22:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 22:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-10 22:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-10 22:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-10 22:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-10 22:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-10 22:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 22:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 22:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 22:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 22:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 22:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 22:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 22:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 22:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 22:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 22:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 22:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 22:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 22:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 22:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 23:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 23:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 23:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 23:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-10 23:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-10 23:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-10 23:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-10 23:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-10 23:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 23:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 23:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 23:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 23:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 23:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 23:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 23:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 23:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 23:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 23:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 23:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-10 23:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-10 23:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-10 23:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 00:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 00:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 00:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 00:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 00:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 00:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 00:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 00:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 00:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 00:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 00:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 00:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 00:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 00:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 00:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 00:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 00:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 00:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 00:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 00:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 00:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 00:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 00:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 01:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 01:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 01:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 01:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 01:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 01:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 01:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 01:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 01:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 01:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 01:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 01:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 01:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 01:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 01:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 01:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 01:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 01:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 01:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 01:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 01:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 01:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 01:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 02:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 02:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 02:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 02:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-11 02:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-11 02:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 02:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 02:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 02:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 02:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 02:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 02:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 02:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 02:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 02:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 02:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 02:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 02:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 02:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 02:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 02:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 02:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 02:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 03:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 03:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 03:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 03:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 03:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 03:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 03:00:04] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 03:00:04] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 03:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 03:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 03:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 03:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 03:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 03:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 03:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 03:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 03:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 03:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 03:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 03:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 03:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 03:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 03:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 04:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 04:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 04:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 04:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-11 04:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-11 04:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 04:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 04:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 04:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 04:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 04:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 04:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 04:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 04:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 04:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 04:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 04:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 04:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 04:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 04:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 04:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 04:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 04:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 05:00:00] SecurityPatch: === Security Patch Automation started ===
- [2026-03-11 05:00:00] SecurityPatch: Running: brew upgrade
- [2026-03-11 05:00:00] SecurityPatch: Unexpected error: [Errno 2] No such file or directory: 'brew'
- [2026-03-11 05:00:00] SecurityPatch: === Security Patch Automation finished ===
- [2026-03-11 05:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 05:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 05:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 05:00:02] SalesPlaybooks: === Sales Playbooks Agent started ===
- [2026-03-11 05:00:02] SalesPlaybooks: Unhandled exception in SalesPlaybooksAgent: relation "deals" does not exist
LINE 10:         FROM deals d
                      ^

- [2026-03-11 05:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-11 05:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-11 05:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 05:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 05:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 05:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 05:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 05:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 05:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 05:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 05:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 05:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 05:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 05:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 05:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 05:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 05:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 05:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 05:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 05:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 06:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 06:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 06:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 06:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-11 06:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-11 06:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 06:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 06:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 06:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 06:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 06:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 06:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 06:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 06:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 06:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 06:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 06:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 06:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 06:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 06:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 06:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 06:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 06:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 07:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 07:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 07:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 07:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-11 07:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-11 07:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 07:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 07:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 07:00:22] ChurnPredict: === Predictive Churn Modeling started ===
- [2026-03-11 07:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 07:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 07:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 07:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 07:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 07:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 07:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 07:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 07:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 07:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 07:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 07:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 07:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 07:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 07:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 08:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 08:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 08:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 08:00:01] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-03-11 08:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 08:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 08:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 08:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 08:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 08:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 08:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 08:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 08:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 08:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 08:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 08:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 08:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 08:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 08:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 08:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 08:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 08:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 08:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 08:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 09:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 09:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 09:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 09:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 09:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 09:00:03] MarketTrend: === Market Trend Monitoring started ===
- [2026-03-11 09:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 09:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 09:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 09:00:16] MarketTrend: Scraped hubspot: N/A
- [2026-03-11 09:00:17] MarketTrend: Scraped salesforce: N/A
- [2026-03-11 09:00:18] MarketTrend: Scraped pipedrive: N/A
- [2026-03-11 09:00:19] MarketTrend: Scraped zoho: â¹800
- [2026-03-11 09:00:21] MarketTrend: Scraped close: Core Features (CRM)
- [2026-03-11 09:00:21] MarketTrend: GPT-4 analysis failed: 

You tried to access openai.ChatCompletion, but this is no longer supported in openai>=1.0.0 - see the README at https://github.com/openai/openai-python for the API.

You can run `openai migrate` to automatically upgrade your codebase to use the 1.0.0 interface. 

Alternatively, you can pin your installation to the old version, e.g. `pip install openai==0.28`

A detailed migration guide is available here: https://github.com/openai/openai-python/discussions/742

- [2026-03-11 09:00:21] MarketTrend: SendGrid key missing – cannot send alert
- [2026-03-11 09:00:21] MarketTrend: Market trend analysis completed.
- [2026-03-11 09:00:21] MarketTrend: === Market Trend Monitoring finished ===
- [2026-03-11 09:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 09:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 09:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 09:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 09:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 09:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 09:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 09:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 09:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 09:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 09:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 09:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 09:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 09:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 09:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 10:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 10:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 10:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 10:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-11 10:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-11 10:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 10:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 10:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 10:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 10:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 10:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 10:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 10:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 10:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 10:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 10:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 10:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 10:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 10:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 10:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 10:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 10:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 10:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 11:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 11:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 11:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 11:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 11:00:03] Feedback: === Customer Feedback Collection started ===
- [2026-03-11 11:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 11:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 11:00:03] Feedback: Feedback collection failed: relation "purchases" does not exist
LINE 3:         FROM purchases
                     ^

- [2026-03-11 11:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 11:00:03] Feedback: === Customer Feedback Collection finished ===
- [2026-03-11 11:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 11:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 11:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 11:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 11:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 11:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 11:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 11:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 11:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 11:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 11:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 11:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 11:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 11:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 11:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 11:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 12:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 12:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 12:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 12:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 12:00:03] Churn: === Churn Prevention started ===
- [2026-03-11 12:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 12:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 12:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 12:00:03] Churn: Churn prevention failed: relation "customers" does not exist
LINE 3:         FROM customers
                     ^

- [2026-03-11 12:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 12:00:03] Churn: === Churn Prevention finished ===
- [2026-03-11 12:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 12:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 12:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 12:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 12:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 12:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 12:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 12:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 12:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 12:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 12:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 12:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 12:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 12:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 12:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 13:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 13:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 13:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 13:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-11 13:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-11 13:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 13:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 13:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 13:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 13:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 13:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 13:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 13:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 13:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 13:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 13:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 13:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 13:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 13:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 13:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 13:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 13:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 13:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 14:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 14:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 14:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 14:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 14:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 14:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 14:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 14:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 14:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 14:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 14:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 14:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 14:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 14:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 14:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 14:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 14:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 14:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 14:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 14:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 14:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 14:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 14:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 15:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 15:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 15:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 15:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 15:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 15:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 15:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 15:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 15:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 15:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 15:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 15:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 15:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 15:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 15:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 15:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 15:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 15:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 15:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 15:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 15:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 15:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 15:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 16:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 16:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 16:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 16:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 16:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 16:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 16:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 16:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 16:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 16:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 16:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 16:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 16:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 16:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 16:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 16:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 16:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 16:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 16:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 16:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 16:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 16:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 16:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 17:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 17:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 17:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 17:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 17:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 17:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 17:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 17:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 17:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 17:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 17:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 17:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 17:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 17:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 17:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 17:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 17:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 17:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 17:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 17:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 17:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 17:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 17:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 18:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 18:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 18:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 18:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 18:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 18:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 18:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 18:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 18:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 18:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 18:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 18:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 18:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 18:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 18:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 18:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 18:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 18:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 18:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 18:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 18:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 18:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 18:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 19:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 19:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 19:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 19:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-11 19:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-11 19:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 19:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 19:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 19:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 19:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 19:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 19:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 19:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 19:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 19:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 19:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 19:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 19:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 19:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 19:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 19:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 19:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 19:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 20:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 20:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 20:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 20:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 20:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 20:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 20:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 20:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 20:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 20:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 20:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 20:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 20:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 20:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 20:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 20:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 20:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 20:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 20:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 20:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 20:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 20:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 20:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 21:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 21:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 21:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 21:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 21:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 21:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 21:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 21:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 21:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 21:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 21:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 21:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 21:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 21:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 21:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 21:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 21:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 21:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 21:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 21:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 21:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 21:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 21:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 22:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 22:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 22:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 22:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 22:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 22:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 22:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 22:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 22:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 22:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 22:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 22:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 22:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 22:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 22:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 22:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 22:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 22:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 22:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 22:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 22:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 22:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 22:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 23:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 23:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 23:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 23:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-11 23:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-11 23:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-11 23:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-11 23:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-11 23:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 23:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 23:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 23:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 23:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 23:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 23:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 23:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 23:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 23:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 23:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 23:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-11 23:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-11 23:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-11 23:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 00:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 00:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 00:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 00:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-12 00:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-12 00:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 00:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 00:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 00:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 00:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 00:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 00:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 00:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 00:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 00:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 00:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 00:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 00:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 00:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 00:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 00:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 00:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 00:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 01:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 01:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 01:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 01:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 01:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 01:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 01:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 01:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 01:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 01:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 01:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 01:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 01:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 01:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 01:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 01:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 01:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 01:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 01:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 01:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 01:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 01:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 01:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 02:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 02:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 02:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 02:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-12 02:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-12 02:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 02:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 02:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 02:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 02:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 02:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 02:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 02:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 02:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 02:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 02:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 02:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 02:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 02:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 02:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 02:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 02:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 02:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 03:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 03:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 03:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 03:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 03:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 03:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 03:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 03:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 03:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 03:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 03:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 03:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 03:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 03:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 03:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 03:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 03:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 03:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 03:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 03:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 03:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 03:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 03:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 04:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 04:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 04:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 04:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 04:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 04:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 04:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 04:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 04:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 04:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 04:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 04:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 04:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 04:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 04:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 04:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 04:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 04:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 04:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 04:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 04:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 04:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 04:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 05:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 05:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 05:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 05:00:01] SecurityPatch: === Security Patch Automation started ===
- [2026-03-12 05:00:01] SecurityPatch: Running: brew upgrade
- [2026-03-12 05:00:01] SecurityPatch: Unexpected error: [Errno 2] No such file or directory: 'brew'
- [2026-03-12 05:00:01] SecurityPatch: === Security Patch Automation finished ===
- [2026-03-12 05:00:03] SalesPlaybooks: === Sales Playbooks Agent started ===
- [2026-03-12 05:00:03] SalesPlaybooks: Unhandled exception in SalesPlaybooksAgent: relation "deals" does not exist
LINE 10:         FROM deals d
                      ^

- [2026-03-12 05:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 05:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 05:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 05:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 05:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 05:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 05:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 05:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 05:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 05:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 05:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 05:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 05:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 05:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 05:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 05:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 05:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 05:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 05:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 05:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 06:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 06:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 06:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 06:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 06:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 06:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 06:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 06:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 06:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 06:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 06:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 06:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 06:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 06:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 06:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 06:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 06:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 06:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 06:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 06:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 06:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 06:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 06:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 07:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 07:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 07:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 07:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 07:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 07:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 07:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 07:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 07:00:07] ChurnPredict: === Predictive Churn Modeling started ===
- [2026-03-12 07:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 07:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 07:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 07:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 07:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 07:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 07:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 07:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 07:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 07:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 07:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 07:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 07:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 07:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 07:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 08:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 08:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 08:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 08:00:01] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-03-12 08:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 08:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 08:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 08:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 08:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 08:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 08:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 08:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 08:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 08:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 08:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 08:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 08:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 08:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 08:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 08:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 08:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 08:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 08:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 08:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 09:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 09:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 09:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 09:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-12 09:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-12 09:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 09:00:02] MarketTrend: === Market Trend Monitoring started ===
- [2026-03-12 09:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 09:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 09:00:21] MarketTrend: Scraped hubspot: N/A
- [2026-03-12 09:00:22] MarketTrend: Scraped salesforce: N/A
- [2026-03-12 09:00:23] MarketTrend: Scraped pipedrive: N/A
- [2026-03-12 09:00:25] MarketTrend: Scraped zoho: â¹800
- [2026-03-12 09:00:27] MarketTrend: Scraped close: Core Features (CRM)
- [2026-03-12 09:00:27] MarketTrend: GPT-4 analysis failed: 

You tried to access openai.ChatCompletion, but this is no longer supported in openai>=1.0.0 - see the README at https://github.com/openai/openai-python for the API.

You can run `openai migrate` to automatically upgrade your codebase to use the 1.0.0 interface. 

Alternatively, you can pin your installation to the old version, e.g. `pip install openai==0.28`

A detailed migration guide is available here: https://github.com/openai/openai-python/discussions/742

- [2026-03-12 09:00:27] MarketTrend: SendGrid key missing – cannot send alert
- [2026-03-12 09:00:27] MarketTrend: Market trend analysis completed.
- [2026-03-12 09:00:27] MarketTrend: === Market Trend Monitoring finished ===
- [2026-03-12 09:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 09:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 09:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 09:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 09:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 09:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 09:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 09:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 09:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 09:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 09:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 09:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 09:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 09:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 09:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 10:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 10:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 10:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 10:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 10:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 10:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 10:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 10:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 10:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 10:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 10:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 10:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 10:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 10:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 10:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 10:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 10:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 10:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 10:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 10:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 10:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 10:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 10:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 11:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 11:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 11:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 11:00:03] Feedback: === Customer Feedback Collection started ===
- [2026-03-12 11:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 11:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 11:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 11:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 11:00:03] Feedback: Feedback collection failed: relation "purchases" does not exist
LINE 3:         FROM purchases
                     ^

- [2026-03-12 11:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 11:00:03] Feedback: === Customer Feedback Collection finished ===
- [2026-03-12 11:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 11:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 11:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 11:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 11:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 11:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 11:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 11:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 11:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 11:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 11:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 11:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 11:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 11:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 11:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 12:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 12:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 12:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 12:00:02] Churn: === Churn Prevention started ===
- [2026-03-12 12:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-12 12:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-12 12:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 12:00:03] Churn: Churn prevention failed: relation "customers" does not exist
LINE 3:         FROM customers
                     ^

- [2026-03-12 12:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 12:00:03] Churn: === Churn Prevention finished ===
- [2026-03-12 12:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 12:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 12:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 12:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 12:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 12:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 12:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 12:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 12:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 12:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 12:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 12:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 12:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 12:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 12:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 12:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 13:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 13:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 13:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 13:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 13:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 13:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 13:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 13:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 13:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 13:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 13:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 13:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 13:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 13:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 13:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 13:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 13:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 13:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 13:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 13:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 13:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 13:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 13:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 14:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 14:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 14:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 14:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 14:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 14:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 14:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 14:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 14:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 14:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 14:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 14:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 14:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 14:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 14:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 14:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 14:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 14:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 14:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 14:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 14:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 14:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 14:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 15:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 15:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 15:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 15:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 15:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 15:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 15:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 15:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 15:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 15:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 15:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 15:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 15:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 15:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 15:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 15:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 15:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 15:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 15:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 15:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 15:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 15:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 15:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 16:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 16:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 16:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 16:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-12 16:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-12 16:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 16:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 16:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 16:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 16:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 16:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 16:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 16:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 16:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 16:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 16:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 16:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 16:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 16:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 16:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 16:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 16:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 16:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 17:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 17:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 17:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 17:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 17:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 17:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 17:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 17:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 17:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 17:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 17:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 17:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 17:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 17:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 17:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 17:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 17:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 17:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 17:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 17:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 17:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 17:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 17:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 18:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 18:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 18:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 18:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 18:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 18:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 18:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 18:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 18:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 18:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 18:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 18:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 18:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 18:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 18:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 18:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 18:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 18:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 18:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 18:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 18:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 18:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 18:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 19:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 19:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 19:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 19:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 19:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 19:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 19:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 19:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 19:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 19:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 19:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 19:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 19:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 19:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 19:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 19:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 19:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 19:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 19:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 19:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 19:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 19:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 19:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 20:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 20:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 20:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 20:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-12 20:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-12 20:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 20:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 20:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 20:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 20:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 20:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 20:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 20:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 20:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 20:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 20:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 20:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 20:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 20:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 20:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 20:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 20:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 20:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 21:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 21:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 21:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 21:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 21:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 21:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 21:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 21:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 21:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 21:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 21:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 21:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 21:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 21:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 21:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 21:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 21:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 21:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 21:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 21:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 21:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 21:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 21:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 22:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 22:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 22:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 22:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-12 22:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-12 22:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 22:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 22:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 22:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 22:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 22:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 22:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 22:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 22:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 22:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 22:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 22:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 22:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 22:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 22:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 22:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 22:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 22:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 23:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 23:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 23:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 23:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-12 23:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-12 23:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-12 23:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-12 23:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-12 23:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 23:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 23:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 23:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 23:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 23:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 23:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 23:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 23:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 23:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 23:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 23:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-12 23:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-12 23:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-12 23:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 00:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 00:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 00:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 00:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 00:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 00:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 00:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 00:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 00:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 00:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 00:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 00:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 00:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 00:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 00:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 00:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 00:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 00:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 00:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 00:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 00:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 00:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 00:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 01:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 01:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 01:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 01:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 01:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 01:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 01:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 01:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 01:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 01:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 01:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 01:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 01:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 01:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 01:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 01:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 01:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 01:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 01:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 01:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 01:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 01:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 01:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 02:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 02:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 02:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 02:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-13 02:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-13 02:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 02:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 02:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 02:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 02:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 02:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 02:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 02:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 02:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 02:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 02:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 02:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 02:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 02:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 02:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 02:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 02:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 02:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 03:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 03:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 03:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 03:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 03:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 03:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 03:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 03:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 03:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 03:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 03:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 03:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 03:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 03:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 03:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 03:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 03:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 03:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 03:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 03:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 03:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 03:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 03:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 04:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 04:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 04:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 04:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-13 04:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-13 04:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 04:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 04:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 04:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 04:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 04:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 04:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 04:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 04:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 04:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 04:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 04:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 04:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 04:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 04:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 04:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 04:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 04:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 05:00:00] SecurityPatch: === Security Patch Automation started ===
- [2026-03-13 05:00:00] SecurityPatch: Running: brew upgrade
- [2026-03-13 05:00:00] SecurityPatch: Unexpected error: [Errno 2] No such file or directory: 'brew'
- [2026-03-13 05:00:00] SecurityPatch: === Security Patch Automation finished ===
- [2026-03-13 05:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 05:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 05:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 05:00:03] SalesPlaybooks: === Sales Playbooks Agent started ===
- [2026-03-13 05:00:03] SalesPlaybooks: Unhandled exception in SalesPlaybooksAgent: relation "deals" does not exist
LINE 10:         FROM deals d
                      ^

- [2026-03-13 05:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 05:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 05:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 05:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 05:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 05:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 05:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 05:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 05:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 05:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 05:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 05:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 05:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 05:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 05:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 05:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 05:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 05:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 05:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 05:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 06:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 06:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 06:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 06:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 06:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 06:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 06:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 06:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 06:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 06:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 06:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 06:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 06:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 06:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 06:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 06:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 06:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 06:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 06:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 06:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 06:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 06:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 06:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 07:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 07:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 07:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 07:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 07:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 07:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 07:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 07:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 07:00:06] ChurnPredict: === Predictive Churn Modeling started ===
- [2026-03-13 07:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 07:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 07:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 07:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 07:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 07:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 07:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 07:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 07:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 07:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 07:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 07:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 07:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 07:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 07:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 08:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 08:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 08:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 08:00:01] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-03-13 08:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 08:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 08:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 08:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 08:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 08:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 08:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 08:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 08:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 08:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 08:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 08:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 08:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 08:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 08:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 08:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 08:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 08:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 08:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 08:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 09:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 09:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 09:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 09:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 09:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 09:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 09:00:03] MarketTrend: === Market Trend Monitoring started ===
- [2026-03-13 09:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 09:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 09:00:12] MarketTrend: Scraped hubspot: N/A
- [2026-03-13 09:00:14] MarketTrend: Scraped salesforce: N/A
- [2026-03-13 09:00:18] MarketTrend: Scraped pipedrive: N/A
- [2026-03-13 09:00:20] MarketTrend: Scraped zoho: â¹800
- [2026-03-13 09:00:21] MarketTrend: Scraped close: Core Features (CRM)
- [2026-03-13 09:00:21] MarketTrend: GPT-4 analysis failed: 

You tried to access openai.ChatCompletion, but this is no longer supported in openai>=1.0.0 - see the README at https://github.com/openai/openai-python for the API.

You can run `openai migrate` to automatically upgrade your codebase to use the 1.0.0 interface. 

Alternatively, you can pin your installation to the old version, e.g. `pip install openai==0.28`

A detailed migration guide is available here: https://github.com/openai/openai-python/discussions/742

- [2026-03-13 09:00:21] MarketTrend: SendGrid key missing – cannot send alert
- [2026-03-13 09:00:21] MarketTrend: Market trend analysis completed.
- [2026-03-13 09:00:21] MarketTrend: === Market Trend Monitoring finished ===
- [2026-03-13 09:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 09:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 09:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 09:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 09:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 09:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 09:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 09:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 09:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 09:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 09:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 09:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 09:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 09:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 09:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 10:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 10:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 10:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 10:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 10:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 10:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 10:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 10:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 10:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 10:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 10:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 10:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 10:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 10:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 10:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 10:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 10:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 10:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 10:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 10:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 10:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 10:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 10:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 11:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 11:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 11:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 11:00:03] Feedback: === Customer Feedback Collection started ===
- [2026-03-13 11:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 11:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 11:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 11:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 11:00:03] Feedback: Feedback collection failed: relation "purchases" does not exist
LINE 3:         FROM purchases
                     ^

- [2026-03-13 11:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 11:00:03] Feedback: === Customer Feedback Collection finished ===
- [2026-03-13 11:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 11:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 11:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 11:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 11:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 11:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 11:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 11:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 11:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 11:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 11:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 11:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 11:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 11:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 11:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 12:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 12:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 12:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 12:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-13 12:00:02] Churn: === Churn Prevention started ===
- [2026-03-13 12:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-13 12:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 12:00:03] Churn: Churn prevention failed: relation "customers" does not exist
LINE 3:         FROM customers
                     ^

- [2026-03-13 12:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 12:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 12:00:03] Churn: === Churn Prevention finished ===
- [2026-03-13 12:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 12:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 12:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 12:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 12:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 12:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 12:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 12:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 12:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 12:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 12:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 12:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 12:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 12:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 12:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 13:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 13:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 13:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 13:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 13:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 13:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 13:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 13:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 13:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 13:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 13:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 13:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 13:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 13:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 13:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 13:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 13:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 13:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 13:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 13:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 13:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 13:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 13:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 14:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 14:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 14:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 14:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 14:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 14:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 14:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 14:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 14:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 14:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 14:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 14:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 14:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 14:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 14:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 14:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 14:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 14:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 14:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 14:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 14:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 14:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 14:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 15:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 15:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 15:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 15:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-13 15:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-13 15:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 15:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 15:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 15:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 15:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 15:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 15:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 15:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 15:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 15:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 15:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 15:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 15:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 15:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 15:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 15:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 15:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 15:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 16:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 16:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 16:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 16:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 16:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 16:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 16:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 16:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 16:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 16:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 16:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 16:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 16:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 16:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 16:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 16:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 16:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 16:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 16:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 16:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 16:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 16:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 16:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 17:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 17:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 17:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 17:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-13 17:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-13 17:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 17:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 17:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 17:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 17:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 17:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 17:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 17:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 17:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 17:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 17:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 17:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 17:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 17:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 17:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 17:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 17:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 17:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 18:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 18:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 18:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 18:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 18:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 18:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 18:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 18:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 18:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 18:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 18:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 18:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 18:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 18:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 18:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 18:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 18:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 18:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 18:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 18:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 18:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 18:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 18:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 19:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 19:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 19:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 19:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 19:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 19:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 19:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 19:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 19:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 19:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 19:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 19:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 19:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 19:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 19:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 19:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 19:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 19:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 19:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 19:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 19:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 19:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 19:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 20:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 20:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 20:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 20:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-13 20:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-13 20:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 20:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 20:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 20:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 20:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 20:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 20:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 20:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 20:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 20:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 20:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 20:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 20:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 20:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 20:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 20:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 20:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 20:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 21:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 21:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 21:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 21:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 21:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 21:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 21:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 21:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 21:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 21:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 21:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 21:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 21:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 21:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 21:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 21:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 21:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 21:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 21:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 21:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 21:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 21:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 21:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 22:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 22:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 22:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 22:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 22:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 22:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 22:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 22:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 22:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 22:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 22:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 22:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 22:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 22:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 22:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 22:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 22:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 22:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 22:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 22:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 22:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 22:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 22:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 23:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 23:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 23:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 23:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-13 23:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-13 23:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-13 23:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-13 23:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-13 23:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 23:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 23:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 23:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 23:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 23:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 23:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 23:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 23:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 23:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 23:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 23:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-13 23:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-13 23:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-13 23:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 00:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 00:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 00:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 00:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 00:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 00:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 00:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 00:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 00:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 00:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 00:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 00:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 00:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 00:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 00:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 00:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 00:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 00:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 00:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 00:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 00:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 00:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 00:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 01:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 01:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 01:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 01:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 01:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 01:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 01:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 01:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 01:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 01:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 01:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 01:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 01:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 01:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 01:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 01:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 01:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 01:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 01:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 01:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 01:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 01:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 01:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 02:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 02:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 02:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 02:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-14 02:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-14 02:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 02:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 02:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 02:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 02:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 02:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 02:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 02:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 02:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 02:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 02:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 02:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 02:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 02:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 02:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 02:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 02:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 02:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 03:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 03:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 03:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 03:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 03:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 03:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 03:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 03:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 03:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 03:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 03:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 03:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 03:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 03:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 03:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 03:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 03:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 03:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 03:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 03:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 03:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 03:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 03:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 04:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 04:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 04:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 04:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 04:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 04:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 04:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 04:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 04:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 04:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 04:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 04:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 04:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 04:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 04:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 04:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 04:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 04:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 04:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 04:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 04:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 04:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 04:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 05:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 05:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 05:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 05:00:00] SecurityPatch: === Security Patch Automation started ===
- [2026-03-14 05:00:00] SecurityPatch: Running: brew upgrade
- [2026-03-14 05:00:00] SecurityPatch: Unexpected error: [Errno 2] No such file or directory: 'brew'
- [2026-03-14 05:00:00] SecurityPatch: === Security Patch Automation finished ===
- [2026-03-14 05:00:03] SalesPlaybooks: === Sales Playbooks Agent started ===
- [2026-03-14 05:00:03] SalesPlaybooks: Unhandled exception in SalesPlaybooksAgent: relation "deals" does not exist
LINE 10:         FROM deals d
                      ^

- [2026-03-14 05:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 05:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 05:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 05:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 05:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 05:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 05:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 05:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 05:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 05:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 05:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 05:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 05:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 05:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 05:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 05:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 05:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 05:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 05:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 05:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 06:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 06:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 06:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 06:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-14 06:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-14 06:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 06:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 06:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 06:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 06:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 06:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 06:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 06:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 06:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 06:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 06:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 06:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 06:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 06:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 06:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 06:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 06:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 06:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 07:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 07:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 07:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 07:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 07:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 07:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 07:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 07:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 07:00:06] ChurnPredict: === Predictive Churn Modeling started ===
- [2026-03-14 07:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 07:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 07:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 07:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 07:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 07:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 07:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 07:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 07:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 07:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 07:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 07:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 07:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 07:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 07:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 08:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 08:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 08:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 08:00:01] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-03-14 08:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 08:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 08:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 08:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 08:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 08:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 08:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 08:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 08:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 08:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 08:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 08:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 08:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 08:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 08:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 08:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 08:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 08:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 08:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 08:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 09:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 09:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 09:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 09:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 09:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 09:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 09:00:03] MarketTrend: === Market Trend Monitoring started ===
- [2026-03-14 09:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 09:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 09:00:14] MarketTrend: Scraped hubspot: N/A
- [2026-03-14 09:00:15] MarketTrend: Scraped salesforce: N/A
- [2026-03-14 09:00:18] MarketTrend: Scraped pipedrive: N/A
- [2026-03-14 09:00:20] MarketTrend: Scraped zoho: â¹800
- [2026-03-14 09:00:21] MarketTrend: Scraped close: Core Features (CRM)
- [2026-03-14 09:00:21] MarketTrend: GPT-4 analysis failed: 

You tried to access openai.ChatCompletion, but this is no longer supported in openai>=1.0.0 - see the README at https://github.com/openai/openai-python for the API.

You can run `openai migrate` to automatically upgrade your codebase to use the 1.0.0 interface. 

Alternatively, you can pin your installation to the old version, e.g. `pip install openai==0.28`

A detailed migration guide is available here: https://github.com/openai/openai-python/discussions/742

- [2026-03-14 09:00:21] MarketTrend: SendGrid key missing – cannot send alert
- [2026-03-14 09:00:21] MarketTrend: Market trend analysis completed.
- [2026-03-14 09:00:21] MarketTrend: === Market Trend Monitoring finished ===
- [2026-03-14 09:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 09:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 09:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 09:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 09:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 09:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 09:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 09:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 09:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 09:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 09:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 09:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 09:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 09:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 09:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 10:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 10:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 10:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 10:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-14 10:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-14 10:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 10:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 10:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 10:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 10:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 10:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 10:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 10:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 10:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 10:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 10:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 10:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 10:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 10:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 10:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 10:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 10:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 10:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 11:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 11:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 11:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 11:00:03] Feedback: === Customer Feedback Collection started ===
- [2026-03-14 11:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 11:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 11:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 11:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 11:00:03] Feedback: Feedback collection failed: relation "purchases" does not exist
LINE 3:         FROM purchases
                     ^

- [2026-03-14 11:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 11:00:03] Feedback: === Customer Feedback Collection finished ===
- [2026-03-14 11:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 11:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 11:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 11:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 11:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 11:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 11:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 11:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 11:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 11:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 11:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 11:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 11:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 11:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 11:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 12:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 12:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 12:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 12:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 12:00:03] Churn: === Churn Prevention started ===
- [2026-03-14 12:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 12:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 12:00:04] Churn: Churn prevention failed: relation "customers" does not exist
LINE 3:         FROM customers
                     ^

- [2026-03-14 12:00:04] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 12:00:04] Churn: === Churn Prevention finished ===
- [2026-03-14 12:00:04] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 12:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 12:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 12:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 12:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 12:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 12:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 12:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 12:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 12:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 12:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 12:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 12:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 12:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 12:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 12:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 13:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 13:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 13:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 13:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-14 13:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-14 13:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 13:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 13:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 13:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 13:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 13:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 13:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 13:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 13:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 13:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 13:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 13:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 13:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 13:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 13:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 13:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 13:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 13:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 14:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 14:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 14:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 14:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 14:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 14:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 14:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 14:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 14:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 14:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 14:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 14:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 14:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 14:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 14:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 14:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 14:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 14:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 14:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 14:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 14:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 14:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 14:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 15:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 15:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 15:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 15:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 15:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 15:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 15:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 15:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 15:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 15:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 15:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 15:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 15:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 15:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 15:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 15:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 15:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 15:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 15:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 15:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 15:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 15:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 15:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 16:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 16:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 16:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 16:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 16:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 16:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 16:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 16:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 16:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 16:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 16:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 16:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 16:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 16:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 16:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 16:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 16:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 16:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 16:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 16:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 16:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 16:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 16:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 17:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 17:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 17:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 17:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 17:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 17:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 17:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 17:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 17:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 17:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 17:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 17:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 17:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 17:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 17:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 17:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 17:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 17:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 17:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 17:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 17:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 17:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 17:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 18:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 18:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 18:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 18:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 18:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 18:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 18:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 18:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 18:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 18:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 18:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 18:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 18:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 18:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 18:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 18:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 18:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 18:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 18:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 18:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 18:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 18:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 18:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 19:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 19:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 19:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 19:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-14 19:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-14 19:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 19:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 19:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 19:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 19:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 19:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 19:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 19:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 19:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 19:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 19:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 19:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 19:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 19:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 19:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 19:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 19:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 19:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 20:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 20:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 20:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 20:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-14 20:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-14 20:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 20:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 20:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 20:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 20:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 20:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 20:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 20:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 20:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 20:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 20:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 20:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 20:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 20:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 20:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 20:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 20:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 20:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 21:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 21:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 21:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 21:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 21:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 21:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 21:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 21:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 21:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 21:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 21:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 21:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 21:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 21:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 21:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 21:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 21:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 21:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 21:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 21:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 21:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 21:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 21:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 22:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 22:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 22:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 22:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-14 22:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-14 22:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 22:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 22:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 22:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 22:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 22:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 22:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 22:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 22:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 22:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 22:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 22:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 22:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 22:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 22:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 22:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 22:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 22:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 23:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 23:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 23:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 23:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-14 23:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-14 23:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-14 23:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-14 23:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-14 23:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 23:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 23:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 23:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 23:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 23:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 23:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 23:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 23:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 23:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 23:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 23:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-14 23:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-14 23:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-14 23:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 00:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 00:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 00:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 00:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 00:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 00:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 00:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 00:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 00:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 00:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 00:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 00:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 00:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 00:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 00:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 00:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 00:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 00:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 00:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 00:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 00:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 00:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 00:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 01:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 01:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 01:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 01:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 01:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 01:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 01:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 01:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 01:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 01:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 01:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 01:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 01:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 01:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 01:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 01:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 01:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 01:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 01:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 01:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 01:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 01:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 01:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 02:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 02:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 02:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 02:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 02:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 02:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 02:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 02:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 02:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 02:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 02:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 02:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 02:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 02:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 02:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 02:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 02:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 02:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 02:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 02:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 02:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 02:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 02:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 03:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 03:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 03:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 03:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 03:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 03:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 03:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 03:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 03:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 03:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 03:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 03:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 03:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 03:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 03:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 03:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 03:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 03:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 03:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 03:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 03:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 03:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 03:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 04:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 04:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 04:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 04:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-15 04:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-15 04:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 04:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 04:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 04:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 04:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 04:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 04:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 04:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 04:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 04:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 04:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 04:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 04:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 04:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 04:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 04:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 04:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 04:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 05:00:00] SecurityPatch: === Security Patch Automation started ===
- [2026-03-15 05:00:00] SecurityPatch: Running: brew upgrade
- [2026-03-15 05:00:00] SecurityPatch: Unexpected error: [Errno 2] No such file or directory: 'brew'
- [2026-03-15 05:00:00] SecurityPatch: === Security Patch Automation finished ===
- [2026-03-15 05:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 05:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 05:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 05:00:03] SalesPlaybooks: === Sales Playbooks Agent started ===
- [2026-03-15 05:00:03] SalesPlaybooks: Unhandled exception in SalesPlaybooksAgent: relation "deals" does not exist
LINE 10:         FROM deals d
                      ^

- [2026-03-15 05:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 05:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 05:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 05:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 05:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 05:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 05:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 05:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 05:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 05:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 05:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 05:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 05:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 05:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 05:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 05:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 05:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 05:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 05:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 05:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 06:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 06:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 06:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 06:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 06:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 06:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 06:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 06:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 06:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 06:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 06:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 06:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 06:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 06:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 06:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 06:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 06:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 06:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 06:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 06:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 06:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 06:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 06:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 07:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 07:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 07:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 07:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 07:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 07:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 07:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 07:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 07:00:06] ChurnPredict: === Predictive Churn Modeling started ===
- [2026-03-15 07:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 07:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 07:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 07:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 07:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 07:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 07:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 07:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 07:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 07:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 07:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 07:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 07:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 07:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 07:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 08:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 08:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 08:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 08:00:01] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-03-15 08:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 08:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 08:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 08:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 08:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 08:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 08:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 08:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 08:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 08:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 08:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 08:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 08:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 08:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 08:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 08:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 08:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 08:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 08:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 08:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 09:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 09:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 09:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 09:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 09:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 09:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 09:00:03] MarketTrend: === Market Trend Monitoring started ===
- [2026-03-15 09:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 09:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 09:00:04] MarketTrend: Scraped hubspot: N/A
- [2026-03-15 09:00:05] MarketTrend: Scraped salesforce: N/A
- [2026-03-15 09:00:07] MarketTrend: Scraped pipedrive: N/A
- [2026-03-15 09:00:08] MarketTrend: Scraped zoho: â¹800
- [2026-03-15 09:00:08] MarketTrend: Scraped close: Core Features (CRM)
- [2026-03-15 09:00:08] MarketTrend: GPT-4 analysis failed: 

You tried to access openai.ChatCompletion, but this is no longer supported in openai>=1.0.0 - see the README at https://github.com/openai/openai-python for the API.

You can run `openai migrate` to automatically upgrade your codebase to use the 1.0.0 interface. 

Alternatively, you can pin your installation to the old version, e.g. `pip install openai==0.28`

A detailed migration guide is available here: https://github.com/openai/openai-python/discussions/742

- [2026-03-15 09:00:08] MarketTrend: SendGrid key missing – cannot send alert
- [2026-03-15 09:00:08] MarketTrend: Market trend analysis completed.
- [2026-03-15 09:00:08] MarketTrend: === Market Trend Monitoring finished ===
- [2026-03-15 09:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 09:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 09:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 09:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 09:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 09:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 09:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 09:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 09:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 09:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 09:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 09:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 09:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 09:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 09:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 10:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 10:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 10:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 10:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 10:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 10:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 10:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 10:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 10:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 10:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 10:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 10:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 10:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 10:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 10:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 10:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 10:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 10:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 10:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 10:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 10:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 10:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 10:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 11:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 11:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 11:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 11:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 11:00:03] Feedback: === Customer Feedback Collection started ===
- [2026-03-15 11:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 11:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 11:00:03] Feedback: Feedback collection failed: relation "purchases" does not exist
LINE 3:         FROM purchases
                     ^

- [2026-03-15 11:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 11:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 11:00:03] Feedback: === Customer Feedback Collection finished ===
- [2026-03-15 11:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 11:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 11:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 11:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 11:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 11:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 11:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 11:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 11:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 11:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 11:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 11:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 11:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 11:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 11:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 12:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 12:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 12:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 12:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 12:00:03] Churn: === Churn Prevention started ===
- [2026-03-15 12:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 12:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 12:00:03] Churn: Churn prevention failed: relation "customers" does not exist
LINE 3:         FROM customers
                     ^

- [2026-03-15 12:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 12:00:03] Churn: === Churn Prevention finished ===
- [2026-03-15 12:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 12:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 12:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 12:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 12:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 12:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 12:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 12:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 12:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 12:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 12:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 12:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 12:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 12:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 12:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 12:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 13:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 13:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 13:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 13:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 13:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 13:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 13:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 13:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 13:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 13:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 13:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 13:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 13:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 13:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 13:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 13:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 13:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 13:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 13:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 13:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 13:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 13:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 13:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 14:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 14:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 14:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 14:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 14:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 14:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 14:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 14:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 14:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 14:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 14:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 14:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 14:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 14:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 14:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 14:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 14:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 14:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 14:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 14:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 14:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 14:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 14:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 15:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 15:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 15:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 15:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 15:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 15:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 15:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 15:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 15:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 15:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 15:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 15:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 15:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 15:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 15:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 15:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 15:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 15:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 15:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 15:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 15:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 15:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 15:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 16:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 16:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 16:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 16:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 16:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 16:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 16:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 16:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 16:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 16:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 16:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 16:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 16:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 16:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 16:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 16:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 16:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 16:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 16:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 16:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 16:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 16:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 16:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 17:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 17:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 17:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 17:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 17:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 17:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 17:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 17:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 17:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 17:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 17:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 17:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 17:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 17:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 17:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 17:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 17:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 17:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 17:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 17:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 17:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 17:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 17:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 18:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 18:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 18:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 18:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 18:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 18:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 18:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 18:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 18:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 18:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 18:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 18:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 18:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 18:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 18:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 18:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 18:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 18:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 18:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 18:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 18:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 18:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 18:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 19:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 19:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 19:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 19:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 19:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 19:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 19:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 19:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 19:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 19:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 19:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 19:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 19:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 19:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 19:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 19:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 19:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 19:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 19:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 19:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 19:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 19:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 19:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 20:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 20:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 20:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 20:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 20:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 20:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 20:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 20:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 20:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 20:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 20:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 20:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 20:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 20:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 20:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 20:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 20:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 20:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 20:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 20:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 20:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 20:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 20:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 21:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 21:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 21:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 21:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 21:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 21:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 21:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 21:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 21:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 21:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 21:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 21:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 21:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 21:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 21:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 21:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 21:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 21:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 21:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 21:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 21:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 21:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 21:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 22:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 22:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 22:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 22:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-15 22:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-15 22:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 22:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 22:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 22:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 22:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 22:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 22:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 22:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 22:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 22:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 22:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 22:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 22:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 22:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 22:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 22:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 22:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 22:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 23:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 23:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 23:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 23:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-15 23:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-15 23:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-15 23:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-15 23:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-15 23:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 23:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 23:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 23:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 23:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 23:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 23:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 23:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 23:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 23:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 23:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 23:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-15 23:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-15 23:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-15 23:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 00:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 00:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 00:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 00:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-16 00:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-16 00:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 00:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 00:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 00:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 00:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 00:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 00:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 00:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 00:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 00:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 00:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 00:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 00:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 00:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 00:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 00:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 00:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 00:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 01:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 01:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 01:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 01:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-16 01:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-16 01:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 01:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 01:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 01:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 01:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 01:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 01:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 01:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 01:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 01:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 01:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 01:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 01:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 01:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 01:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 01:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 01:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 01:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 02:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 02:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 02:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 02:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-16 02:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-16 02:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 02:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 02:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 02:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 02:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 02:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 02:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 02:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 02:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 02:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 02:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 02:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 02:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 02:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 02:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 02:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 02:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 02:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 03:00:00] GrafanaDeploy: === Grafana Deployment Agent started ===
- [2026-03-16 03:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 03:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 03:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 03:00:01] WeeklyDashboard: === Weekly Dashboard generation started ===
- [2026-03-16 03:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-16 03:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-16 03:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 03:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 03:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 03:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 03:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 03:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 03:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 03:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 03:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 03:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 03:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 03:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 03:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 03:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 03:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 03:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 03:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 03:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 04:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 04:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 04:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 04:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-16 04:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-16 04:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 04:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 04:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 04:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 04:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 04:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 04:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 04:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 04:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 04:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 04:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 04:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 04:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 04:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 04:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 04:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 04:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 04:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 05:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 05:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 05:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 05:00:00] SecurityPatch: === Security Patch Automation started ===
- [2026-03-16 05:00:01] SecurityPatch: Running: brew upgrade
- [2026-03-16 05:00:01] SecurityPatch: Unexpected error: [Errno 2] No such file or directory: 'brew'
- [2026-03-16 05:00:01] SecurityPatch: === Security Patch Automation finished ===
- [2026-03-16 05:00:03] SalesPlaybooks: === Sales Playbooks Agent started ===
- [2026-03-16 05:00:03] SalesPlaybooks: Unhandled exception in SalesPlaybooksAgent: relation "deals" does not exist
LINE 10:         FROM deals d
                      ^

- [2026-03-16 05:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-16 05:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-16 05:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 05:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 05:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 05:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 05:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 05:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 05:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 05:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 05:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 05:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 05:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 05:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 05:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 05:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 05:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 05:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 05:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 05:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 06:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 06:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 06:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 06:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-16 06:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-16 06:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 06:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 06:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 06:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 06:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 06:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 06:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 06:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 06:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 06:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 06:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 06:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 06:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 06:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 06:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 06:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 06:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 06:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 07:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 07:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 07:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 07:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-16 07:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-16 07:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 07:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 07:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 07:00:06] ChurnPredict: === Predictive Churn Modeling started ===
- [2026-03-16 07:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 07:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 07:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 07:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 07:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 07:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 07:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 07:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 07:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 07:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 07:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 07:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 07:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 07:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 07:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 08:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 08:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 08:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 08:00:00] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-03-16 08:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-16 08:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-16 08:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 08:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 08:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 08:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 08:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 08:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 08:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 08:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 08:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 08:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 08:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 08:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 08:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 08:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 08:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 08:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 08:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 08:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 09:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 09:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 09:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 09:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-16 09:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-16 09:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 09:00:03] MarketTrend: === Market Trend Monitoring started ===
- [2026-03-16 09:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 09:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 09:00:27] MarketTrend: Scraped hubspot: N/A
- [2026-03-16 09:00:30] MarketTrend: Scraped salesforce: N/A
- [2026-03-16 09:00:31] MarketTrend: Scraped pipedrive: N/A
- [2026-03-16 09:00:32] MarketTrend: Scraped zoho: â¹800
- [2026-03-16 09:00:34] MarketTrend: Scraped close: Core Features (CRM)
- [2026-03-16 09:00:34] MarketTrend: GPT-4 analysis failed: 

You tried to access openai.ChatCompletion, but this is no longer supported in openai>=1.0.0 - see the README at https://github.com/openai/openai-python for the API.

You can run `openai migrate` to automatically upgrade your codebase to use the 1.0.0 interface. 

Alternatively, you can pin your installation to the old version, e.g. `pip install openai==0.28`

A detailed migration guide is available here: https://github.com/openai/openai-python/discussions/742

- [2026-03-16 09:00:34] MarketTrend: SendGrid key missing – cannot send alert
- [2026-03-16 09:00:34] MarketTrend: Market trend analysis completed.
- [2026-03-16 09:00:34] MarketTrend: === Market Trend Monitoring finished ===
- [2026-03-16 09:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 09:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 09:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 09:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 09:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 09:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 09:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 09:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 09:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 09:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 09:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 09:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 09:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 09:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 09:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 10:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 10:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 10:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 10:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-16 10:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-16 10:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 10:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 10:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 10:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 10:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 10:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 10:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 10:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 10:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 10:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 10:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 10:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 10:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 10:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 10:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 10:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 10:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 10:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 11:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 11:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 11:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 11:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-16 11:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-16 11:00:03] Feedback: === Customer Feedback Collection started ===
- [2026-03-16 11:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 11:00:03] Feedback: Feedback collection failed: relation "purchases" does not exist
LINE 3:         FROM purchases
                     ^

- [2026-03-16 11:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 11:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 11:00:03] Feedback: === Customer Feedback Collection finished ===
- [2026-03-16 11:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 11:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 11:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 11:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 11:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 11:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 11:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 11:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 11:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 11:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 11:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 11:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 11:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 11:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 11:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 12:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 12:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 12:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 12:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-16 12:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-16 12:00:03] Churn: === Churn Prevention started ===
- [2026-03-16 12:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 12:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 12:00:03] Churn: Churn prevention failed: relation "customers" does not exist
LINE 3:         FROM customers
                     ^

- [2026-03-16 12:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 12:00:03] Churn: === Churn Prevention finished ===
- [2026-03-16 12:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 12:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 12:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 12:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 12:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 12:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 12:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 12:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 12:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 12:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 12:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 12:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 12:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 12:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 12:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 13:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 13:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 13:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 13:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-16 13:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-16 13:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 13:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 13:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 13:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 13:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 13:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 13:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 13:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 13:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 13:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 13:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 13:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 13:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 13:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 13:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 13:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 13:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 13:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 14:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 14:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 14:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 14:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-16 14:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-16 14:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 14:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 14:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 14:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 14:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 14:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 14:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 14:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 14:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 14:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 14:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 14:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 14:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 14:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 14:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 14:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 14:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 14:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 15:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 15:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 15:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 15:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-16 15:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-16 15:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 15:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 15:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 15:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 15:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 15:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 15:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 15:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 15:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 15:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 15:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 15:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 15:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 15:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 15:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 15:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 15:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 15:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 16:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 16:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 16:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 16:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-16 16:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-16 16:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 16:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 16:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 16:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 16:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 16:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 16:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 16:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 16:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 16:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 16:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 16:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 16:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 16:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 16:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 16:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 16:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 16:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 17:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 17:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 17:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 17:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-16 17:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-16 17:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-16 17:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-16 17:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-16 17:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 17:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 17:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 17:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 17:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 17:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 17:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 17:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 17:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 17:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 17:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 17:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 22:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 22:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 22:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 22:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 22:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 22:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 22:50:10] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 22:50:10] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 22:50:10] VoiceHealth: === Voice Health Check finished ===
- [2026-03-16 23:51:42] VoiceHealth: === Voice Health Check started ===
- [2026-03-16 23:51:42] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-16 23:51:42] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 00:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 00:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 00:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 01:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 01:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 01:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 01:53:30] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 01:53:30] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 01:53:30] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 05:21:10] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 05:21:10] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 05:21:10] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 06:58:06] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 06:58:06] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 06:58:06] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 11:02:17] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 11:02:17] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 11:02:17] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 11:02:19] Onboarding: === Customer Onboarding started ===
- [2026-03-17 11:02:19] Feedback: === Customer Feedback Collection started ===
- [2026-03-17 11:02:19] DesignSystem: === AI Design System generation started ===
- [2026-03-17 11:02:19] DesignSystem: Theme spec missing – aborting.
- [2026-03-17 11:02:19] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-17 11:02:19] Feedback: Feedback collection failed: relation "purchases" does not exist
LINE 3:         FROM purchases
                     ^

- [2026-03-17 11:02:19] Onboarding: === Customer Onboarding finished ===
- [2026-03-17 11:02:19] Feedback: === Customer Feedback Collection finished ===
- [2026-03-17 12:03:20] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 12:03:20] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 12:03:20] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 12:03:21] Onboarding: === Customer Onboarding started ===
- [2026-03-17 12:03:21] Churn: === Churn Prevention started ===
- [2026-03-17 12:03:21] DesignSystem: === AI Design System generation started ===
- [2026-03-17 12:03:21] DesignSystem: Theme spec missing – aborting.
- [2026-03-17 12:03:21] Churn: Churn prevention failed: relation "customers" does not exist
LINE 3:         FROM customers
                     ^

- [2026-03-17 12:03:21] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-17 12:03:21] Churn: === Churn Prevention finished ===
- [2026-03-17 12:03:21] Onboarding: === Customer Onboarding finished ===
- [2026-03-17 16:07:24] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 16:07:24] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 16:07:24] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 16:07:26] Onboarding: === Customer Onboarding started ===
- [2026-03-17 16:07:26] DesignSystem: === AI Design System generation started ===
- [2026-03-17 16:07:26] DesignSystem: Theme spec missing – aborting.
- [2026-03-17 16:07:27] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-17 16:07:27] Onboarding: === Customer Onboarding finished ===
- [2026-03-17 18:10:02] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 18:10:02] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 18:10:02] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 19:10:30] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 19:10:30] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 19:10:30] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 20:11:36] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 20:11:36] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 20:11:36] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 21:12:37] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 21:12:37] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 21:12:37] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 22:14:13] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 22:14:13] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 22:14:13] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 22:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 22:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 22:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 23:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-17 23:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-17 23:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-17 23:00:04] DesignSystem: === AI Design System generation started ===
- [2026-03-17 23:00:04] Onboarding: === Customer Onboarding started ===
- [2026-03-17 23:00:04] DesignSystem: Theme spec missing – aborting.
- [2026-03-17 23:00:04] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-17 23:00:04] Onboarding: === Customer Onboarding finished ===
- [2026-03-18 01:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 01:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 01:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 02:17:10] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 02:17:10] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 02:17:10] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 03:18:31] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 03:18:31] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 03:18:31] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 03:21:39] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 03:21:39] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 03:21:39] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 05:20:13] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 05:20:13] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 05:20:13] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 06:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 06:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 06:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 06:00:04] Onboarding: === Customer Onboarding started ===
- [2026-03-18 06:00:04] DesignSystem: === AI Design System generation started ===
- [2026-03-18 06:00:04] DesignSystem: Theme spec missing – aborting.
- [2026-03-18 06:00:04] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-18 06:00:04] Onboarding: === Customer Onboarding finished ===
- [2026-03-18 06:21:57] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 06:21:57] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 06:21:57] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 08:23:29] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 08:23:29] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 08:23:29] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 11:26:51] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 11:26:51] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 11:26:51] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 12:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 12:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 12:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 12:00:04] Churn: === Churn Prevention started ===
- [2026-03-18 12:00:04] Onboarding: === Customer Onboarding started ===
- [2026-03-18 12:00:04] DesignSystem: === AI Design System generation started ===
- [2026-03-18 12:00:04] DesignSystem: Theme spec missing – aborting.
- [2026-03-18 12:00:04] Churn: Churn prevention failed: relation "customers" does not exist
LINE 3:         FROM customers
                     ^

- [2026-03-18 12:00:04] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-18 12:00:04] Churn: === Churn Prevention finished ===
- [2026-03-18 12:00:04] Onboarding: === Customer Onboarding finished ===
- [2026-03-18 12:27:27] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 12:27:28] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 12:27:28] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 14:13:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 14:13:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 14:13:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 15:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 15:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 15:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 17:31:57] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 17:31:57] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 17:31:57] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 17:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 17:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 17:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 18:33:29] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 18:33:29] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 18:33:29] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 19:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 19:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 19:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 19:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 19:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 19:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 19:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 19:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 19:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 19:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 19:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 19:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 20:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 20:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 20:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 20:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-18 20:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-18 20:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-18 20:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-18 20:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-18 20:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 20:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 20:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 20:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 20:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 20:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 20:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 20:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 20:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 20:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 20:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 20:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 20:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 20:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 20:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 21:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 21:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 21:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 21:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-18 21:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-18 21:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-18 21:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-18 21:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-18 21:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 21:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 21:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 21:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 21:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 21:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 21:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 21:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 21:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 21:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 21:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 21:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 21:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 21:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 21:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 22:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 22:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 22:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 22:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-18 22:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-18 22:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-18 22:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-18 22:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-18 22:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 22:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 22:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 22:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 22:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 22:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 22:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 22:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 22:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 22:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 22:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 22:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 22:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 22:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 22:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 23:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 23:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 23:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 23:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-18 23:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-18 23:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-18 23:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-18 23:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-18 23:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 23:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 23:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 23:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 23:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 23:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 23:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 23:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 23:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 23:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 23:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 23:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-18 23:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-18 23:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-18 23:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 00:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 00:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 00:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 00:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 00:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 00:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 00:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 00:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 00:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 00:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 00:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 00:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 00:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 00:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 00:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 00:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 00:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 00:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 00:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 00:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 00:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 00:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 00:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 01:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 01:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 01:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 01:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 01:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 01:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 01:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 01:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 01:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 01:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 01:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 01:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 01:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 01:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 01:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 01:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 01:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 01:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 01:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 01:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 01:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 01:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 01:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 02:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 02:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 02:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 02:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 02:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 02:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 02:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 02:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 02:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 02:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 02:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 02:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 02:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 02:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 02:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 02:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 02:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 02:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 02:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 02:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 02:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 02:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 02:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 03:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 03:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 03:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 03:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 03:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 03:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 03:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 03:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 03:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 03:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 03:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 03:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 03:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 03:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 03:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 03:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 03:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 03:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 03:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 03:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 03:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 03:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 03:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 04:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 04:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 04:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 04:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 04:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 04:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 04:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 04:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 04:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 04:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 04:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 04:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 04:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 04:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 04:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 04:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 04:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 04:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 04:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 04:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 04:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 04:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 04:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 05:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 05:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 05:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 05:00:00] SecurityPatch: === Security Patch Automation started ===
- [2026-03-19 05:00:00] SecurityPatch: Running: brew upgrade
- [2026-03-19 05:00:00] SecurityPatch: Unexpected error: [Errno 2] No such file or directory: 'brew'
- [2026-03-19 05:00:00] SecurityPatch: === Security Patch Automation finished ===
- [2026-03-19 05:00:02] SalesPlaybooks: === Sales Playbooks Agent started ===
- [2026-03-19 05:00:02] SalesPlaybooks: Unhandled exception in SalesPlaybooksAgent: relation "deals" does not exist
LINE 10:         FROM deals d
                      ^

- [2026-03-19 05:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 05:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 05:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 05:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 05:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 05:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 05:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 05:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 05:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 05:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 05:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 05:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 05:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 05:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 05:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 05:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 05:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 05:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 05:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 05:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 06:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 06:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 06:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 06:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-19 06:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-19 06:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 06:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 06:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 06:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 06:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 06:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 06:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 06:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 06:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 06:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 06:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 06:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 06:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 06:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 06:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 06:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 06:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 06:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 07:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 07:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 07:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 07:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-19 07:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-19 07:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 07:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 07:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 07:00:06] ChurnPredict: === Predictive Churn Modeling started ===
- [2026-03-19 07:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 07:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 07:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 07:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 07:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 07:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 07:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 07:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 07:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 07:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 07:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 07:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 07:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 07:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 07:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 08:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 08:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 08:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 08:00:01] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-03-19 08:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 08:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 08:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 08:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 08:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 08:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 08:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 08:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 08:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 08:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 08:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 08:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 08:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 08:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 08:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 08:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 08:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 08:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 08:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 08:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 09:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 09:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 09:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 09:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-19 09:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-19 09:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 09:00:03] MarketTrend: === Market Trend Monitoring started ===
- [2026-03-19 09:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 09:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 09:00:09] MarketTrend: Scraped hubspot: N/A
- [2026-03-19 09:00:10] MarketTrend: Scraped salesforce: N/A
- [2026-03-19 09:00:14] MarketTrend: Scraped pipedrive: N/A
- [2026-03-19 09:00:15] MarketTrend: Scraped zoho: â¹800
- [2026-03-19 09:00:17] MarketTrend: Scraped close: Core Features (CRM)
- [2026-03-19 09:00:17] MarketTrend: GPT-4 analysis failed: 

You tried to access openai.ChatCompletion, but this is no longer supported in openai>=1.0.0 - see the README at https://github.com/openai/openai-python for the API.

You can run `openai migrate` to automatically upgrade your codebase to use the 1.0.0 interface. 

Alternatively, you can pin your installation to the old version, e.g. `pip install openai==0.28`

A detailed migration guide is available here: https://github.com/openai/openai-python/discussions/742

- [2026-03-19 09:00:17] MarketTrend: SendGrid key missing – cannot send alert
- [2026-03-19 09:00:17] MarketTrend: Market trend analysis completed.
- [2026-03-19 09:00:17] MarketTrend: === Market Trend Monitoring finished ===
- [2026-03-19 09:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 09:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 09:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 09:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 09:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 09:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 09:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 09:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 09:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 09:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 09:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 09:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 09:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 09:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 09:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 10:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 10:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 10:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 10:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 10:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 10:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 10:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 10:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 10:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 10:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 10:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 10:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 10:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 10:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 10:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 10:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 10:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 10:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 10:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 10:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 10:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 10:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 10:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 11:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 11:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 11:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 11:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 11:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 11:00:02] Feedback: === Customer Feedback Collection started ===
- [2026-03-19 11:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 11:00:03] Feedback: Feedback collection failed: relation "purchases" does not exist
LINE 3:         FROM purchases
                     ^

- [2026-03-19 11:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 11:00:03] Feedback: === Customer Feedback Collection finished ===
- [2026-03-19 11:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 11:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 11:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 11:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 11:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 11:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 11:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 11:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 11:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 11:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 11:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 11:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 11:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 11:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 11:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 11:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 12:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 12:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 12:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 12:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 12:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 12:00:02] Churn: === Churn Prevention started ===
- [2026-03-19 12:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 12:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 12:00:03] Churn: Churn prevention failed: relation "customers" does not exist
LINE 3:         FROM customers
                     ^

- [2026-03-19 12:00:03] Churn: === Churn Prevention finished ===
- [2026-03-19 12:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 12:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 12:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 12:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 12:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 12:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 12:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 12:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 12:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 12:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 12:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 12:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 12:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 12:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 12:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 12:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 13:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 13:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 13:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 13:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 13:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 13:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 13:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 13:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 13:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 13:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 13:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 13:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 13:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 13:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 13:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 13:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 13:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 13:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 13:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 13:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 13:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 13:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 13:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 14:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 14:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 14:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 14:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 14:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 14:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 14:00:02] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 14:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 14:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 14:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 14:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 14:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 14:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 14:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 14:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 14:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 14:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 14:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 14:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 14:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 14:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 14:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 14:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 15:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 15:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 15:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 15:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 15:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 15:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 15:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 15:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 15:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 15:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 15:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 15:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 15:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 15:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 15:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 15:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 15:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 15:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 15:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 15:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 15:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 15:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 15:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 16:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 16:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 16:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 16:00:03] DesignSystem: === AI Design System generation started ===
- [2026-03-19 16:00:03] Onboarding: === Customer Onboarding started ===
- [2026-03-19 16:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 16:00:03] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 16:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 16:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 16:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 16:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 16:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 16:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 16:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 16:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 16:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 16:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 16:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 16:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 16:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 16:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 16:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 16:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 17:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 17:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 17:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 17:00:05] Onboarding: === Customer Onboarding started ===
- [2026-03-19 17:00:05] DesignSystem: === AI Design System generation started ===
- [2026-03-19 17:00:05] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 17:00:05] Onboarding: Onboarding failed: relation "subscriptions" does not exist
LINE 1: SELECT * FROM subscriptions WHERE created_at >= NOW() - INTE...
                      ^

- [2026-03-19 17:00:05] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 17:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 17:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 17:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 17:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 17:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 17:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 17:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 17:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 17:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 17:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 17:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 17:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 17:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 17:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 17:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 18:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 18:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 18:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 18:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-19 18:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-19 18:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 18:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-19 18:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 18:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 18:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 18:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 18:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 18:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 18:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 18:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 18:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 18:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 18:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 18:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 18:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 18:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 18:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 18:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 19:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 19:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 19:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 19:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-19 19:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-19 19:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 19:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-19 19:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 19:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 19:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 19:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 19:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 19:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 19:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 19:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 19:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 19:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 19:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 19:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 19:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 19:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 19:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 19:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 20:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 20:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 20:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 20:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-19 20:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-19 20:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 20:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-19 20:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 20:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 20:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 20:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 20:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 20:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 20:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 20:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 20:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 20:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 20:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 20:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 20:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 20:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 20:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 20:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 21:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 21:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 21:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 21:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-19 21:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-19 21:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 21:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-19 21:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 21:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 21:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 21:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 21:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 21:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 21:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 21:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 21:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 21:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 21:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 21:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 21:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 21:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 21:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 21:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 22:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 22:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 22:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 22:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-19 22:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-19 22:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 22:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-19 22:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 22:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 22:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 22:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 22:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 22:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 22:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 22:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 22:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 22:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 22:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 22:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 22:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 22:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 22:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 22:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 23:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 23:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 23:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 23:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-19 23:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-19 23:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-19 23:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-19 23:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-19 23:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 23:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 23:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 23:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 23:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 23:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 23:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 23:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 23:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 23:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 23:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 23:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-19 23:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-19 23:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-19 23:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 00:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 00:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 00:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 00:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-20 00:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-20 00:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-20 00:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 00:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-20 00:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 00:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 00:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 00:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 00:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 00:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 00:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 00:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 00:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 06:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 06:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 06:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 07:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 07:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 07:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 07:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-20 07:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-20 07:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-20 07:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 07:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-20 07:00:04] ChurnPredict: === Predictive Churn Modeling started ===
- [2026-03-20 07:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 07:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 07:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 07:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 07:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 07:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 07:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 07:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 07:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 07:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 07:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 07:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 07:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 07:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 07:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 08:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 08:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 08:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 08:00:00] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-03-20 08:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-20 08:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-20 08:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-20 08:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 08:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-20 08:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 08:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 08:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 08:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 08:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 08:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 08:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 08:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 08:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 08:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 08:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 08:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 08:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 08:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 08:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 09:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 09:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 09:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 09:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-20 09:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-20 09:00:01] MarketTrend: === Market Trend Monitoring started ===
- [2026-03-20 09:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-20 09:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 09:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-20 09:00:14] MarketTrend: Scraped hubspot: N/A
- [2026-03-20 09:00:15] MarketTrend: Scraped salesforce: N/A
- [2026-03-20 09:00:16] MarketTrend: Scraped pipedrive: N/A
- [2026-03-20 09:00:17] MarketTrend: Scraped zoho: â¹800
- [2026-03-20 09:00:19] MarketTrend: Scraped close: Core Features (CRM)
- [2026-03-20 09:00:19] MarketTrend: GPT-4 analysis failed: 

You tried to access openai.ChatCompletion, but this is no longer supported in openai>=1.0.0 - see the README at https://github.com/openai/openai-python for the API.

You can run `openai migrate` to automatically upgrade your codebase to use the 1.0.0 interface. 

Alternatively, you can pin your installation to the old version, e.g. `pip install openai==0.28`

A detailed migration guide is available here: https://github.com/openai/openai-python/discussions/742

- [2026-03-20 09:00:19] MarketTrend: SendGrid key missing – cannot send alert
- [2026-03-20 09:00:19] MarketTrend: Market trend analysis completed.
- [2026-03-20 09:00:19] MarketTrend: === Market Trend Monitoring finished ===
- [2026-03-20 09:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 09:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 09:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 09:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 09:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 09:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 09:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 09:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 09:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 09:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 09:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 09:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 09:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 09:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 09:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 10:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 10:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 10:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 10:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-20 10:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-20 10:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-20 10:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 10:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-20 10:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 10:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 10:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 10:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 10:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 10:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 10:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 10:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 10:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 10:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 10:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 10:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 10:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 10:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 10:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 11:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 11:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 11:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 11:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-20 11:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-20 11:00:01] Feedback: === Customer Feedback Collection started ===
- [2026-03-20 11:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-20 11:00:01] Feedback: Feedback collection failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 11:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 11:00:01] Feedback: === Customer Feedback Collection finished ===
- [2026-03-20 11:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-20 11:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 11:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 11:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 11:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 11:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 11:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 11:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 11:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 11:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 11:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 11:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 11:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 11:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 11:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 11:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 12:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 12:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 12:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 12:00:01] Churn: === Churn Prevention started ===
- [2026-03-20 12:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-20 12:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-20 12:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-20 12:00:01] Churn: Churn prevention failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 12:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 12:00:01] Churn: === Churn Prevention finished ===
- [2026-03-20 12:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-20 12:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 12:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 12:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 12:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 12:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 12:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 12:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 12:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 12:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 12:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 12:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 12:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 12:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 12:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 12:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 13:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 13:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 13:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 13:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-20 13:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-20 13:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-20 13:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 13:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-20 13:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 13:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 13:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 13:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 13:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 13:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 13:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 13:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 13:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 19:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 19:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 19:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 19:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 19:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 19:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 19:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 19:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 19:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 19:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 19:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 19:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 20:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 20:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 20:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 20:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-20 20:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-20 20:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-20 20:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 20:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-20 20:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 20:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 20:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 20:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 20:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 20:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 20:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 20:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 20:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 20:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 20:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 20:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 20:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 20:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 20:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 21:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 21:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 21:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 21:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-20 21:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-20 21:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-20 21:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 21:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-20 21:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 21:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 21:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 21:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 21:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 21:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 21:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 21:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 21:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 21:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 21:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 21:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 21:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 21:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 21:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 22:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 22:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 22:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 22:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-20 22:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-20 22:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-20 22:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 22:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-20 22:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 22:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 22:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 22:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 22:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 22:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 22:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 22:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 22:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 22:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 22:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 22:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 22:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 22:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 22:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 23:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 23:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 23:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 23:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-20 23:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-20 23:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-20 23:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-20 23:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-20 23:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 23:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 23:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 23:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 23:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 23:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 23:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 23:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 23:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 23:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 23:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 23:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-20 23:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-20 23:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-20 23:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 00:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 00:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 00:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 00:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-21 00:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-21 00:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-21 00:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-21 00:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-21 00:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 00:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 00:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 00:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 00:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 00:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 00:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 00:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 00:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 00:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 00:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 00:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 00:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 00:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 00:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 01:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 01:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 01:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 01:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-21 01:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-21 01:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-21 01:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-21 01:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-21 01:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 01:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 01:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 01:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 01:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 01:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 01:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 01:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 01:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 01:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 01:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 01:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 01:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 01:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 01:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 02:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 02:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 02:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 02:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-21 02:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-21 02:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-21 02:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-21 02:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-21 02:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 02:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 02:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 02:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 02:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 02:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 02:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 02:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 02:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 02:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 02:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 02:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 02:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 02:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 02:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 03:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 03:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 03:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 03:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-21 03:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-21 03:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-21 03:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-21 03:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-21 03:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 03:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 03:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 03:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 03:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 03:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 03:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 03:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 03:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 03:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 03:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 03:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 03:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 03:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 03:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 04:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 04:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 04:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 04:00:01] DesignSystem: === AI Design System generation started ===
- [2026-03-21 04:00:01] Onboarding: === Customer Onboarding started ===
- [2026-03-21 04:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-03-21 04:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-21 04:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-03-21 04:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 04:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 04:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 04:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 04:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 04:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-21 04:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-21 04:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-21 04:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-24 03:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-24 03:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-24 03:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-24 03:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-24 03:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-24 03:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-24 04:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-24 04:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-24 04:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-24 04:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-24 04:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-24 04:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-24 04:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-24 04:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-24 04:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-24 04:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-24 04:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-24 04:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-24 04:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-24 04:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-24 04:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-24 04:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-24 04:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-24 04:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-24 04:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-24 04:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-24 04:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-24 04:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-24 04:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-24 05:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-24 05:00:00] SecurityPatch: === Security Patch Automation started ===
- [2026-03-24 05:00:00] SecurityPatch: Running: brew upgrade
- [2026-03-24 05:00:00] SecurityPatch: Unexpected error: [Errno 2] No such file or directory: 'brew'
- [2026-03-24 05:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-24 05:00:00] SecurityPatch: === Security Patch Automation finished ===
- [2026-03-24 05:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-24 05:00:02] SalesPlaybooks: === Sales Playbooks Agent started ===
- [2026-03-24 05:00:02] SalesPlaybooks: Unhandled exception in SalesPlaybooksAgent: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-24 05:00:02] DesignSystem: === AI Design System generation started ===
- [2026-03-24 05:00:02] Onboarding: === Customer Onboarding started ===
- [2026-03-24 05:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-03-24 05:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-24 05:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-03-24 05:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-24 05:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-24 05:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 01:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 01:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 01:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 01:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 01:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 01:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 01:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 01:40:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 01:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 01:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 01:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 01:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 02:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 02:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 02:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 02:00:07] DesignSystem: === AI Design System generation started ===
- [2026-03-25 02:00:07] DesignSystem: Theme spec missing – aborting.
- [2026-03-25 02:00:07] Onboarding: === Customer Onboarding started ===
- [2026-03-25 02:00:07] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-25 02:00:07] Onboarding: === Customer Onboarding finished ===
- [2026-03-25 02:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 02:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 02:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 03:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 03:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 03:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 03:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 03:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 03:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 11:50:16] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 11:50:29] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 11:50:29] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 21:50:07] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 21:50:14] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 21:50:14] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 22:00:50] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 22:00:51] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 22:00:51] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 22:01:09] DesignSystem: === AI Design System generation started ===
- [2026-03-25 22:01:09] DesignSystem: Theme spec missing – aborting.
- [2026-03-25 22:01:12] Onboarding: === Customer Onboarding started ===
- [2026-03-25 22:01:14] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-25 22:01:14] Onboarding: === Customer Onboarding finished ===
- [2026-03-25 22:11:17] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 22:11:40] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 22:11:40] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 22:21:16] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 22:21:19] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 22:21:19] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 22:30:18] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 22:31:23] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 22:31:23] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 22:40:03] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 22:40:05] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 22:40:05] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 22:50:14] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 22:50:19] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 22:50:19] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 23:00:46] DesignSystem: === AI Design System generation started ===
- [2026-03-25 23:00:50] DesignSystem: Theme spec missing – aborting.
- [2026-03-25 23:01:02] VoiceHealth: === Voice Health Check started ===
- [2026-03-25 23:01:10] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-03-25 23:01:12] VoiceHealth: === Voice Health Check finished ===
- [2026-03-25 23:02:08] Onboarding: === Customer Onboarding started ===
- [2026-03-25 23:02:14] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-03-25 23:02:14] Onboarding: === Customer Onboarding finished ===
- [2026-04-02 13:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 13:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 13:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 13:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 13:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 13:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-02 13:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-02 13:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-02 13:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-02 13:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-02 13:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 13:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 13:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 13:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 13:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 13:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 13:20:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 13:20:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 13:20:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 13:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 13:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 13:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 13:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 13:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 13:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 13:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 13:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 13:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 13:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 13:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 13:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 13:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 13:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 13:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 13:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 14:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 14:00:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 14:00:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 14:00:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 14:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 14:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-02 14:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-02 14:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-02 14:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-02 14:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-02 14:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 14:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 14:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 14:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 14:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 14:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 14:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 14:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 14:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 14:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 14:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 14:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 14:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 14:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 14:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 14:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 14:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 14:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 14:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 14:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 14:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 14:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 14:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 14:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 14:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 15:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 15:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 15:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 15:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 15:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 15:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-02 15:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-02 15:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-02 15:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-02 15:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-02 15:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 15:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 15:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 15:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 15:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 15:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 15:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 15:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 15:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 15:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 15:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 15:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 15:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 15:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 15:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 15:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 15:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 15:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 15:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 15:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 15:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 15:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 15:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 15:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 15:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 16:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 16:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 16:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 16:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 16:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 16:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-02 16:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-02 16:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-02 16:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-02 16:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-02 16:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 16:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 16:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 16:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 16:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 16:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 16:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 16:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 16:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 16:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 16:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 16:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 16:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 16:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 16:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 16:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 16:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 16:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 16:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 16:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 16:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 16:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 16:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 16:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 16:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 17:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 17:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 17:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 17:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 17:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 17:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-02 17:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-02 17:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-02 17:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-02 17:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-02 17:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 17:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 17:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 17:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 17:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 17:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 17:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 17:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 17:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 17:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 17:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 17:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 17:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 17:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 17:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 17:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 17:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 17:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 17:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 17:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 17:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 17:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 17:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 17:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 17:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 18:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 18:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 18:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 18:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 18:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 18:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-02 18:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-02 18:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-02 18:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-02 18:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-02 18:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 18:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 18:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 18:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 18:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 18:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 18:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 18:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 18:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 18:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 18:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 18:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 18:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 18:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 18:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 18:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 18:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 18:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 18:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 18:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 18:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 18:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 18:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 18:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 18:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 19:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 19:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 19:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 19:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 19:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 19:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-02 19:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-02 19:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-02 19:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-02 19:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-02 19:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 19:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 19:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 19:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 19:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 19:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 19:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 19:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 19:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 19:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 19:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 19:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 19:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 19:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 19:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 19:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 19:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 19:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 19:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 19:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 19:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 19:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 19:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 19:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 19:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 20:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 20:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 20:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 20:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 20:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 20:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-02 20:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-02 20:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-02 20:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-02 20:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-02 20:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 20:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 20:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 20:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 20:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 20:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 20:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 20:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 20:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 20:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 20:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 20:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 20:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 20:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 20:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 20:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 20:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 20:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 20:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 20:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 20:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 20:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 20:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 20:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 20:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 21:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 21:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 21:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 21:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 21:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 21:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-02 21:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-02 21:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-02 21:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-02 21:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-02 21:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 21:10:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 21:10:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 21:10:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 21:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 21:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 21:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 21:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 21:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 21:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 21:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 21:30:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 21:30:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 21:30:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 21:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 21:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 21:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 21:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 21:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 21:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 21:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 21:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 21:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 21:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 21:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 22:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 22:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 22:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 22:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 22:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 22:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-02 22:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-02 22:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-02 22:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-02 22:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-02 22:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 22:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 22:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 22:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 22:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 22:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 22:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 22:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 22:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 22:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 22:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 22:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 22:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 22:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 22:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 22:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 22:40:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 22:40:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 22:40:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 22:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 22:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 22:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 22:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 22:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 22:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 23:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 23:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 23:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 23:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 23:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 23:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-02 23:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-02 23:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-02 23:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-02 23:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-02 23:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 23:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 23:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 23:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 23:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 23:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 23:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 23:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 23:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 23:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 23:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 23:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 23:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 23:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 23:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 23:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 23:40:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 23:40:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 23:40:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 23:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-02 23:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-02 23:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-02 23:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-02 23:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-02 23:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 00:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 00:00:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 00:00:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 00:00:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 00:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 00:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-03 00:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 00:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-03 00:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 00:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 00:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 00:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 00:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 00:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 00:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 00:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 00:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 00:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 00:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 00:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 00:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 00:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 00:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 00:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 00:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 00:40:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 00:40:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 00:40:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 00:40:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 00:40:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 00:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 00:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 00:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 00:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 00:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 01:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 01:00:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 01:00:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 01:00:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 01:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 01:00:03] Onboarding: === Customer Onboarding started ===
- [2026-04-03 01:00:03] DesignSystem: === AI Design System generation started ===
- [2026-04-03 01:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 01:00:03] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 01:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 01:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 01:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 01:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 01:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 01:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 01:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 01:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 01:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 01:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 01:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 01:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 01:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 01:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 01:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 01:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 01:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 01:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 01:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 01:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 01:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 01:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 01:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 01:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 01:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 01:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 02:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 02:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 02:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 02:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 02:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 02:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-03 02:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-03 02:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 02:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 02:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 02:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 02:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 02:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 02:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 02:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 02:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 02:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 02:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 02:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 02:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 02:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 02:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 02:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 02:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 02:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 02:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 02:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 02:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 02:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 02:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 02:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 02:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 02:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 02:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 02:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 03:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 03:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 03:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 03:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 03:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 03:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-03 03:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-03 03:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 03:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 03:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 03:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 03:10:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 03:10:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 03:10:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 03:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 03:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 03:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 03:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 03:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 03:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 03:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 03:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 03:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 03:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 03:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 03:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 03:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 03:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 03:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 03:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 03:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 03:50:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 03:50:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 03:50:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 03:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 04:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 04:00:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 04:00:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 04:00:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 04:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 04:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-03 04:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-03 04:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 04:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 04:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 04:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 04:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 04:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 04:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 04:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 04:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 04:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 04:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 04:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 04:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 04:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 04:30:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 04:30:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 04:30:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 04:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 04:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 04:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 04:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 04:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 04:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 04:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 04:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 04:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 04:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 04:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 05:00:00] SecurityPatch: === Security Patch Automation started ===
- [2026-04-03 05:00:00] SecurityPatch: Running: brew upgrade
- [2026-04-03 05:00:00] SecurityPatch: Unexpected error: [Errno 2] No such file or directory: 'brew'
- [2026-04-03 05:00:00] SecurityPatch: === Security Patch Automation finished ===
- [2026-04-03 05:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 05:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 05:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 05:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 05:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 05:00:02] SalesPlaybooks: === Sales Playbooks Agent started ===
- [2026-04-03 05:00:02] SalesPlaybooks: Unhandled exception in SalesPlaybooksAgent: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 05:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-03 05:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-03 05:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 05:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 05:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 05:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 05:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 05:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 05:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 05:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 05:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 05:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 05:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 05:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 05:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 05:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 05:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 05:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 05:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 05:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 05:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 05:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 05:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 05:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 05:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 05:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 05:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 05:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 05:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 05:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 06:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 06:00:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 06:00:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 06:00:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 06:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 06:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-03 06:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-03 06:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 06:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 06:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 06:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 06:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 06:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 06:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 06:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 06:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 06:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 06:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 06:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 06:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 06:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 06:30:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 06:30:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 06:30:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 06:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 06:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 06:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 06:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 06:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 06:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 06:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 06:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 06:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 06:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 06:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 07:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 07:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 07:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 07:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 07:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 07:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-03 07:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-03 07:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 07:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 07:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 07:00:18] ChurnPredict: === Predictive Churn Modeling started ===
- [2026-04-03 07:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 07:10:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 07:10:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 07:10:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 07:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 07:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 07:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 07:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 07:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 07:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 07:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 07:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 07:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 07:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 07:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 07:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 07:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 07:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 07:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 07:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 07:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 07:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 07:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 07:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 07:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 08:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 08:00:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 08:00:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 08:00:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 08:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 08:00:01] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-04-03 08:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-03 08:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-03 08:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 08:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 08:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 08:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 08:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 08:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 08:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 08:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 08:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 08:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 08:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 08:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 08:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 08:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 08:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 08:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 08:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 08:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 08:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 08:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 08:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 08:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 08:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 08:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 08:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 08:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 08:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 08:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 09:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 09:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 09:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 09:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 09:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 09:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-03 09:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-03 09:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 09:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 09:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 09:00:02] MarketTrend: === Market Trend Monitoring started ===
- [2026-04-03 09:00:04] MarketTrend: Scraped hubspot: N/A
- [2026-04-03 09:00:06] MarketTrend: Scraped salesforce: N/A
- [2026-04-03 09:00:09] MarketTrend: Scraped pipedrive: N/A
- [2026-04-03 09:00:10] MarketTrend: Scraped zoho: â¹800
- [2026-04-03 09:00:11] MarketTrend: Scraped close: Core Features (CRM)
- [2026-04-03 09:00:11] MarketTrend: GPT-4 analysis failed: 

You tried to access openai.ChatCompletion, but this is no longer supported in openai>=1.0.0 - see the README at https://github.com/openai/openai-python for the API.

You can run `openai migrate` to automatically upgrade your codebase to use the 1.0.0 interface. 

Alternatively, you can pin your installation to the old version, e.g. `pip install openai==0.28`

A detailed migration guide is available here: https://github.com/openai/openai-python/discussions/742

- [2026-04-03 09:00:11] MarketTrend: SendGrid key missing – cannot send alert
- [2026-04-03 09:00:11] MarketTrend: Market trend analysis completed.
- [2026-04-03 09:00:11] MarketTrend: === Market Trend Monitoring finished ===
- [2026-04-03 09:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 09:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 09:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 09:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 09:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 09:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 09:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 09:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 09:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 09:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 09:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 09:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 09:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 09:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 09:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 09:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 09:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 09:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 09:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 09:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 09:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 09:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 09:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 09:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 09:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 10:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 10:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 10:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 10:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 10:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 10:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-03 10:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-03 10:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 10:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 10:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 10:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 10:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 10:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 10:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 10:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 10:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 10:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 10:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 10:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 10:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 10:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 10:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 10:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 10:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 10:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 10:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 10:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 10:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 10:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 10:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 10:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 10:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 10:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 10:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 10:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 11:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 11:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 11:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 11:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 11:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 11:00:02] Feedback: === Customer Feedback Collection started ===
- [2026-04-03 11:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-03 11:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-03 11:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 11:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 11:00:02] Feedback: Feedback collection failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 11:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 11:00:02] Feedback: === Customer Feedback Collection finished ===
- [2026-04-03 11:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 11:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 11:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 11:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 11:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 11:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 11:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 11:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 11:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 11:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 11:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 11:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 11:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 11:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 11:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 11:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 11:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 11:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 11:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 11:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 11:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 11:50:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 11:50:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 11:50:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 11:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 12:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 12:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 12:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 12:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 12:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 12:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-03 12:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-03 12:00:01] Churn: === Churn Prevention started ===
- [2026-04-03 12:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 12:00:01] Churn: Churn prevention failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 12:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 12:00:01] Churn: === Churn Prevention finished ===
- [2026-04-03 12:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 12:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 12:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 12:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 12:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 12:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 12:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 12:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 12:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 12:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 12:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 12:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 12:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 12:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 12:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 12:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 12:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 12:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 12:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 12:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 12:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 12:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 12:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 12:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 12:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 12:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 13:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 13:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 13:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 13:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 13:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 13:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-03 13:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-03 13:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 13:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 13:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 13:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 13:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 13:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 13:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 13:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 13:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 13:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 13:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 13:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 13:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 13:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 13:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 13:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 13:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 13:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 13:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 13:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 13:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 13:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 13:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 13:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 13:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 13:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 13:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 13:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 14:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 14:00:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 14:00:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 14:00:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 14:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 14:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-03 14:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-03 14:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 14:00:03] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 14:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 14:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 14:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 14:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 14:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 14:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 14:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 14:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 14:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 14:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 14:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 14:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 14:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 14:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 14:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 14:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 14:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 14:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 14:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 14:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 14:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 14:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 14:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 14:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 14:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 14:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 15:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 15:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 15:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 15:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 15:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 15:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-03 15:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 15:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-03 15:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 15:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 15:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 15:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 15:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 15:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 15:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 15:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 15:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 15:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 15:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 15:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 15:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 15:30:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 15:30:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 15:30:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 15:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 15:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 15:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 15:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 15:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 15:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 15:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 15:50:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 15:50:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 15:50:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 15:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 16:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 16:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 16:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 16:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 16:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 16:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-03 16:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 16:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-03 16:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 16:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 16:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 16:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 16:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 16:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 16:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 16:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 16:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 16:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 16:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 16:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 16:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 16:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 16:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 16:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 16:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 16:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 16:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 16:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 16:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 16:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 16:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 16:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 16:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 16:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 16:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 17:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 17:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 17:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 17:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 17:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 17:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-03 17:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 17:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-03 17:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 17:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 17:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 17:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 17:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 17:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 17:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 17:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 17:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 17:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 17:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 17:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 17:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 17:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 17:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 17:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 17:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 17:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 17:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 17:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 17:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 17:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 17:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 17:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 17:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 17:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 17:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 18:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 18:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 18:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 18:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 18:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 18:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-03 18:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 18:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-03 18:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 18:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 18:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 18:10:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 18:10:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 18:10:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 18:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 18:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 18:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 18:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 18:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 18:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 18:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 18:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 18:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 18:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 18:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 18:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 18:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 18:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 18:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 18:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 18:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 18:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 18:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 18:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 18:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 19:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 19:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 19:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 19:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 19:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 19:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-03 19:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 19:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-03 19:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 19:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 19:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 19:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 19:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 19:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 19:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 19:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 19:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 19:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 19:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 19:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 19:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 19:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 19:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 19:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 19:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 19:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 19:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 19:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 19:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 19:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 19:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 19:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 19:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 19:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 19:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 20:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 20:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 20:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 20:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 20:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 20:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-03 20:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 20:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-03 20:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 20:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 20:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 20:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 20:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 20:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 20:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 20:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 20:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 20:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 20:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 20:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 20:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 20:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 20:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 20:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 20:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 20:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 20:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 20:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 20:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 20:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 20:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 20:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 20:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 20:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 20:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 21:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 21:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 21:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 21:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 21:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 21:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-03 21:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-03 21:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 21:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 21:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 21:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 21:10:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 21:10:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 21:10:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 21:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 21:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 21:20:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 21:20:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 21:20:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 21:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 21:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 21:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 21:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 21:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 21:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 21:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 21:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 21:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 21:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 21:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 21:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 21:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 21:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 21:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 21:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 22:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 22:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 22:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 22:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 22:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 22:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-03 22:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 22:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-03 22:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 22:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 22:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 22:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 22:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 22:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 22:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 22:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 22:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 22:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 22:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 22:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 22:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 22:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 22:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 22:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 22:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 22:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 22:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 22:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 22:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 22:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 22:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 22:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 22:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 22:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 22:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 23:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 23:00:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 23:00:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 23:00:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 23:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 23:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-03 23:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-03 23:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-03 23:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-03 23:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-03 23:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 23:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 23:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 23:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 23:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 23:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 23:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 23:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 23:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 23:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 23:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 23:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 23:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 23:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 23:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 23:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 23:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 23:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 23:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 23:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-03 23:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-03 23:50:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-03 23:50:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-03 23:50:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-03 23:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 00:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 00:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 00:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 00:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 00:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 00:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-04 00:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-04 00:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 00:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 00:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 00:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 00:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 00:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 00:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 00:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 00:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 00:20:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 00:20:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 00:20:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 00:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 00:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 00:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 00:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 00:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 00:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 00:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 00:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 00:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 00:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 00:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 00:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 00:50:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 00:50:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 00:50:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 00:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 01:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 01:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 01:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 01:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 01:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 01:00:03] DesignSystem: === AI Design System generation started ===
- [2026-04-04 01:00:03] Onboarding: === Customer Onboarding started ===
- [2026-04-04 01:00:03] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 01:00:03] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 01:00:03] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 01:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 01:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 01:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 01:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 01:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 01:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 01:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 01:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 01:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 01:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 01:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 01:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 01:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 01:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 01:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 01:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 01:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 01:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 01:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 01:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 01:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 01:50:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 01:50:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 01:50:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 01:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 02:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 02:00:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 02:00:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 02:00:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 02:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 02:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-04 02:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-04 02:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 02:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 02:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 02:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 02:10:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 02:10:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 02:10:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 02:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 02:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 02:20:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 02:20:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 02:20:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 02:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 02:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 02:30:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 02:30:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 02:30:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 02:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 02:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 02:40:00] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 02:40:00] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 02:40:00] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 02:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 02:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 02:50:01] VoiceHealth: CDP connection error: [Errno 61] Connection refused
- [2026-04-04 02:50:01] VoiceHealth: Chrome CDP endpoint NOT reachable.
- [2026-04-04 02:50:01] VoiceHealth: Attempting to re‑attach Chrome CDP tab (manual action may be required).
- [2026-04-04 02:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 03:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 03:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 03:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 03:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 03:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 03:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 03:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 03:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 03:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 03:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 03:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 03:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 03:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 03:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 03:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 03:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 03:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 03:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 03:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 03:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 03:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 03:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 03:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 04:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 04:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 04:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 04:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 04:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 04:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 04:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 04:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 04:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 04:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 04:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 04:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 04:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 04:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 04:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 04:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 04:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 04:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 04:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 04:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 04:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 04:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 04:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 05:00:00] SecurityPatch: === Security Patch Automation started ===
- [2026-04-04 05:00:00] SecurityPatch: Running: brew upgrade
- [2026-04-04 05:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 05:00:00] SecurityPatch: Unexpected error: [Errno 2] No such file or directory: 'brew'
- [2026-04-04 05:00:00] SecurityPatch: === Security Patch Automation finished ===
- [2026-04-04 05:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 05:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 05:00:01] SalesPlaybooks: === Sales Playbooks Agent started ===
- [2026-04-04 05:00:01] SalesPlaybooks: Unhandled exception in SalesPlaybooksAgent: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 05:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 05:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 05:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 05:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 05:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 05:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 05:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 05:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 05:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 05:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 05:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 05:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 05:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 05:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 05:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 05:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 05:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 05:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 05:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 05:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 06:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 06:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 06:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 06:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 06:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 06:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 06:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 06:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 06:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 06:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 06:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 06:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 06:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 06:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 06:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 06:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 06:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 06:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 06:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 06:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 06:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 06:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 06:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 07:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 07:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 07:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 07:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 07:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 07:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 07:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 07:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 07:00:15] ChurnPredict: === Predictive Churn Modeling started ===
- [2026-04-04 07:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 07:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 07:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 07:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 07:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 07:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 07:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 07:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 07:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 07:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 07:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 07:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 07:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 07:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 07:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 08:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 08:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 08:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 08:00:00] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-04-04 08:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 08:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 08:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 08:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 08:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 08:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 08:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 08:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 08:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 08:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 08:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 08:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 08:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 08:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 08:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 08:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 08:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 08:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 08:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 08:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 09:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 09:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 09:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 09:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 09:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 09:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 09:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 09:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 09:00:01] MarketTrend: === Market Trend Monitoring started ===
- [2026-04-04 09:00:01] MarketTrend: Scraped hubspot: N/A
- [2026-04-04 09:00:02] MarketTrend: Scraped salesforce: N/A
- [2026-04-04 09:00:04] MarketTrend: Scraped pipedrive: N/A
- [2026-04-04 09:00:05] MarketTrend: Scraped zoho: â¹800
- [2026-04-04 09:00:06] MarketTrend: Scraped close: Core Features (CRM)
- [2026-04-04 09:00:06] MarketTrend: GPT-4 analysis failed: 

You tried to access openai.ChatCompletion, but this is no longer supported in openai>=1.0.0 - see the README at https://github.com/openai/openai-python for the API.

You can run `openai migrate` to automatically upgrade your codebase to use the 1.0.0 interface. 

Alternatively, you can pin your installation to the old version, e.g. `pip install openai==0.28`

A detailed migration guide is available here: https://github.com/openai/openai-python/discussions/742

- [2026-04-04 09:00:06] MarketTrend: SendGrid key missing – cannot send alert
- [2026-04-04 09:00:06] MarketTrend: Market trend analysis completed.
- [2026-04-04 09:00:06] MarketTrend: === Market Trend Monitoring finished ===
- [2026-04-04 09:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 09:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 09:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 09:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 09:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 09:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 09:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 09:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 09:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 09:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 09:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 09:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 09:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 09:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 09:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 10:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 10:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 10:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 10:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 10:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 10:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 10:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 10:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 10:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 10:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 10:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 10:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 10:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 10:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 10:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 10:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 10:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 16:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 16:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 16:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 16:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 16:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 16:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 16:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 16:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 16:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 17:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 17:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 17:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 17:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 17:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 17:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 17:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 17:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 17:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 17:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 17:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 17:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 17:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 17:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 17:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 17:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 17:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 17:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 17:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 17:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 17:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 17:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 17:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 18:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 18:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 18:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 18:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 18:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 18:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 18:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 18:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 18:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 18:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 18:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 18:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 18:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 18:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 18:30:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 18:30:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 18:30:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 18:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 18:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 18:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 18:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 18:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 18:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 19:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 19:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 19:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 19:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 19:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 19:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 19:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 19:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 19:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 19:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 19:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 19:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 19:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 19:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 19:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 19:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 19:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 19:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 19:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 19:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 19:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 19:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 19:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 20:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 20:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 20:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 20:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-04 20:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-04 20:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 20:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 20:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 20:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 20:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 20:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 20:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 20:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 20:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 20:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 20:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 20:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 20:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 20:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 20:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 20:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 20:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 20:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 21:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 21:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 21:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 21:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 21:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 21:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 21:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 21:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-04 21:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 21:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 21:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 21:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 21:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 21:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 21:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 21:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 21:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 21:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 21:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 21:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 21:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 21:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 21:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 22:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-04 22:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-04 22:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-04 22:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-04 22:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-04 22:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-04 22:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-04 22:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-05 07:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 07:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 07:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 07:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 07:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 07:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 07:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 07:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 07:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 08:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 08:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 08:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 08:00:00] BlockchainAudit: === Revenue Blockchain Audit started ===
- [2026-04-05 08:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-05 08:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-05 08:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-05 08:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 08:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-05 08:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 08:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 08:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 08:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 08:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 08:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 08:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 08:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 08:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 08:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 08:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 08:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 08:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 08:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 08:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 09:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 09:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 09:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 09:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-05 09:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-05 09:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-05 09:00:02] MarketTrend: === Market Trend Monitoring started ===
- [2026-04-05 09:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 09:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-05 09:00:03] MarketTrend: Scraped hubspot: N/A
- [2026-04-05 09:00:04] MarketTrend: Scraped salesforce: N/A
- [2026-04-05 09:00:07] MarketTrend: Scraped pipedrive: N/A
- [2026-04-05 09:00:08] MarketTrend: Scraped zoho: â¹800
- [2026-04-05 09:00:09] MarketTrend: Scraped close: Core Features (CRM)
- [2026-04-05 09:00:09] MarketTrend: GPT-4 analysis failed: 

You tried to access openai.ChatCompletion, but this is no longer supported in openai>=1.0.0 - see the README at https://github.com/openai/openai-python for the API.

You can run `openai migrate` to automatically upgrade your codebase to use the 1.0.0 interface. 

Alternatively, you can pin your installation to the old version, e.g. `pip install openai==0.28`

A detailed migration guide is available here: https://github.com/openai/openai-python/discussions/742

- [2026-04-05 09:00:09] MarketTrend: SendGrid key missing – cannot send alert
- [2026-04-05 09:00:09] MarketTrend: Market trend analysis completed.
- [2026-04-05 09:00:09] MarketTrend: === Market Trend Monitoring finished ===
- [2026-04-05 09:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 09:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 09:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 09:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 09:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 09:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 09:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 09:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 09:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 09:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 09:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 09:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 10:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 10:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 10:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 10:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-05 10:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-05 10:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-05 10:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 10:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-05 10:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 10:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 10:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 10:20:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 10:20:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 10:20:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 10:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 10:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 10:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 10:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 10:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 10:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 10:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 10:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 10:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 11:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 11:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 11:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 11:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-05 11:00:01] Feedback: === Customer Feedback Collection started ===
- [2026-04-05 11:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-05 11:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-05 11:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 11:00:01] Feedback: Feedback collection failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 11:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-05 11:00:01] Feedback: === Customer Feedback Collection finished ===
- [2026-04-05 11:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 11:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 11:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 11:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 11:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 11:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 11:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 11:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 11:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 11:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 11:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 11:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 11:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 11:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 11:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 12:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 12:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 12:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 12:00:01] Churn: === Churn Prevention started ===
- [2026-04-05 12:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-05 12:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-05 12:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-05 12:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 12:00:01] Churn: Churn prevention failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 12:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-05 12:00:01] Churn: === Churn Prevention finished ===
- [2026-04-05 12:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 12:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 12:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 12:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 12:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 12:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 12:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 12:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 12:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 12:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 12:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 12:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 12:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 12:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 12:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 13:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 13:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 13:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 13:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-05 13:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-05 13:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-05 13:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 13:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-05 13:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 13:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 13:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 13:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 13:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 13:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 13:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 13:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 13:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 13:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 13:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 13:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 13:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 13:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 13:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 14:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 14:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 14:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 14:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-05 14:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-05 14:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-05 14:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 14:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-05 14:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 14:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 14:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 14:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 14:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 14:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 14:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 14:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 14:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 14:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 14:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 14:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 14:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 14:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 14:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 15:00:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 15:00:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 15:00:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 15:00:02] DesignSystem: === AI Design System generation started ===
- [2026-04-05 15:00:02] Onboarding: === Customer Onboarding started ===
- [2026-04-05 15:00:02] DesignSystem: Theme spec missing – aborting.
- [2026-04-05 15:00:02] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 15:00:02] Onboarding: === Customer Onboarding finished ===
- [2026-04-05 15:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 15:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 15:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 15:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 15:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 15:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 15:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 15:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 15:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 15:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 15:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 15:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 15:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 15:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 15:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 16:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 16:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 16:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 16:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-05 16:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-05 16:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-05 16:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 16:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-05 16:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 16:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 16:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 16:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 16:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 16:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 17:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 17:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 17:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 17:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 17:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 17:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 17:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 17:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 17:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 17:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 17:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 17:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 18:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 18:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 18:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 18:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 18:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 18:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 18:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 18:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 18:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 18:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 18:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 18:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 18:50:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 18:50:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 18:50:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 19:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 19:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 19:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 19:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-05 19:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-05 19:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-05 19:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 19:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-05 19:10:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 19:10:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 19:10:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 19:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 19:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 19:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 19:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 19:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 19:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 20:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 20:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 20:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 20:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-05 20:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-05 20:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-05 20:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 20:00:01] Onboarding: === Customer Onboarding finished ===
- [2026-04-05 20:10:01] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 20:10:01] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 20:10:01] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 20:20:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 20:20:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 20:20:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 20:30:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 20:30:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 20:30:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 20:40:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 20:40:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 20:40:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 20:50:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 20:50:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 20:50:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 21:00:00] VoiceHealth: === Voice Health Check started ===
- [2026-04-05 21:00:00] VoiceHealth: Chrome CDP endpoint is reachable.
- [2026-04-05 21:00:00] VoiceHealth: === Voice Health Check finished ===
- [2026-04-05 21:00:01] DesignSystem: === AI Design System generation started ===
- [2026-04-05 21:00:01] Onboarding: === Customer Onboarding started ===
- [2026-04-05 21:00:01] DesignSystem: Theme spec missing – aborting.
- [2026-04-05 21:00:01] Onboarding: Onboarding failed: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (::1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

- [2026-04-05 21:00:01] Onboarding: === Customer Onboarding finished ===
