# 💈 Sistema de Agendamento - Salões e Barbearias

Sistema completo de agendamento online para salões de beleza e barbearias, com painel administrativo e personalização total do conteúdo.

## 🚀 INSTALAÇÃO RÁPIDA - NOVO CLIENTE

### Pré-requisitos:

- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Vercel](https://vercel.com) (gratuita)

### Setup em 5 minutos:

1. **Clone o projeto**:

   ```bash
   git clone https://github.com/seurepo/sistema-agendamento.git
   cd sistema-agendamento
   ```

2. **Execute o setup automático**:

   ```bash
   node setup-cliente.js
   ```

3. **Configure o banco** no Supabase:

   - Copie o conteúdo de `database/schema.sql`
   - Execute no SQL Editor do Supabase

4. **Deploy no Vercel**:
   - Conecte o repositório
   - Use as variáveis geradas pelo setup

📖 **Guia completo**: [GUIA-INSTALACAO.md](./GUIA-INSTALACAO.md)

## ✨ Funcionalidades

### 👤 Para Clientes:

- ✅ Agendamento online simples
- ✅ Visualização de serviços e preços
- ✅ Confirmação automática
- ✅ Design responsivo

### 🏢 Para Estabelecimentos:

- ✅ Painel administrativo completo
- ✅ Gerenciamento de agendamentos
- ✅ Controle total do conteúdo do site
- ✅ Configuração de serviços e preços
- ✅ Temas personalizáveis (Salão/Barbearia)

### 🎨 Personalização:

- ✅ **Tema Salão**: Cores roxas, design feminino
- ✅ **Tema Barbearia**: Cores azuis, design masculino
- ✅ Conteúdo 100% editável pelo admin
- ✅ Logo, textos, preços configuráveis

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + APIs)
- **Deploy**: Vercel
- **Estado**: Zustand

## 📱 URLs do Sistema

### Cliente:

- **Home**: `/` - Página inicial com agendamento
- **Agendamento**: `/booking` - Formulário de agendamento

### Admin:

- **Dashboard**: `/admin` - Painel principal
- **Agendamentos**: `/admin/bookings` - Gerenciar agendamentos
- **Serviços**: `/admin/services` - Configurar serviços
- **Site**: `/admin/site-settings` - Personalizar conteúdo

## 🎯 Modelos de Negócio

### Opção 1: SaaS Individual (Recomendado)

- **R$ 300** setup inicial
- **R$ 147/mês** por cliente
- 1 instalação = 1 cliente
- Dados totalmente isolados

### Custos de Infraestrutura:

- **Supabase**: Gratuito até 50k usuários
- **Vercel**: Gratuito até 100GB banda
- **Total**: ~R$ 0-10/mês por cliente

## 📊 Banco de Dados

### Tabelas Principais:

- `clients` - Dados dos clientes
- `services` - Serviços oferecidos
- `bookings` - Agendamentos
- `site_settings` - Configurações do site
- `business_hours` - Horários de funcionamento

### Segurança:

- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de acesso configuradas
- ✅ Dados isolados por instalação

## 🔧 Configuração Avançada

### Variáveis de Ambiente:

```bash
# Obrigatórias
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
VITE_CLIENT_NAME=Nome do Salão
VITE_CLIENT_THEME=salon

# Opcionais
ENABLE_WHATSAPP=true
WHATSAPP_NUMBER=5511999999999
```

### Temas Disponíveis:

| Tema         | Cores      | Público   |
| ------------ | ---------- | --------- |
| `salon`      | Roxo/Rosa  | Feminino  |
| `barbershop` | Azul/Cinza | Masculino |

## 🚨 Troubleshooting

### Problemas Comuns:

1. **"Erro de conexão"**: Verifique as variáveis do Supabase
2. **"Admin não funciona"**: Execute o SQL schema
3. **"Página branca"**: Aguarde deploy completo (2-3 min)

### Suporte:

- 📧 Email: seu@email.com
- 📱 WhatsApp: (11) 99999-9999

## 📈 Roadmap

### v2.0 - Em Desenvolvimento:

- [ ] Integração Mercado Pago/PIX
- [ ] Notificações por email
- [ ] App mobile (React Native)
- [ ] Sistema de fidelidade

### v2.1 - Futuro:

- [ ] Multi-tenancy (1 instalação = N clientes)
- [ ] Relatórios avançados
- [ ] Integração WhatsApp Business

## 📄 Licença

Uso comercial permitido para instalações pagas.

---

## 🎯 RESUMO PARA INSTALAÇÃO

1. ✅ **Supabase**: Criar projeto + executar SQL
2. ✅ **Vercel**: Deploy + configurar variáveis
3. ✅ **Teste**: Abrir site + testar agendamento
4. ✅ **Admin**: Configurar conteúdo em `/admin`

**Tempo total**: ~10 minutos por cliente

**Lucro mensal**: R$ 147 - R$ 10 infraestrutura = **R$ 137 líquido/cliente**
