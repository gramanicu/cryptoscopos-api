import { Duration } from 'luxon';
import cronsConfig from './crons';
import auth0Config from './auth0';

export default {
    coindata_update_interval: Duration.fromObject({ hour: 1 }),
    crons: cronsConfig,
    auth0: auth0Config,
};
