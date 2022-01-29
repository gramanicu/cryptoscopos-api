import { config } from 'https://deno.land/x/dotenv/mod.ts';

// Check for DenoDeploy
if (typeof Deno.readFileSync == 'function') {
    config({ export: true });
}

export const APP_HOST = Deno.env.get('APP_HOST') || '127.0.0.1';
export const APP_PORT = Deno.env.get('APP_PORT') || 4000;
