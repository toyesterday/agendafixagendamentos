#!/usr/bin/env node

/**
 * SCRIPT DE SETUP AUTOMÁTICO - NOVO CLIENTE
 * Execute: node setup-cliente.js
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function pergunta(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log("🚀 SETUP AUTOMÁTICO - NOVO CLIENTE\n");

  try {
    // Coletar informações do cliente
    const nomeCliente = await pergunta("📝 Nome do Cliente/Salão: ");
    const tema = await pergunta("🎨 Tema (salon/barbershop): ");
    const supabaseUrl = await pergunta("🔗 Supabase URL: ");
    const supabaseKey = await pergunta("🔑 Supabase Anon Key: ");
    const whatsapp = await pergunta("📱 WhatsApp (opcional): ");

    console.log("\n⚙️ Criando arquivo .env.local...");

    // Criar arquivo .env.local
    const envContent = `# CONFIGURAÇÃO DO CLIENTE: ${nomeCliente}
# Gerado automaticamente em ${new Date().toLocaleDateString("pt-BR")}

# SUPABASE
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseKey}

# CONFIGURAÇÕES DO CLIENTE
VITE_CLIENT_NAME=${nomeCliente}
VITE_CLIENT_THEME=${tema || "salon"}

# WHATSAPP
ENABLE_WHATSAPP=${whatsapp ? "true" : "false"}
${whatsapp ? `WHATSAPP_NUMBER=${whatsapp}` : "# WHATSAPP_NUMBER=5511999999999"}

# FUTURAS CONFIGURAÇÕES
# MERCADO_PAGO_ACCESS_TOKEN=
# PIX_KEY=
# SMTP_HOST=
# SMTP_USER=
# SMTP_PASS=
`;

    fs.writeFileSync(".env.local", envContent);

    console.log("✅ Arquivo .env.local criado!");
    console.log("\n📋 PRÓXIMOS PASSOS:");
    console.log("1. Execute o SQL em database/schema.sql no Supabase");
    console.log("2. Execute: npm run dev (para testar local)");
    console.log("3. Faça deploy no Vercel com as mesmas variáveis");
    console.log("\n🎯 PARA DEPLOY NO VERCEL:");
    console.log(`VITE_SUPABASE_URL=${supabaseUrl}`);
    console.log(`VITE_SUPABASE_ANON_KEY=${supabaseKey}`);
    console.log(`VITE_CLIENT_NAME=${nomeCliente}`);
    console.log(`VITE_CLIENT_THEME=${tema || "salon"}`);

    if (whatsapp) {
      console.log("ENABLE_WHATSAPP=true");
      console.log(`WHATSAPP_NUMBER=${whatsapp}`);
    }

    console.log("\n✨ Setup concluído! Bom trabalho!");
  } catch (error) {
    console.error("❌ Erro no setup:", error.message);
  } finally {
    rl.close();
  }
}

// Verificar se é execução direta
if (require.main === module) {
  main();
}

module.exports = { main };
