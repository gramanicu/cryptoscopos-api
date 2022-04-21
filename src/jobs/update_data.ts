import cron from 'node-cron';
import config from '../config/main';
import CoinService from '../services/coins.service';

const updateTask = cron.schedule(config.crons.update_data_cron, async () => {
    try {
        await CoinService.update_data();
        console.log('Updated CoinData entries');
    } catch (e) {
        console.error(e);
    }
});

updateTask.start();

export default updateTask;
