import { Application } from 'https://deno.land/x/oak/mod.ts';
import { PORT } from './config.ts';
import { router } from './routes/router.ts';
import notFound from './controllers/404.ts';
import { checkMongoVars, checkPostgresVars } from './config.ts';

if (!checkPostgresVars() || !checkMongoVars()) {
    console.error(
        'Not all the environment variables are defined. Check the example',
    );
    Deno.exit(1);
}

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
app.use(notFound);

console.log(`Listening on port:${PORT}...`);

await app.listen({ port: PORT });
