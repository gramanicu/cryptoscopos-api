import { auth } from 'express-oauth2-jwt-bearer';
import config from '../config/main';

const checkJwt = auth({
    audience: config.auth0.api.audience,
    issuerBaseURL: `https://${config.auth0.api.domain}`,
});

export default checkJwt;
