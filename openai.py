#!/usr/bin/env python3
"""
OpenAI drop-in shim for Zion agents.

Intercepts `import openai` and redirects all ChatCompletion.create / OpenAI() calls
to the unified llm_client free-fallback chain (Groq/Gemini/... → Ollama).

Place this file (openai.py) in the same directory as agent scripts
(e.g., zion.app/commands/) so `import openai` resolves here.
"""

import sys, os

# Add lib directory (sibling of this file's parent) to sys.path so we can import llm_client
# This file lives in zion.app/commands/, lib is in zion.app/lib/
LIB_DIR = os.path.join(os.path.dirname(__file__), 'lib')
if LIB_DIR not in sys.path:
    sys.path.insert(0, LIB_DIR)

from llm_client import chat as _llm_chat

class Completion:
    class Chat:
        @staticmethod
        def create(
            model=None,
            messages=None,
            temperature=0.7,
            max_tokens=None,
            n=1,
            stream=False,
            **kwargs,
        ):
            if stream:
                raise NotImplementedError("Streaming not supported by shim")
            result = _llm_chat(messages, provider="auto", temperature=temperature)
            return {
                "choices": [
                    {
                        "message": {
                            "role": "assistant",
                            "content": result["content"],
                        },
                        "index": 0,
                        "finish_reason": "stop",
                    }
                ],
                "model": result["model"],
                "provider": result["provider"],
                "usage": {
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "total_tokens": 0,
                },
            }

class OpenAI:
    def __init__(self, api_key=None):
        pass
    class chat:
        class completions:
            @staticmethod
            def create(model=None, messages=None, temperature=0.7, max_tokens=None, n=1, stream=False, **kwargs):
                if stream:
                    raise NotImplementedError("Streaming not supported by shim")
                result = _llm_chat(messages, provider="auto", temperature=temperature)
                return {
                    "choices": [
                        {
                            "message": {
                                "role": "assistant",
                                "content": result["content"],
                            },
                            "index": 0,
                            "finish_reason": "stop",
                        }
                    ],
                    "model": result["model"],
                    "provider": result["provider"],
                    "usage": {
                        "prompt_tokens": 0,
                        "completion_tokens": 0,
                        "total_tokens": 0,
                    },
                }

ChatCompletion = OpenAI.ChatCompletion

# Expose shim
_sys = sys
_sys.modules['openai'] = _sys.modules.get(__name__)
