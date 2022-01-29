import { getPostgresClient, mongoDB } from '../db/db.ts';
import { MONGO_VARS, POSTGRES_VARS } from '../config.ts';

const status = ({ response }: { response: any }) => {
    console.log(MONGO_VARS);
    console.log(POSTGRES_VARS);

    response.body = { msg: 'OK' };
    response.status = 200;

    console.log(mongoDB.name);

    getPostgresClient().then((client) => {}).catch((err) => {
        console.log(err);
    });
};

export default status;
