# Conexão de Bots Telegram ao Google Workspace

## Status Atual ✅
- **kleber@ziontechgroup.com**: Conectado e funcionando (token válido até ~17:08 UTC)
- **Acesso Gmail**: Funcionando - 10+ e-mails não lidos detectados
- **Principais e-mails**: Falhas do GitHub Actions (workflow "Deploy on Push" e outros)

## Agentes que precisam de conexão

| Bot | E-mail sugerido |
|-----|-----------------|
| @windows_carol_bot | windows-carol@ziontechgroup.com |
| @Kilo_openclaw_kleber_bot | kilo-openclaw@kiloclawnetwork.com |
| @tablet_kleber_bot | tablet-kleber@ziontechgroup.com |
| @Neo_kleber_bot | neo-kleber@ziontechgroup.com |
| @Windows_quel_bot | windows-quel@ziontechgroup.com |
| @Rocket_Kleber_bot | rocket-kleber@ziontechgroup.com |
| @swell_myclaw_bot | swell-myclaw@ziontechgroup.com |
| @kilo_managed_ai_bot | kilo-managed-ai@ziontechgroup.com |
| @Kiloclaw_Kleber_bot | kiloclaw-kleber@ziontechgroup.com |
| @Cloud_Windows_bot | cloud-windows@ziontechgroup.com |

## Como Conectar Cada Bot

### Passo 1: Criar credenciais OAuth
1. Acesse: https://console.cloud.google.com
2. Crie um projeto ou use existente
3. Habilite APIs: Gmail API, Calendar API
4. Crie OAuth 2.0 Client ID (tipo "Desktop app")
5. Salve `client_id` e `client_secret`

### Passo 2: Conectar via gog CLI
```bash
# Para cada conta:
gog auth add <email-do-bot> --services gmail,calendar

# Exemplo:
gog auth add windows-carol@ziontechgroup.com --services gmail,calendar
```

Isso abrirá um browser para autenticação.

### Passo 3: Verificar conexão
```bash
# Listar contas conectadas
gog auth list

# Testar Gmail
gog gmail search "in:inbox" --account <email-do-bot>

# Testar Calendar  
gog calendar events --account <email-do-bot> --from "2026-06-08T00:00:00Z" --to "2026-06-09T00:00:00Z"
```

## Manutenção de Tokens

### Opção A: Refresh automático (recomendado)
O gog CLI faz refresh automático quando você usa `auth add`.

### Opção B: Tokens compartilhados via script
```bash
# Verificar status
python3 /root/.openclaw/workspace/zion-app/scripts/maintain_google_tokens.py --check

# Renovar manualmente
python3 /root/.openclaw/workspace/zion-app/scripts/maintain_google_tokens.py --refresh
```

### Cron para renovação automática
Adicione ao crontab:
```bash
# Renovar a cada 45 minutos
*/45 * * * * /usr/bin/python3 /root/.openclaw/workspace/zion-app/scripts/maintain_google_tokens.py --refresh
```

## Arquivos Criados

| Arquivo | Função |
|---------|--------|
| GOOGLE_WORKSPACE_SETUP.md | Guia completo |
| scripts/maintain_google_tokens.py | Script de manutenção |
| scripts/connect_agents_to_google.sh | Helper de conexão |

## Próximas Ações Recomendadas

1. **Curto prazo**: Decidir se cada bot usará e-mail compartilhado ou individual
2. **Médio prazo**: Configurar OAuth para cada bot (se e-mails individuais)
3. **Longo prazo**: Criar workflow para monitoramento automático de e-mails importantes