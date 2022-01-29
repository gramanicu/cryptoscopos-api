import { cron } from 'https://deno.land/x/deno_cron/cron.ts';

const cg_host = 'api.coingecko.com';
const cg_api_path = '/api/v3';

const cg_options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
    },
};

const cron_every_hour = '0 * * * *';

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

    return true;
};

// Run the cronjob
cron(cron_every_hour, hoard_data);
