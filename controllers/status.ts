import { getPostgresClient } from './../db/postgres.ts';
import { mongoDB } from '../db/mongo.ts';
import { PoolClient } from 'https://deno.land/x/postgres/mod.ts';

const status = async ({ response }: { response: any }) => {
    const data = {
        msg: 'OK',
        mongo: '',
        postgres: '',
    };
    response.status = 200;

    data.mongo = mongoDB.name;

    try {
        const client = await getPostgresClient();
        data.postgres = String(client.connected);
    } catch (err) {
        console.log(err);
        response.status = 500;
    }

    response.body = data;
};

export default status;
