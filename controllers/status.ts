import { getPostgresClient } from './../db/postgres.ts';
import { mongoDB } from '../db/mongo.ts';
import { PoolClient } from 'https://deno.land/x/postgres/mod.ts';

const status = ({ response }: { response: any }) => {
    response.body = { msg: 'OK' };
    response.status = 200;

    console.log(mongoDB.name);

    getPostgresClient().then((client: PoolClient) => {}).catch((err) => {
        console.log(err);
    });
};

export default status;
