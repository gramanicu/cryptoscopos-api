import { MongoClient } from 'https://deno.land/x/mongo/mod.ts';
import { MONGO_VARS } from '../config.ts';

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

export const mongoDB = mongoClient.database(MONGO_VARS.database);
