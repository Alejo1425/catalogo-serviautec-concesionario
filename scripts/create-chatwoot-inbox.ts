/**
 * Script para crear un inbox tipo Website en Chatwoot usando la API
 *
 * Uso:
 * npx tsx scripts/create-chatwoot-inbox.ts
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Función simple para parsear .env
function loadEnv(): Record<string, string> {
  const envPath = resolve(__dirname, '../.env');
  const envFile = readFileSync(envPath, 'utf-8');
  const env: Record<string, string> = {};

  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  }

  return env;
}

const env = loadEnv();
const CHATWOOT_BASE_URL = env.VITE_CHATWOOT_BASE_URL;
const CHATWOOT_API_TOKEN = env.VITE_CHATWOOT_API_TOKEN;
const CHATWOOT_ACCOUNT_ID = env.VITE_CHATWOOT_ACCOUNT_ID || '1';

interface CreateInboxResponse {
  id: number;
  channel_id: number;
  name: string;
  channel_type: string;
  website_token?: string;
  widget_color?: string;
  website_url?: string;
  welcome_title?: string;
  welcome_tagline?: string;
  web_widget_script?: string;
}

interface InboxSettings {
  name: string;
  channel: {
    type: 'web_widget';
    website_url: string;
    website_name: string;
    widget_color: string;
    welcome_title: string;
    welcome_tagline: string;
  };
}

async function createWebsiteInbox() {
  if (!CHATWOOT_BASE_URL || !CHATWOOT_API_TOKEN) {
    console.error('❌ Faltan variables de entorno requeridas:');
    console.error('   VITE_CHATWOOT_BASE_URL:', CHATWOOT_BASE_URL);
    console.error('   VITE_CHATWOOT_API_TOKEN:', CHATWOOT_API_TOKEN ? '✓' : '✗');
    process.exit(1);
  }

  console.log('🚀 Creando inbox Website en Chatwoot...\n');
  console.log('📋 Configuración:');
  console.log(`   Base URL: ${CHATWOOT_BASE_URL}`);
  console.log(`   Account ID: ${CHATWOOT_ACCOUNT_ID}`);
  console.log(`   API Token: ${CHATWOOT_API_TOKEN.substring(0, 10)}...`);
  console.log('');

  const inboxData: InboxSettings = {
    name: 'Catálogo Serviautec',
    channel: {
      type: 'web_widget',
      website_url: 'https://catalogo.serviautec.com',
      website_name: 'Catálogo Serviautec',
      widget_color: '#0066CC',
      welcome_title: '¡Hola! 👋',
      welcome_tagline: 'Estamos aquí para ayudarte. Selecciona un asesor y comienza a chatear.',
    },
  };

  try {
    console.log('📤 Enviando solicitud para crear inbox...');

    const response = await fetch(
      `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/inboxes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_access_token': CHATWOOT_API_TOKEN,
        },
        body: JSON.stringify(inboxData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al crear el inbox:\n');
      console.error('   Status:', response.status, response.statusText);
      console.error('   Mensaje:', errorData.message || 'Error desconocido');

      if (response.status === 401) {
        console.error('\n⚠️  Error de autenticación. Verifica que:');
        console.error('   1. El VITE_CHATWOOT_API_TOKEN sea correcto');
        console.error('   2. El token tenga permisos de administrador');
        console.error('   3. El token no haya expirado');
      } else if (response.status === 422) {
        console.error('\n⚠️  Error de validación:');
        console.error('   ', JSON.stringify(errorData, null, 2));
      } else if (errorData) {
        console.error('\n   Detalles:', JSON.stringify(errorData, null, 2));
      }
      process.exit(1);
    }

    const data: CreateInboxResponse = await response.json();

    console.log('✅ ¡Inbox creado exitosamente!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 INFORMACIÓN DEL INBOX:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ID del Inbox: ${data.id}`);
    console.log(`   Nombre: ${data.name}`);
    console.log(`   Tipo: ${data.channel_type}`);
    console.log('');

    if (data.website_token) {
      console.log('🎯 WEBSITE TOKEN (IMPORTANTE):');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   ${data.website_token}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('📝 SIGUIENTE PASO:');
      console.log('');
      console.log('   Actualiza tu archivo .env con esta línea:');
      console.log('');
      console.log(`   VITE_CHATWOOT_WEBSITE_TOKEN=${data.website_token}`);
      console.log('');
      console.log('   Luego reinicia el servidor de desarrollo:');
      console.log('   npm run dev');
      console.log('');
    } else {
      console.log('⚠️  No se recibió el website_token en la respuesta.');
      console.log('   Respuesta completa:', JSON.stringify(data, null, 2));
      console.log('');
      console.log('   Intenta obtener el token manualmente desde:');
      console.log(`   ${CHATWOOT_BASE_URL}/app/accounts/${CHATWOOT_ACCOUNT_ID}/settings/inboxes/${data.id}`);
    }

    // Verificar si hay script de instalación
    if (data.web_widget_script) {
      console.log('💡 Script de instalación generado:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(data.web_widget_script);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error inesperado:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Ejecutar el script
createWebsiteInbox().catch(error => {
  console.error('💥 Error fatal:', error instanceof Error ? error.message : error);
  process.exit(1);
});
