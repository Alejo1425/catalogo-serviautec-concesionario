/**
 * Script para obtener los IDs de usuarios y canales en Chatwoot
 *
 * Ejecutar con: npx tsx scripts/obtener-usuarios-chatwoot.ts
 */

const CHATWOOT_BASE_URL = 'https://chatwoot.autorunai.tech';
const CHATWOOT_API_TOKEN = 'VsVcF9h2ZM1jhc8UiqTZwgJg';
const ACCOUNT_ID = '1';

async function obtenerUsuariosYCanales() {
  try {
    const urlAgents = `${CHATWOOT_BASE_URL}/api/v1/accounts/${ACCOUNT_ID}/agents`;
    const urlInboxes = `${CHATWOOT_BASE_URL}/api/v1/accounts/${ACCOUNT_ID}/inboxes`;

    console.log('📡 Consultando usuarios de Chatwoot...');
    const responseAgents = await fetch(urlAgents, {
      headers: {
        'api_access_token': CHATWOOT_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!responseAgents.ok) {
      console.error('❌ Error agentes:', responseAgents.status, await responseAgents.text());
      return;
    }

    const usuarios = await responseAgents.json();
    console.log('\n✅ Usuarios encontrados en Chatwoot:');
    console.log('═'.repeat(60));

    if (Array.isArray(usuarios)) {
      usuarios.forEach((user: any) => {
        console.log(`\nID: ${user.id}`);
        console.log(`Nombre: ${user.name || user.available_name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Rol: ${user.role}`);
        console.log('─'.repeat(60));
      });
    }

    console.log('\n📡 Consultando Canales (Inboxes) de Chatwoot...');
    const responseInboxes = await fetch(urlInboxes, {
      headers: {
        'api_access_token': CHATWOOT_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!responseInboxes.ok) {
      console.error('❌ Error inboxes:', responseInboxes.status, await responseInboxes.text());
      return;
    }

    const inboxes = await responseInboxes.json();
    console.log('\n✅ Canales encontrados en Chatwoot:');
    console.log('═'.repeat(60));

    if (inboxes && Array.isArray(inboxes.payload)) {
      inboxes.payload.forEach((inbox: any) => {
        console.log(`\nID: ${inbox.id}`);
        console.log(`Nombre: ${inbox.name}`);
        console.log(`Tipo: ${inbox.channel_type}`);
        console.log('─'.repeat(60));
      });
    }

  } catch (error) {
    console.error('❌ Error al obtener datos de Chatwoot:', error);
  }
}

obtenerUsuariosYCanales();
