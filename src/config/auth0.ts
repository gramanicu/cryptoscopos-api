import process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

const api = {
    domain: process.env.AUTH0_API_DOMAIN,
    clientId: process.env.AUTH0_API_CLIENT_ID,
    audience: process.env.AUTH0_API_AUDIENCE,
};

const m2m = {
    secret: process.env.AUTH0_M2M_SECRET,
    clientId: process.env.AUTH0_M2M_CLIENT_ID,
    audience: process.env.AUTH0_M2M_AUDIENCE,
};

export default {
    api,
    m2m,
};
