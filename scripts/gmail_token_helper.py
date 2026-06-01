#!/usr/bin/env python3
"""
Helper script to generate Gmail API refresh token for Zion Email Responder V44+
Run this after you have your OAuth 2.0 Client ID and Secret from Google Cloud Console
"""

import os
import json
import webbrowser
import urllib.parse
import http.server
import threading
import time
from pathlib import Path

# You'll need to install these: pip install requests google-auth-oauthlib
try:
    from google_auth_oauthlib.flow import InstalledAppFlow
    GOOGLE_AUTH_AVAILABLE = True
except ImportError:
    GOOGLE_AUTH_AVAILABLE = False
    print("Warning: google-auth-oauthlib not installed. Install with:")
    print("pip install google-auth-oauthlib")

SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
REDIRECT_URI = 'http://localhost:8080/'

def generate_token_interactive(client_id, client_secret):
    """Generate token using local server flow"""
    if not GOOGLE_AUTH_AVAILABLE:
        print("Google auth library not available. Please install it:")
        print("pip install google-auth-oauthlib")
        return None
        
    # Create flow instance
    flow = InstalledAppFlow.from_client_config(
        {
            "installed": {
                "client_id": client_id,
                "client_secret": client_secret,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [REDIRECT_URI]
            }
        },
        scopes=SCOPES
    )
    
    # Run local server
    creds = flow.run_local_server(port=8080)
    
    return {
        'client_id': client_id,
        'client_secret': client_secret,
        'refresh_token': creds.refresh_token,
        'token': creds.token,
        'token_uri': "https://oauth2.googleapis.com/token"
    }

def save_to_env(tokens):
    """Save tokens to .env file"""
    env_lines = [
        f"GMAIL_CLIENT_ID={tokens['client_id']}",
        f"GMAIL_CLIENT_SECRET={tokens['client_secret']}",
        f"GMAIL_REFRESH_TOKEN={tokens['refresh_token']}",
        f"GMAIL_ACCESS_TOKEN={tokens['token']}",
        f"GMAIL_TOKEN_URI={tokens['token_uri']}"
    ]
    
    env_content = '\n'.join(env_lines) + '\n'
    
    # Check if .env exists and preserve other content
    env_path = Path('.env')
    if env_path.exists():
        with open(env_path, 'r') as f:
            existing = f.read()
        # Remove any existing GMAIL_* lines
        lines = existing.split('\n')
        filtered = [line for line in lines if not line.startswith('GMAIL_')]
        # Add new GMAIL_ lines
        new_content = '\n'.join(filtered + [''] + env_lines) + '\n'
        with open(env_path, 'w') as f:
            f.write(new_content)
    else:
        with open(env_path, 'w') as f:
            f.write(env_content)
    
    print(f"✅ Tokens saved to {env_path.absolute()}")

def main():
    print("🔐 Gmail API Refresh Token Generator for Zion Email Responder V44+")
    print("=" * 60)
    
    if not GOOGLE_AUTH_AVAILABLE:
        print("\n📦 First, install the required package:")
        print("   pip install google-auth-oauthlib")
        print("\nThen run this script again.")
        return
    
    print("\n📋 Prerequisites:")
    print("1. You have created a Google Cloud Project")
    print("2. You have enabled the Gmail API for that project")
    print("3. You have created OAuth 2.0 Client ID (Desktop app)")
    print("4. You have downloaded the credentials JSON file")
    print()
    
    # Get credentials from user
    client_id = input("Enter your OAuth 2.0 Client ID: ").strip()
    if not client_id:
        print("❌ Client ID is required")
        return
        
    client_secret = input("Enter your OAuth 2.0 Client Secret: ").strip()
    if not client_secret:
        print("❌ Client Secret is required")
        return
    
    print("\n🚀 Starting authentication flow...")
    print("   A browser window will open for you to grant permissions.")
    print("   Please log in with your Google account and accept the permissions.")
    print("   After granting access, you'll be redirected back automatically.")
    print()
    
    try:
        tokens = generate_token_interactive(client_id, client_secret)
        if tokens:
            print("\n✅ Successfully obtained refresh token!")
            print(f"   Refresh Token: {tokens['refresh_token'][:20]}...")
            
            save_choice = input("\n💾 Save these tokens to .env file? (y/n): ").strip().lower()
            if save_choice in ['y', 'yes']:
                save_to_env(tokens)
                print("\n🎉 Setup complete! Your .env file is now configured.")
                print("   You can now run: cd scripts && python3 email-responder-v44.0.py")
            else:
                print("\n📝 Tokens not saved. You can manually add them to .env:")
                print(f"   GMAIL_CLIENT_ID={tokens['client_id']}")
                print(f"   GMAIL_CLIENT_SECRET={tokens['client_secret']}")
                print(f"   GMAIL_REFRESH_TOKEN={tokens['refresh_token']}")
    except Exception as e:
        print(f"\n❌ Error during authentication: {e}")
        print("\nTroubleshooting tips:")
        print("1. Make sure you're using a Desktop app OAuth client (not Web application)")
        print("2. Ensure http://localhost:8080/ is in your authorized redirect URIs")
        print("3. Check that your internet connection allows localhost:8080")

if __name__ == '__main__':
    main()