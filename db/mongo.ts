import { MongoClient } from 'https://deno.land/x/mongo/mod.ts';
import { MONGO_VARS } from '../config.ts';

// Mongo Database
const mongoClient = new MongoClient();

try {
    await mongoClient.connect(MONGO_VARS.uri!);
} catch (error) {
    console.error(error);
}

export const mongoDB = mongoClient.database(MONGO_VARS.database);
