#!/usr/bin/env python3
"""
Script to add response uniqueness check to _fast_path and _full_pipeline in intelligent_email_responder_v26.py
"""

import re

def modify_fast_path(content):
    # We want to insert the uniqueness check after the body is built and before the grammar check.
    # In the _fast_path method, we look for the line that starts with "# ③-kb Lightweight KB inject"
    # But actually, we want to put it after the body is built and before the KB inject? 
    # Let's put it after the body is built and before the KB inject, so we check the raw body without KB and signature.
    # However, the uniqueness should be on the final body that is sent. So we should check after the body is fully built.

    # Looking at the _fast_path method, the body is built in steps:
    #   - line ~1490: body_raw = tpl.format(...)
    #   - line ~1491: body = f"{body_raw}\\n\\n{sig}"
    #   - then attachment, KB, FAQ, RTFB, grammar check.

    # We want to check the final body (after all modifications) but before the grammar check? 
    # Actually, the grammar check might change the body? It doesn't in the current code, it just scores.

    # Let's put the uniqueness check after the grammar check and before the V30 CaseRouter gates.
    # We can insert after the line that sets `g_score, g_issues = _fast_grammar_check(body)`

    # We'll search for: "# ③ Trim grammar check"
    # Then after the two lines that follow (the call to _fast_grammar_check and the assignment) we insert.

    # Pattern to find the grammar check section in _fast_path:
    pattern = r"(# ③ Trim grammar check\n\s+g_score, g_issues = _fast_grammar_check\(body\))"
    # We want to insert after this block.

    # We'll insert:
    #         # --- Response Uniqueness Check ---
    #         uniqueness_score = check_uniqueness(tid, body)
    #         if uniqueness_score < 0.2:
    #             result = add_to_result(email, {
    #                 "thread_intent": thread_intent_label,
    #                 "action": "review",
    #                 "reason": f"low_response_uniqueness_{uniqueness_score:.2f}",
    #                 "tone": tone_data,
    #                 "elapsed_ms": round((time.monotonic() - fast_ms_start) * 1000, 1)
    #             })
    #             return result

    # But note: in _fast_path we have a variable `fast_ms_start` for timing the fast path.
    # We also have `result` built via `add_to_result` and then we add more fields and return.

    # However, we are returning early, so we need to build the result and return.

    # We'll do the insertion after the grammar check.

    # Let's break the content and insert.

    # We'll use a more robust method: find the line number of the grammar check and insert after the next two lines.

    lines = content.split('\n')
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        new_lines.append(line)
        if line.strip() == "# ③ Trim grammar check":
            # Next line should be the blank line or the g_score line.
            # We'll insert after the g_score line.
            new_lines.append(lines[i+1])  # g_score, g_issues = ...
            new_lines.append(lines[i+2])  # the next line (which is empty or comment)
            i += 3
            # Now insert our block
            new_lines.append("        # --- Response Uniqueness Check ---")
            new_lines.append("        uniqueness_score = check_uniqueness(tid, body)")
            new_lines.append("        if uniqueness_score < 0.2:")
            new_lines.append("            result = add_to_result(email, {")
            new_lines.append("                \"thread_intent\": thread_intent_label,")
            new_lines.append("                \"action\": \"review\",")
            new_lines.append("                \"reason\": f\"low_response_uniqueness_{uniqueness_score:.2f}\",")
            new_lines.append("                \"tone\": tone_data,")
            new_lines.append("                \"elapsed_ms\": round((time.monotonic() - fast_ms_start) * 1000, 1)")
            new_lines.append("            })")
            new_lines.append("            return result")
            new_lines.append("")  # blank line after
            continue
        i += 1

    return '\n'.join(new_lines)

def modify_full_pipeline(content):
    # In _full_pipeline, we want to insert the uniqueness check after the body is built and before returning.
    # Looking at the _full_pipeline method, the body is built in a similar way but then there is a lot of processing.
    # We want to check the final body that is going to be sent.

    # We can put it after the grammar check and before the V30 CaseRouter gates, similar to fast_path.

    # In _full_pipeline, we have:
    #   ... after building the body (with attachments, KB, FAQ, etc.) ...
    #   then grammar check: g_score, g_issues = _trim_grammar_check(body)
    #   then V30 CaseRouter gates.

    # We'll insert after the grammar check.

    # Pattern: "# ③-kb Lightweight KB inject" is not present in _full_pipeline? Actually, the _full_pipeline has a similar structure.

    # Let's search for: "# ③ Trim grammar check" in _full_pipeline.

    lines = content.split('\n')
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        new_lines.append(line)
        if line.strip() == "# ③ Trim grammar check":
            # Next line is the g_score line, then the next line after that.
            new_lines.append(lines[i+1])  # g_score, g_issues = ...
            new_lines.append(lines[i+2])  # the line after (might be empty or comment)
            i += 3
            # Now insert our block
            new_lines.append("        # --- Response Uniqueness Check ---")
            new_lines.append("        uniqueness_score = check_uniqueness(tid, body)")
            new_lines.append("        if uniqueness_score < 0.2:")
            new_lines.append("            result = add_to_result(email, {")
            new_lines.append("                \"thread_intent\": thread_intent_label,")
            new_lines.append("                \"action\": \"review\",")
            new_lines.append("                \"reason\": f\"low_response_uniqueness_{uniqueness_score:.2f}\",")
            new_lines.append("                \"tone\": tone_data,")
            new_lines.append("                \"elapsed_ms\": round((time.monotonic() - t0) * 1000, 1)")
            new_lines.append("            })")
            new_lines.append("            return result")
            new_lines.append("")  # blank line after
            continue
        i += 1

    return '\n'.join(new_lines)

def main():
    file_path = '/Users/klebergarciaalcatrao/.openclaw/workspace/zion.app/commands/intelligent_email_responder_v26.py'
    with open(file_path, 'r') as f:
        content = f.read()

    # Modify _fast_path
    content = modify_fast_path(content)
    # Modify _full_pipeline
    content = modify_full_pipeline(content)

    with open(file_path, 'w') as f:
        f.write(content)

    print("Successfully added uniqueness check to _fast_path and _full_pipeline.")

if __name__ == '__main__':
    main()