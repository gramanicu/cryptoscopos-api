import { Duration } from 'luxon';
import cronsConfig from './crons';

export default {
    coindata_update_interval: Duration.fromObject({ hour: 1 }),
    crons: cronsConfig,
};
