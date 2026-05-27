# Qwen3.5 27B Fallback LLM Setup Guide

## Hardware Requirements

### Minimum for Qwen3.5 27B (4-bit quantized)
- **RAM**: 32GB+ system memory
- **VRAM**: 16GB+ GPU (RTX 3080/3090/4090, AMD equivalent)
- **Context**: 8K tokens at minimum, 16K+ recommended
- **Storage**: ~18GB disk space for model

### Optimal for Qwen3.5 27B
- **GPU**: RTX 4090 (24GB) or better
- **System RAM**: 64GB+ (for CPU offloading if needed)
- **Context**: 32K+ tokens comfortable

### ⚠️ Current System Status
- **Available RAM**: ~2.9GB (insufficient for 27B)
- **Recommendation**: Use smaller models or run Ollama on a separate machine

---

## Setup Options

### Option A: Run Qwen3.5 27B Locally (requires suitable hardware)

```bash
# 1. Ensure Ollama is updated
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull the 27B model (4-bit quantized)
ollama pull qwen3.5:27b

# 3. Verify it's available
ollama list | grep qwen3.5

# 4. Quick test
ollama run qwen3.5:27b "What is the capital of France?"
```

**Performance tuning (optional):**
```bash
# Force GPU layers (if you have enough VRAM)
export OLLAMA_NUM_GPU_LAYERS=999
ollama run qwen3.5:27b

# Enable flash attention (reduces memory)
export OLLAMA_FLASH_ATTENTION=1
ollama run qwen3.5:27b
```

### Option B: Run Ollama on Separate Machine (Recommended for your current setup)

If your gateway host has limited resources, run Ollama on a separate machine with better hardware:

**On the GPU/ML workstation:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull the model
ollama pull qwen3.5:27b

# Start Ollama listening on all interfaces
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

**On your OpenClaw gateway:**
```bash
# Configure OpenClaw to point to remote Ollama
openclaw config set models.providers.ollama.baseUrl "http://<WORKSTATION_IP>:11434"
```

---

## OpenClaw Configuration

### 1. Enable Ollama Provider

Add to `/root/.openclaw/openclaw.json` or use CLI:

```bash
# Set environment variable (any value works; Ollama doesn't require real API key)
export OLLAMA_API_KEY="ollama-local"

# Or via OpenClaw config
openclaw config set models.providers.ollama.apiKey "ollama-local"
```

### 2. Configure Fallback Chain

**Current config:**
- Primary: `kilocode/kilo-auto/free` (cloud)
- No fallbacks defined

**Updated config with Qwen3.5 27B fallback:**

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "kilocode/kilo-auto/free",
        "fallbacks": [
          "ollama/qwen3.5:27b",
          "ollama/qwen3:4b"
        ]
      }
    }
  },
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://localhost:11434",
        "apiKey": "ollama-local",
        "models": [
          {
            "id": "qwen3.5:27b",
            "name": "Qwen3.5 27B",
            "contextWindow": 32768,
            "maxTokens": 327680,
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
          },
          {
            "id": "qwen3:4b",
            "name": "Qwen3 4B",
            "contextWindow": 8192,
            "maxTokens": 81920,
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
          }
        ]
      }
    }
  }
}
```

**Apply via CLI (simpler):**
```bash
# Set primary model (keep current)
openclaw config set agents.defaults.model.primary "kilocode/kilo-auto/free"

# Add fallbacks (OpenClaw ≥ 3.2)
openclaw config set agents.defaults.model.fallbacks '["ollama/qwen3.5:27b", "ollama/qwen3:4b"]'

# Configure Ollama provider
openclaw config set models.providers.ollama.baseUrl "http://localhost:11434"
openclaw config set models.providers.ollama.apiKey "ollama-local"
```

### 3. Health Checks & Auto-Failover

OpenClaw automatically monitors model health (if configured):

```json
{
  "llmSwitch": {
    "healthCheck": {
      "intervalSeconds": 30,
      "timeoutMs": 5000,
      "endpoint": "/api/tags"
    },
    "priorities": [
      "kilocode/kilo-auto/free",
      "ollama/qwen3.5:27b",
      "ollama/qwen3:4b"
    ]
  }
}
```

**Behavior:**
1. OpenClaw pings each model's health endpoint
2. If primary fails 2 consecutive checks → promotes next fallback
3. Logs fallback events for monitoring
4. Auto-retries primary on recovery

---

## Testing & Validation

### Test 1: Verify Ollama is Running
```bash
# Check service status
ollama list

