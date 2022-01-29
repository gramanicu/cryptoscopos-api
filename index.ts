import { Application } from 'https://deno.land/x/oak/mod.ts';
import { PORT } from './config.ts';
import { loadRoutes, router } from './routes/router.ts';
import notFound from './controllers/404.ts';

const app = new Application();

loadRoutes();

app.use(router.routes());
app.use(router.allowedMethods());
app.use(notFound);

console.log(`Listening on port:${PORT}...`);

await app.listen({ port: PORT });
