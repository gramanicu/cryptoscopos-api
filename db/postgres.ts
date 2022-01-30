import { Pool, PoolClient } from 'https://deno.land/x/postgres/mod.ts';
import { POSTGRES_VARS } from '../config.ts';

// PostgreSQL Database
export const postgresPool = new Pool(
    POSTGRES_VARS.uri,
    POSTGRES_VARS.pool_size,
    true,
);

/**
 * Create a new postgres client from the pool
 * @returns A new postgres client
 */
export const getPostgresClient = async () => {
    const client = await postgresPool.connect();

    return client;
};

/**
 * Release a postgres client into the pool
 * @param client The client to release back into the connection pool
 */
export const releasePostgresClient = (client: PoolClient) => {
    client.release();
};
