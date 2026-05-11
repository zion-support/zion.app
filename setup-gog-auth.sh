#!/bin/bash

# Create OAuth credentials directory
CRED_DIR="$HOME/.config/gog"
mkdir -p "$CRED_DIR"

# Create OAuth client_secret.json with placeholder values
cat > "$CRED_DIR/client_secret.json" <<'EOF'
{
  "installed": {
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"],
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
}
EOF

# Print instructions for user to replace placeholders
echo "OAuth client_secret.json created at $CRED_DIR/client_secret.json"
echo "Please replace YOUR_CLIENT_ID and YOUR_CLIENT_SECRET with actual values from Google Cloud Console."
echo "Then run: gog auth credentials $CRED_DIR/client_secret.json"
echo "After that, run: gog auth add kleber@ziontechgroup.com --services gmail,calendar,drive,contacts,docs,sheets"
