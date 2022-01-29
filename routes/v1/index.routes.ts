import { Router } from 'https://deno.land/x/oak/mod.ts';
import status from '../../controllers/status.ts';

const apiRouterV1 = new Router()
    .redirect('/', '/status')
    .get('/status', status);

export { apiRouterV1 };
