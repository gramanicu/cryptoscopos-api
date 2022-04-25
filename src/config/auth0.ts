import { env } from 'process';

export default {
    domain: env.AUTH0_DOMAIN,
    clientId: env.AUTH0_CLIENT_ID,
    audience: env.AUTH0_AUDIENCE,
};
