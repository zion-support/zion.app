#!/usr/bin/env python3
"""
OpenAI drop-in shim for Zion agents.

This module intercepts `import openai` and redirects ChatCompletion.create
calls to the unified llm_client with auto fallback (free providers → Ollama).

Usage: prepend this directory to PYTHONPATH or place in site-packages.
  export PYTHONPATH=/root/.openclaw/workspace/zion.app/lib:$PYTHONPATH

All existing agent code using `openai.ChatCompletion.create(...)` will
automatically use the free-fallback chain.

Supported parameters in create(): model, messages, temperature, max_tokens, n, stream, etc.
Only non-stream responses are implemented (stream=True not supported).
"""

from llm_client import chat as _llm_chat
import inspect

class OpenAI:
    def __init__(self, api_key=None):
        self.api_key = api_key
        # Store base client state if needed

    class chat:
        class completions:
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

    # Also expose chat.completions.create via ChatCompletion for compatibility
    class ChatCompletion:
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

# Expose both module-level classes
ChatCompletion = OpenAI.ChatCompletion

# Expose as module openai shim
import sys as _sys
_sys.modules['openai'] = _sys.modules.get(__name__)
