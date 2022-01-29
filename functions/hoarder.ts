import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { cron } from 'https://deno.land/x/deno_cron/cron.ts';
import { mongoDB } from '../db/mongo.ts';
import { PORT } from '../config.ts';
import { htmlPage } from './hoarder.web.ts';
import { checkMongoVars } from '../config.ts';

const cg_host = 'api.coingecko.com';
const cg_api_path = '/api/v3';

const cg_options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
    },
};

const cron_every_hour = '0 * * * *';

if (!checkMongoVars()) {
    console.error(
        'Not all the environment variables are defined. Check the example',
    );
    Deno.exit(1);
}

/**
 * Check if the data source is available
 * @returns If the CoinGecko API is online
 */
const ping_source = async () => {
    const res = await fetch(
        `https://${cg_host}${cg_api_path}/ping`,
        cg_options,
    );

    if (res.ok) {
        return true;
    } else {
        return false;
    }
};

/**
 * Retrieves and stores data from CoinGecko API
 * @returns If the operation was successful
 */
const hoard_data = async () => {
    const api_online = await ping_source();

    if (!api_online) return false;

    // Call api's and update db
    console.log(mongoDB.name);

    return true;
};

// Run the cronjob
cron(cron_every_hour, hoard_data);

// The webpage
const router = new Router();
router.get('/', ({ response }: { response: any }) => {
    response.status = 200;
    response.headers.set('Content-Type', 'text/html');

    // Send actual data
    response.body = htmlPage(
        `I am the coin Hoarder, and my stash is ${mongoDB.name}`,
    );
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port:${PORT}...`);
await app.listen({ port: PORT });
