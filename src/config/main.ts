import { Duration } from 'luxon';
import cronsConfig from './crons';
import auth0Config from './auth0';
import process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
    coindata_update_interval: Duration.fromObject({ hour: 1 }),
    crons: cronsConfig,
    auth0: auth0Config,
    redis_url: process.env.REDIS_URL,
};
