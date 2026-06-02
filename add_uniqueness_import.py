#!/usr/bin/env python3
# This script adds the response uniqueness checker to the intelligent email responder.

import sys
import os

def main():
    responder_path = '/Users/klebergarciaalcatrao/.openclaw/workspace/zion.app/commands/intelligent_email_responder_v26.py'
    checker_path = '/Users/klebergarciaalcatrao/.openclaw/workspace/zion.app/commands/response_uniqueness_checker.py'
    
    # Read the responder file
    with open(responder_path, 'r') as f:
        lines = f.readlines()
    
    # Find where to insert the import (after the last import from local modules)
    insert_pos = None
    for i, line in enumerate(lines):
        if line.strip() == '# ─── V30: CaseRouter + ResponseImprover ─────────────────────':
            insert_pos = i
            break
    
    if insert_pos is None:
        # Fallback: after the last import block
        for i in range(len(lines)-1, -1, -1):
            if lines[i].startswith('from ') or lines[i].startswith('import '):
                insert_pos = i+1
                break
    
    if insert_pos is None:
        insert_pos = 0
    
    # Insert the import for our checker
    lines.insert(insert_pos, 'from response_uniqueness_checker import check_uniqueness\n')
    
    # Now we need to modify _fast_path and _full_pipeline to call check_uniqueness
    # We'll do that by replacing the functions with modified versions.
    # Instead of doing complex multi-line replacement, we'll append a note and then do it manually?
    # For now, let's just write the modified file to a new location and then replace.
    
    # We'll write the modified lines back
    with open(responder_path, 'w') as f:
        f.writelines(lines)
    
    print(f'Inserted import at line {insert_pos+1}')

if __name__ == '__main__':
    main()