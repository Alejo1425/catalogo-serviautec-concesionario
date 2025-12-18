
import { AsesorService } from '../src/services/nocodb/asesor.service';
// Mock fetch for standalone execution if needed, but we rely on tsx loading .env via dotenv or similar if configured.

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

const NOCODB_BASE_URL = process.env.VITE_NOCODB_BASE_URL;
const NOCODB_TOKEN = process.env.VITE_NOCODB_TOKEN;
const NOCODB_BASE_ID = process.env.VITE_NOCODB_BASE_ID;
const TABLE_ID = 'mk3y12zsd2xgngl'; // Asesores table

console.log('Generando respuestas predefinidas para Chatwoot...');
console.log('================================================');

async function generateResponses() {
    if (!NOCODB_BASE_URL || !NOCODB_TOKEN) {
        console.error('❌ Faltan variables de entorno VITE_NOCODB_BASE_URL o VITE_NOCODB_TOKEN');
        return;
    }

    try {
        const endpoint = `${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records`;
        const response = await fetch(endpoint, {
            headers: {
                'xc-token': NOCODB_TOKEN
            }
        });

        if (!response.ok) {
            throw new Error(`Error API: ${response.status}`);
        }

        const data = await response.json();
        const asesores = data.list.filter((a: any) => a.Activo === 1); // Solo activos

        console.log(`✅ Se encontraron ${asesores.length} asesores activos.\n`);

        console.log(`⚠️ INSTRUCCIONES PARA EL ADMINISTRADOR:`);
        console.log(`1. Ve a Chatwoot -> Ajustes -> Respuestas predefinidas`);
        console.log(`2. ELIMINA la respuesta actual llamada "/catalogo"`);
        console.log(`3. Crea una NUEVA respuesta para CADA asesor usando estos datos:\n`);

        for (const asesor of asesores) {
            if (!asesor.slug) {
                console.log(`⚠️ Saltando ${asesor.Aseror} (sin slug)`);
                continue;
            }

            const shortCode = `/catalogo-${asesor.slug}`;

            console.log(`👤 ASESOR: ${asesor.Aseror}`);
            console.log(`   Short Code: ${shortCode}`);
            console.log(`   Contenido:`);
            console.log(`   ----------------------------------------`);
            console.log(`   ¡Hola! 👋`);
            console.log(``);
            console.log(`   Aquí tienes mi catálogo personalizado con todas las motos:`);
            console.log(`   👉 https://autorunai.tech/${asesor.slug}?cid={{conversation.id}}`);
            console.log(``);
            console.log(`   Si te gusta alguna, dale clic a "Me interesa" y hablamos. 🏍️💨`);
            console.log(`   ----------------------------------------\n`);
        }

        console.log(`💡 TIP: Dile a tus asesores que escriban "/" en el chat para buscar su nombre.`);

    } catch (error) {
        console.error('Error:', error);
    }
}

generateResponses();
