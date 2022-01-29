import { MongoClient } from 'https://deno.land/x/mongo/mod.ts';
import {
    Pool as PostgresPool,
    PoolClient,
} from 'https://deno.land/x/postgres/mod.ts';
import { MONGO_VARS, POSTGRES_VARS } from '../config.ts';

// PostgreSQL Database
const postgresPool = new PostgresPool(
    {
        database: POSTGRES_VARS.database,
        hostname: POSTGRES_VARS.host,
        host_type: 'tcp',
        password: POSTGRES_VARS.password,
        port: POSTGRES_VARS.port,
        user: POSTGRES_VARS.username,
        tls: {
            enabled: false,
            enforce: false,
        },
    },
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

// Mongo Database
const mongoClient = new MongoClient();

try {
    await mongoClient.connect({
        // Force the assign, as we know they are defined (and strings)
        db: MONGO_VARS.database!,
        tls: true,
        servers: [
            {
                host: MONGO_VARS.host!,
                port: 27017,
            },
        ],
        credential: {
            username: MONGO_VARS.username!,
            password: MONGO_VARS.password!,
            db: MONGO_VARS.database!,
            mechanism: 'SCRAM-SHA-1',
        },
    });
} catch (error) {
    console.error(error);
}

const mongoDB = mongoClient.database(MONGO_VARS.database);

export { mongoDB, postgresPool };
