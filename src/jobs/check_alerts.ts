import cron from 'node-cron';
import config from '../config/main';
import AlertService from '../services/alert.service';

const alertsTask = cron.schedule(config.crons.verify_alerts_cron, async () => {
    try {
        await AlertService.checkAlerts();
        console.log('Verified alerts');
    } catch (e) {
        console.error(e);
    }
});

alertsTask.start();

export default alertsTask;
