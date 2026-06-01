#!/usr/bin/env python3
"""
Helper script to generate Gmail API refresh token for Zion Email Responder V44+
Run this after setting up OAuth credentials in Google Cloud Console
"""

import os
import json
import pickle
import sys
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/gmail.modify']

def main():
    """Shows basic usage of the Gmail API.
    Lists the user's Gmail labels.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists('credentials.json'):
                print("ERROR: credentials.json not found!")
                print("Please download your OAuth 2.0 credentials from Google Cloud Console")
                print("and save them as 'credentials.json' in this directory.")
                sys.exit(1)
            
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    # Display the refresh token
    if creds and creds.refresh_token:
        print("\n" + "="*60)
        print("GMAIL API REFRESH TOKEN GENERATED SUCCESSFULLY")
        print("="*60)
        print(f"Refresh Token: {creds.refresh_token}")
        print("\nAdd these lines to your .env file:")
        print(f"GMAIL_CLIENT_ID={creds.client_id}")
        print(f"GMAIL_CLIENT_SECRET={creds.client_secret}")
        print(f"GMAIL_REFRESH_TOKEN={creds.refresh_token}")
        print("\nSave this information securely - you won't be able to see the refresh token again!")
        print("="*60)
    else:
        print("ERROR: Failed to obtain refresh token")

if __name__ == '__main__':
    main()