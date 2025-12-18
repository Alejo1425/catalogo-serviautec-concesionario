import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
const NOCODB_BASE_URL = env.VITE_NOCODB_BASE_URL;
const NOCODB_TOKEN = env.VITE_NOCODB_TOKEN;
const TABLE_ID = 'mk3y12zsd2xgngl';

async function verificarSlugs() {
  console.log('🔍 Verificando slugs en NocoDB...\n');

  const response = await fetch(
    `${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records?limit=100`,
    { headers: { 'xc-token': NOCODB_TOKEN } }
  );

  const data = await response.json();

  console.log('📋 Asesores con slugs en NocoDB:\n');
  console.log('ID  | Nombre           | Slug           | Activo');
  console.log('----+------------------+----------------+-------');

  for (const asesor of data.list) {
    const activo = asesor.Activo === 1 ? '✅ Sí' : asesor.Activo === 2 ? '🚫 Retirado' : '⏸️  No';
    console.log(`${String(asesor.Id).padEnd(3)} | ${String(asesor.Asesor || asesor.Aseror).padEnd(16)} | ${String(asesor.slug || 'SIN SLUG').padEnd(14)} | ${activo}`);
  }

  console.log('\n🔎 Buscando asesor con slug "miguel"...');
  const miguel = data.list.find((a: any) => a.slug === 'miguel');
  if (miguel) {
    console.log('✅ Encontrado:', JSON.stringify(miguel, null, 2));
  } else {
    console.log('❌ No se encontró asesor con slug "miguel"');
    console.log('\n💡 Asesores activos:');
    data.list
      .filter((a: any) => a.Activo === 1)
      .forEach((a: any) => {
        console.log(`   - ${a.Asesor || a.Aseror}: slug="${a.slug || 'N/A'}"`);
      });
  }
}

verificarSlugs().catch(console.error);
