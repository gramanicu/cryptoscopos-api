import { getPostgresClient, mongoDB } from '../db/db.ts';

const status = ({ response }: { response: any }) => {
    response.body = { msg: 'OK' };
    response.status = 200;

    console.log(mongoDB.name);

    getPostgresClient().then((client) => {}).catch((err) => {
        console.log(err);
    });
};

export default status;
