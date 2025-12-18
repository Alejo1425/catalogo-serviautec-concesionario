
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
const TABLE_ID = 'mk3y12zsd2xgngl'; // Asesores table

const CHATWOOT_BASE_URL = process.env.VITE_CHATWOOT_BASE_URL;
const CHATWOOT_API_TOKEN = process.env.VITE_CHATWOOT_API_TOKEN;
const CHATWOOT_ACCOUNT_ID = process.env.VITE_CHATWOOT_ACCOUNT_ID || '1';

async function fetchAdvisors() {
    if (!NOCODB_BASE_URL || !NOCODB_TOKEN) {
        throw new Error('Faltan credenciales de NocoDB');
    }
    const endpoint = `${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records`;
    const response = await fetch(endpoint, {
        headers: { 'xc-token': NOCODB_TOKEN }
    });
    if (!response.ok) throw new Error(`Error NocoDB: ${response.status}`);
    const data = await response.json();
    return data.list.filter((a: any) => a.Activo === 1 && a.slug);
}

async function fetchCannedResponses() {
    if (!CHATWOOT_BASE_URL || !CHATWOOT_API_TOKEN) {
        throw new Error('Faltan credenciales de Chatwoot (VITE_CHATWOOT_BASE_URL, VITE_CHATWOOT_API_TOKEN)');
    }
    const url = `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/canned_responses`;
    const response = await fetch(url, {
        headers: {
            'api_access_token': CHATWOOT_API_TOKEN,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        // Log body for debugging
        const text = await response.text();
        throw new Error(`Error Fetching Chatwoot Responses: ${response.status} - ${text}`);
    }
    const json = await response.json();
    return json;
}

async function createCannedResponse(shortCode: string, content: string) {
    const url = `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/canned_responses`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'api_access_token': CHATWOOT_API_TOKEN!,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            short_code: shortCode,
            content: content
        })
    });
    if (!response.ok) {
        const text = await response.text();
        console.error(`❌ Error creando ${shortCode}: ${response.status}`, text);
        return false;
    }
    console.log(`✅ Creada: ${shortCode}`);
    return true;
}

async function deleteCannedResponse(id: number, shortCode: string) {
    const url = `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/canned_responses/${id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'api_access_token': CHATWOOT_API_TOKEN!,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        console.error(`❌ Error eliminando ${shortCode}: ${response.status}`);
        return false;
    }
    console.log(`🗑️ Eliminada: ${shortCode}`);
    return true;
}

async function sync() {
    console.log('🚀 Iniciando sincronización de Respuestas Predefinidas...');

    try {
        // 1. Obtener asesores
        const asesores = await fetchAdvisors();
        console.log(`📋 ${asesores.length} asesores encontrados.`);

        // 2. Obtener respuestas actuales
        const rawResponses = await fetchCannedResponses();
        // Chatwoot API v1: GET /canned_responses -> payload is { payload: [...] } or [...]
        // Inspecting structure to be safe
        let currentList: any[] = [];
        if (Array.isArray(rawResponses)) {
            currentList = rawResponses;
        } else if (rawResponses.payload && Array.isArray(rawResponses.payload)) {
            currentList = rawResponses.payload;
        } else if (rawResponses.data && Array.isArray(rawResponses.data)) {
            currentList = rawResponses.data;
        }

        console.log(`📋 ${currentList.length} respuestas existentes en Chatwoot.`);

        const existingMap = new Map();
        currentList.forEach((r: any) => existingMap.set(r.short_code, r));

        // 3. Procesar cada asesor (Actualizando URL dinámica)
        for (const asesor of asesores) {
            const shortCode = `/catalogo-${asesor.slug}`;
            const content = `¡Hola! 👋

Aquí tienes mi catálogo personalizado con todas las motos:
👉 https://autorunai.tech/asesor/{{agent.name}}?cid={{conversation.id}}

Si te gusta alguna, dale clic a "Me interesa" y hablamos. 🏍️💨`;

            if (existingMap.has(shortCode)) {
                // Delete to recreate with new content
                console.log(`🔄 Actualizando ${shortCode}...`);
                const oldId = existingMap.get(shortCode).id;
                await deleteCannedResponse(oldId, shortCode);
            }

            await createCannedResponse(shortCode, content);
        }

        // 4. Crear respuesta genérica "/catalogo"
        const genericCode = '/catalogo';
        const genericContent = `¡Hola! 👋

Aquí tienes mi catálogo personalizado con todas las motos:
👉 https://autorunai.tech/asesor/{{agent.name}}?cid={{conversation.id}}

Si te gusta alguna, dale clic a "Me interesa" y hablamos. 🏍️💨`;

        if (existingMap.has(genericCode)) {
            console.log('🔄 Actualizando respuesta genérica /catalogo...');
            await deleteCannedResponse(existingMap.get(genericCode).id, genericCode);
        }
        await createCannedResponse(genericCode, genericContent);

        console.log('\n✨ Sincronización completada con éxito.');

    } catch (error) {
        console.error('❌ Error general:', error);
    }
}

sync();
