# Google Workspace Connection Guide for Zion Agents

## Status Atual
- **kleber@ziontechgroup.com**: ✅ Conectado (mas token expira em ~30 min)
- **sdm@ziontechgroup.com**: ⚠️ Token access não encontrado (refresh token pode estar lá)

## Escopos Necessários
Para full access ao Google Workspace, os agentes precisam destes escopos:
```
https://www.googleapis.com/auth/gmail.modify      # Gmail: ler, enviar, organizar
https://www.googleapis.com/auth/calendar.readonly # Calendar: ler eventos
https://www.googleapis.com/auth/contacts.readonly  # Contacts (opcional)
https://www.googleapis.com/auth/drive.file       # Drive (opcional)
```

## Método 1: Conexão Individual por Agente (Recomendado)

Cada agente deve ter seu próprio client OAuth. Script:

```bash
# Executar uma vez por agente
gog auth add <agent-email> --services gmail,calendar,contacts,drive
```

Isso abre um browser para autenticação. O agente precisa de:
1. Credenciais OAuth 2.0 (Client ID + Secret)
2. Permissão para usar o próprio e-mail/domain

## Método 2: Compartilhar Tokens (Menos Seguro)

Usar tokens compartilhados como o atual `gog_tokens.json`:

```bash
# Configurar cliente compartilhado
echo '{"client_id":"...","client_secret":"..."}' > /root/.config/gogcli/credentials.json

# Usar access token diretamente (expira em ~1h)
ACCESS_TOKEN=$(cat /root/.openclaw/workspace/zion-app/secrets/gog_tokens.json | jq -r '.access_token')
gog gmail search "in:inbox" --account kleber@ziontechgroup.com --access-token "$ACCESS_TOKEN"
```

## Manutenção de Tokens

### Refresh Automático
O `gog` CLI faz refresh automático quando configurado via `auth add`.

### Refresh Manual (se usando tokens compartilhados)
```python
# /root/.openclaw/workspace/zion-app/scripts/refresh_access_token.py
import json
import requests
from datetime import datetime

with open('/root/.openclaw/workspace/zion-app/secrets/gog_tokens.json') as f:
    tokens = json.load(f)

# Verificar se access token expirou
expiry = datetime.fromisoformat(tokens['expiry'].replace('+00:00', '+00:00'))
now = datetime.utcnow()

if expiry < now:
    # Refresh token
    r = requests.post(tokens['token_uri'], data={
        'client_id': tokens['client_id'],
        'client_secret': tokens['client_secret'],
        'refresh_token': tokens['refresh_token'],
        'grant_type': 'refresh_token'
    })
    new_tokens = r.json()
    tokens['access_token'] = new_tokens['access_token']
    tokens['expiry'] = datetime.utcnow().isoformat() + 'Z'
    # Salvar de volta (nunca expor em logs)
```

## Agentes a Conectar

- `@windows_carol_bot`
- `@Kilo_openclaw_kleber_bot`
- `@tablet_kleber_bot`
- `@Neo_kleber_bot`
- `@Windows_quel_bot`
- `@Rocket_Kleber_bot`
- `@swell_myclaw_bot`
- `@kilo_managed_ai_bot`
- `@Kiloclaw_Kleber_bot`
- `@Cloud_Windows_bot`

## Próximos Passos

1. Criar client OAuth para cada agente OU usar domain-wide delegation
2. Executar `gog auth add` para cada conta
3. Configurar cron de renovação automática (a cada 45 min)
4. Testar acesso: `gog gmail search "in:inbox" --account <email>`

---
**⚠️ Segurança**: Nunca exponha tokens/refresh_tokens em logs ou mensagens.
**📅 Última atualização**: 2026-06-08