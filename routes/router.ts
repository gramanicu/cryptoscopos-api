import { Router } from 'https://deno.land/x/oak/mod.ts';
import { loadV1Routes } from './v1/index.routes.ts';

export const router = new Router();

export const loadRoutes = () => {
    loadV1Routes();
};
