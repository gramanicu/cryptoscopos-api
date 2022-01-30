import { config } from 'https://deno.land/x/dotenv/mod.ts';

// Check for DenoDeploy
if (
    typeof Deno.readFileSync == 'function' &&
    (await Deno.permissions.query({ name: 'read' })).state == 'granted'
) {
    config({ export: true });
}

// Application config vars
export const PORT = parseInt(Deno.env.get('PORT') || '4000');

// Mongo config vars
export const MONGO_VARS = {
    uri: Deno.env.get('MONGO_URI'),
    database: Deno.env.get('MONGO_DATABASE') || 'coinstore',
};

/**
 * Check if all required mongo variables are defined
 * @returns If the mongo variables are defined
 */
export const checkMongoVars = () => {
    return MONGO_VARS.uri != undefined;
};

// Postgres config vars
export const POSTGRES_VARS = {
    uri: Deno.env.get('POSTGRES_URI'),
    pool_size: parseInt(Deno.env.get('POSTGRES_POOLSIZE') || '20'),
};

/**
 * Check if all required postgres variables are defined
 * @returns If the postgres variables are defined
 */
export const checkPostgresVars = () => {
    return POSTGRES_VARS.uri != undefined;
};
