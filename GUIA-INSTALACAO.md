# 🚀 GUIA DE INSTALAÇÃO - NOVO CLIENTE

Este guia te mostra como configurar o sistema para cada cliente novo de forma simples e rápida.

## 📋 CHECKLIST POR CLIENTE

### ✅ PASSO 1: CRIAR CONTA NO SUPABASE

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub (recomendado)
4. Clique "New project"
5. **Nome do projeto**: `cliente-nomedocliente` (ex: `cliente-joaobarber`)
6. **Senha do banco**: Anote essa senha! Você vai precisar
7. Clique "Create new project"
8. ⏱️ Aguarde 2-3 minutos para criar

### ✅ PASSO 2: CONFIGURAR O BANCO DE DADOS

1. No painel do Supabase, vá em **"SQL Editor"** (menu lateral)
2. Clique **"New query"**
3. Copie TODO o conteúdo do arquivo `database/schema.sql`
4. Cole no editor e clique **"Run"**
5. ✅ Deve aparecer "Success. No rows returned"

### ✅ PASSO 3: PEGAR AS CHAVES DO SUPABASE

1. No Supabase, vá em **"Settings"** → **"API"**
2. Copie:
   - **Project URL**: `https://xxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### ✅ PASSO 4: FAZER DEPLOY NO VERCEL

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique **"New Project"**
4. Conecte este repositório GitHub
5. **Framework Preset**: Vite
6. **Environment Variables** (IMPORTANTE!):
   ```
   VITE_SUPABASE_URL = https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_CLIENT_NAME = Nome do Salão
   VITE_CLIENT_THEME = salon
   ```
7. Clique **"Deploy"**
8. ⏱️ Aguarde 2-3 minutos

### ✅ PASSO 5: CONFIGURAR DOMÍNIO (OPCIONAL)

1. No Vercel, vá em **"Settings"** → **"Domains"**
2. Adicione o domínio do cliente: `seucliente.com.br`
3. Configure o DNS conforme instruções

## 🎨 PERSONALIZAÇÃO PARA CADA CLIENTE

### Temas Disponíveis:

- **`salon`**: Cores roxas (feminino)
- **`barbershop`**: Cores azuis (masculino)

### Configuração no Vercel:

```bash
VITE_CLIENT_THEME=salon     # Para salões
VITE_CLIENT_THEME=barbershop # Para barbearias
```

## 🔧 CONFIGURAÇÃO AVANÇADA

### WhatsApp (Opcional):

```bash
ENABLE_WHATSAPP=true
WHATSAPP_NUMBER=5511999999999
```

### Pagamentos (Futuro):

```bash
MERCADO_PAGO_ACCESS_TOKEN=TEST-xxx
PIX_KEY=seu@email.com
```

## 📱 TESTE FINAL

1. Acesse o site: `https://seu-projeto.vercel.app`
2. Teste o agendamento na página inicial
3. Acesse o admin: `/admin`
4. Configure o conteúdo em **"Configurar Site"**

## ⚠️ PROBLEMAS COMUNS

### ❌ "Erro de conexão com banco"

- Verifique se o SQL foi executado corretamente
- Confirme as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

### ❌ "Página não carrega"

- Aguarde alguns minutos após o deploy
- Verifique se não há erros nas variáveis de ambiente

### ❌ "Admin não funciona"

- Confirme que as tabelas foram criadas no Supabase
- Teste em modo incógnito (limpa cache)

## 💰 PREÇOS SUGERIDOS

- **Setup inicial**: R$ 300,00
- **Mensalidade**: R$ 147,00
- **Domínio próprio**: +R$ 50,00/ano

## 📞 SUPORTE

- **Supabase**: Até 50.000 usuários GRÁTIS
- **Vercel**: Até 100GB banda GRÁTIS
- **Total por cliente**: ~R$ 0-10/mês de infraestrutura

---

## 🎯 RESUMO RÁPIDO (5 MINUTOS)

1. **Supabase** → Novo projeto → Executar SQL
2. **Vercel** → Novo projeto → Conectar GitHub → Adicionar variáveis
3. **Testar** → Abrir site → Testar agendamento
4. **Configurar** → `/admin` → Personalizar conteúdo

✅ **PRONTO!** Cliente pode usar o sistema imediatamente!
