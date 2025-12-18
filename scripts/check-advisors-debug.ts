
import { AsesorService } from '../src/services/nocodb/asesor.service';
import { nocodbConfig } from '../src/config/env';

// Mock env vars if needed or ensure they are loaded
// In a script context, we might need to load .env manually if not using a runner that does it
// But since we are likely running with tsx or similar which might not load vite envs automatically,
// we might need to rely on the fact that we are in the same environment or use dotenv.
// However, the project seems to use `import.meta.env` which is Vite specific.
// Running this script might fail if it relies on `import.meta.env`.
// I will try to read .env file manually if needed, but first let's try assuming the environment acts like a node process if we use `tsx` and maybe `dotenv`.

// Actually, `src/config/env.ts` uses `import.meta.env`. This won't work in standard node/tsx without setup.
// I will modify the script to read .env directly or define the variables.

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

// Polyfill import.meta.env for the config file to work (if possible) OR simply mock the config here.
// Since I cannot easily polyfill import.meta.env in this context without a complex setup, 
// I will bypass the service configuration and instantiate the client or service with manual config if possible.
// But `AsesorService` imports `nocodbConfig` which uses `import.meta.env`.
// This is a problem for running `src` code in a standalone script if it's Vite-coupled.

// Plan B: Write a script that DOES NOT import from src, but re-implements the fetch logic.
// This is safer and easier.

const NOCODB_BASE_URL = process.env.VITE_NOCODB_BASE_URL;
const NOCODB_TOKEN = process.env.VITE_NOCODB_TOKEN;
const TABLE_ID = 'mk3y12zsd2xgngl'; // Asesores table ID from env.ts

if (!NOCODB_BASE_URL || !NOCODB_TOKEN) {
    console.error("Missing env vars");
    process.exit(1);
}

async function fetchAdvisors() {
    const url = `${NOCODB_BASE_URL}/api/v1/db/data/noco/${process.env.VITE_NOCODB_BASE_ID}/${TABLE_ID}/views/vw4k348w8215q54r/records`; // View ID might be guessed or just use table records
    // Actually, constructing the URL for NocoDB:
    // Base: VITE_NOCODB_BASE_URL
    // Path: /api/v2/tables/{tableId}/records  (V2 API)
    // or /api/v1/db/data/noco/{project}/{table}/records (V1 API)

    // Checking `client.ts` would reveal the API version. 
    // Let's assume the project uses the config in `env.ts`.
    // `src/services/nocodb/client.ts` uses `nocodbConfig.baseUrl`.

    // Let's use the V2 API which seems standard for NocoDB now, or check client.ts.
    // Wait, I can see `src/services/nocodb/client.ts` in the file list. I can check it.

    // For now, I'll assume standard fetch.

    try {
        // Trying V2 Table API
        const endpoint = `${NOCODB_BASE_URL}/api/v2/tables/${TABLE_ID}/records`;
        console.log(`Fetching from ${endpoint}...`);

        const response = await fetch(endpoint, {
            headers: {
                'xc-token': NOCODB_TOKEN
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${await response.text()}`);
        }

        const data = await response.json();
        const advisors = data.list;

        console.log('--- ADVISORS ---');
        console.table(advisors.map((a: any) => ({
            Id: a.Id,
            Name: a.Aseror, // Typo in DB
            Slug: a.slug,
            Phone: a.Phone,
            Activo: a.Activo,
            Email: a.Email
        })));

    } catch (error) {
        console.error("Error fetching advisors:", error);
    }
}

fetchAdvisors();
