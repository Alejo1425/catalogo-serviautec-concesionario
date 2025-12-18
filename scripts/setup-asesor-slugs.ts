/**
 * Script para configurar slugs de asesores
 *
 * Este script:
 * 1. Agrega la columna 'slug' a la tabla Asesores en NocoDB
 * 2. Asigna slugs automáticamente a los asesores activos
 *
 * Uso:
 * npx tsx scripts/setup-asesor-slugs.ts
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
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
const TABLE_ID = 'mk3y12zsd2xgngl'; // ID de la tabla Asesores

interface Asesor {
  Id: number;
  Aseror: string;
  Phone: string;
  Email: string | null;
  Activo: number;
  slug?: string;
}

// Función para generar slug desde nombre
function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function main() {
  console.log('🚀 Configurando slugs de asesores...\n');

  // Paso 1: Obtener todos los asesores
  console.log('📥 Obteniendo lista de asesores...');
  const asesoresResponse = await fetch(
    `${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records`,
    {
      headers: {
        'xc-token': NOCODB_TOKEN,
      },
    }
  );

  if (!asesoresResponse.ok) {
    throw new Error(`Error al obtener asesores: ${asesoresResponse.statusText}`);
  }

  const asesoresData = await asesoresResponse.json();
  const asesores: Asesor[] = asesoresData.list;

  console.log(`✅ ${asesores.length} asesores encontrados\n`);

  // Paso 2: Verificar si el campo slug ya existe
  console.log('🔍 Verificando campo slug...');
  const primeraPersona = asesores[0];
  const tieneSlug = 'slug' in primeraPersona;

  if (!tieneSlug) {
    console.log('⚠️  Campo slug no existe, necesitas agregarlo manualmente en NocoDB');
    console.log('\nPasos para agregar el campo:');
    console.log('1. Ve a NocoDB → Tabla Asesores');
    console.log('2. Haz clic en el botón "+" para agregar columna');
    console.log('3. Nombre: slug');
    console.log('4. Tipo: SingleLineText');
    console.log('5. Marcar como "Unique" (único)');
    console.log('6. Guardar');
    console.log('\nLuego ejecuta este script nuevamente.\n');
    return;
  }

  console.log('✅ Campo slug existe\n');

  // Paso 3: Asignar slugs a los asesores que no lo tengan
  console.log('📝 Asignando slugs...\n');

  const asesoresActivos = asesores.filter(a => a.Activo === 1);

  for (const asesor of asesoresActivos) {
    if (!asesor.slug) {
      const slug = generateSlug(asesor.Aseror);

      console.log(`   ${asesor.Aseror} → ${slug}`);

      // Actualizar el asesor con su slug
      const updateResponse = await fetch(
        `${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': NOCODB_TOKEN,
          },
          body: JSON.stringify({
            Id: asesor.Id,
            slug: slug,
          }),
        }
      );

      if (!updateResponse.ok) {
        const error = await updateResponse.text();
        console.error(`   ❌ Error al actualizar ${asesor.Aseror}: ${error}`);
      } else {
        console.log(`   ✅ ${asesor.Aseror} actualizado`);
      }

      // Pequeña pausa para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log(`   ⏭️  ${asesor.Aseror} ya tiene slug: ${asesor.slug}`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ ¡Configuración completada!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📋 URLs disponibles:');
  asesoresActivos.forEach(asesor => {
    if (asesor.slug) {
      console.log(`   ${asesor.Aseror}: http://localhost:8080/${asesor.slug}`);
    }
  });
  console.log('');
}

main().catch(error => {
  console.error('💥 Error:', error.message);
  process.exit(1);
});