# Should show:
# NAME          ID              SIZE
# qwen3.5:27b  <id>            ~16GB
```

### Test 2: Direct API Test
```bash
# Test Ollama endpoint directly
curl http://localhost:11434/api/chat -d '{
  "model": "qwen3.5:27b",
  "messages": [{"role": "user", "content": "Hello!"}],
  "stream": false
}' | jq .message.content
```

Expected output: `"Hello! How can I assist you today?"`

### Test 3: OpenClaw Model Discovery
```bash
# List models known to OpenClaw
openclaw models list

# Should show:
# - kilocode/kilo-auto/free (primary)
# - ollama/qwen3.5:27b (fallback 1)
# - ollama/qwen3:4b (fallback 2)
```

### Test 4: Simulate Primary Failure

**Method A: Temporarily stop cloud provider**
```bash
# Block outbound to cloud (if safe to test)
# Then send a message via Telegram or dashboard
# Should automatically fall back to qwen3.5:27b
```

**Method B: Check fallback logs**
```bash
# View OpenClaw logs
tail -f /root/.openclaw/logs/gateway.log | grep -i fallback
```

Look for entries like:
```
[INFO] Model kilocode/kilo-auto/free unhealthy, falling back to ollama/qwen3.5:27b
```

### Test 5: End-to-End Conversation
```bash
# Send a message through your preferred channel
# Verify response comes from local model (check logs)
```

---

## Troubleshooting

### Issue: "Model not found" error
**Fix:** Ensure model is pulled and ID matches exactly
```bash
ollama list  # Get exact model name
openclaw config get agents.defaults.model.fallbacks  # Verify config
```

### Issue: Out of Memory
**Fix:**
1. Reduce context: `export OLLAMA_NUM_CTX=8192`
2. Use smaller model: switch `qwen3.5:27b` → `qwen3:9b` or `qwen3:4b`
3. Enable flash attention: `export OLLAMA_FLASH_ATTENTION=1`
4. Quantize KV cache: `export OLLAMA_KV_CACHE_TYPE=q8_0`

### Issue: Slow inference
**Fix:**
- Ensure GPU acceleration (NVIDIA: CUDA drivers, Mac: Metal)
- Use smaller model for simple tasks
- Increase `OLLAMA_NUM_GPU_LAYERS=999` if VRAM allows
- Consider running Ollama on dedicated hardware

### Issue: Connection refused
**Fix:**
```bash
# Verify Ollama is running
ps aux | grep ollama

# Start if needed
ollama serve &

# Test endpoint
curl http://localhost:11434/api/tags
```

---

## Recommendations for Your Setup

Given your current system resources (2.9GB RAM), here's the practical path:

### Short-term (Now)
1. **Use smaller fallbacks**: Configure `qwen3:4b` as immediate fallback (requires ~3GB RAM)
   ```bash
   openclaw config set agents.defaults.model.fallbacks '["ollama/qwen3:4b"]'
   ```

2. **Keep cloud primary**: Current setup works; local fallback provides offline capability

### Medium-term (When you have suitable hardware)
1. **Add a workstation/VM with 32GB+ RAM**
2. **Deploy Ollama + qwen3.5:27b there**
3. **Point OpenClaw to that remote instance**
4. **Update fallback chain** to use the 27B model

### Model Size Decision Tree
```
Need complex reasoning? → Use 27B (requires 32GB+)
Need coding/agent tasks? → Use 35B-A3B MoE (22GB VRAM, faster)
Need balance of speed/quality? → Use 9B (6GB VRAM) 
Need minimal footprint? → Use 4B (3GB) ← fits your current system!
```

---

## Security & Best Practices

1. **Never expose Ollama to public internet** - bind to localhost or VPN
2. **Monitor resource usage**: `htop` during inference
3. **Use quantized models** (Q4_K_M) for best size/quality ratio
4. **Set OLLAMA_NUM_GPU_LAYERS** to control GPU offloading
5. **Keep models updated**: `ollama pull qwen3.5:27b` regularly
6. **Verify tool calling**: Test that Qwen3.5 27B can use OpenClaw tools properly
   ```bash
   ollama run qwen3.5:27b "List files in /tmp"
   ```

---

## Next Steps

1. **Assess your available hardware** - Do you have access to a machine with 32GB+ RAM?
2. **If yes**: Run `ollama pull qwen3.5:27b` on that machine
3. **Configure fallback** as shown above
4. **Test** with `openclaw models list` and a real conversation
5. **Monitor** logs to verify failover works

**If no**: Use the smaller `qwen3:4b` as immediate local fallback (already available). It provides basic intelligence while you plan hardware upgrade.

---

## Resources

- [Ollama Library: Qwen3.5](https://ollama.ai/library/qwen3.5)
- [OpenClaw Ollama Docs](https://docs.openclaw.ai/providers/ollama/)
- [Qwen3.5 Model Card](https://qwen.ai/blog/qwen3)
- [Hardware Guide](https://llmhardware.io/models/Qwen--Qwen3.5-27B)
