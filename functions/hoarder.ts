import { cron } from 'https://deno.land/x/deno_cron/cron.ts';

const cg_host = 'api.coingecko.com';
const cg_api_path = '/api/v3';

const cg_options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
    },
};

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

cron('* * * * *', () => {
    ping_source();
    console.log('One minute passed');
});

const each_second = () => {
    ping_source();
    console.log('15 seconds passed');
};

setInterval(each_second, 15000);
