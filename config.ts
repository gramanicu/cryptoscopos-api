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
    database: Deno.env.get('POSTGRES_DATABASE') || 'postgres',
    host: Deno.env.get('POSTGRES_HOST'),
    port: parseInt(Deno.env.get('POSTGRES_PORT') || '27017'),
    username: Deno.env.get('POSTGRES_USERNAME'),
    password: Deno.env.get('POSTGRES_PASSWORD'),
    pool_size: parseInt(Deno.env.get('POSTGRES_POOLSIZE') || '20'),
};

/**
 * Check if all required postgres variables are defined
 * @returns If the postgres variables are defined
 */
export const checkPostgresVars = () => {
    return POSTGRES_VARS.database != undefined &&
        POSTGRES_VARS.host != undefined &&
        POSTGRES_VARS.username != undefined &&
        POSTGRES_VARS.password != undefined;
};
