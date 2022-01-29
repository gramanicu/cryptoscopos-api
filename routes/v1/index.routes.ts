import { Router } from 'https://deno.land/x/oak/mod.ts';
import status from '../../controllers/status.ts';

const apiRouterV1 = new Router()
    .prefix('/v1');

apiRouterV1
    .redirect('/', '/v1/status')
    .get('/status', status);

export { apiRouterV1 };
