import { config } from 'https://deno.land/x/dotenv/mod.ts';

// Check for DenoDeploy
if (typeof Deno.readFileSync == 'function') {
    config({ export: true });
}

export const PORT: number = parseInt(Deno.env.get('PORT') || '4000');
