import { Router } from 'https://deno.land/x/oak/mod.ts';
import { apiRouterV1 } from './v1/index.routes.ts';

export const router = new Router()
    .use('/v1', apiRouterV1.routes(), apiRouterV1.allowedMethods());
