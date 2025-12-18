/**
 * Script para obtener los IDs de usuarios en Chatwoot
 *
 * Ejecutar con: npx tsx scripts/obtener-usuarios-chatwoot.ts
 */

const CHATWOOT_BASE_URL = 'https://chatwoot.autorunai.tech';
const CHATWOOT_API_TOKEN = 'VsVcF9h2ZM1jhc8UiqTZwgJg';
const ACCOUNT_ID = '1';

async function obtenerUsuarios() {
  try {
    const url = `${CHATWOOT_BASE_URL}/api/v1/accounts/${ACCOUNT_ID}/agents`;

    console.log('📡 Consultando usuarios de Chatwoot...');
    console.log('URL:', url);

    const response = await fetch(url, {
      headers: {
        'api_access_token': CHATWOOT_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error:', response.status, errorText);
      return;
    }

    const usuarios = await response.json();

    console.log('\n✅ Usuarios encontrados en Chatwoot:');
    console.log('═'.repeat(60));

    if (Array.isArray(usuarios)) {
      usuarios.forEach((user: any) => {
        console.log(`\nID: ${user.id}`);
        console.log(`Nombre: ${user.name || user.available_name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Rol: ${user.role}`);
        console.log(`Disponible: ${user.availability_status}`);
        console.log('─'.repeat(60));
      });

      console.log('\n📋 Mapeo sugerido para chatwoot-api.service.ts:');
      console.log('═'.repeat(60));
      console.log('const mapeo: Record<number, number> = {');
      console.log('  // NocoDB ID → Chatwoot User ID');
      usuarios.forEach((user: any) => {
        const nombre = user.name || user.available_name;
        console.log(`  X: ${user.id}, // ${nombre}`);
      });
      console.log('};');
    }
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
  }
}

obtenerUsuarios();
