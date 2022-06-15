import { DateTime } from 'luxon';
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';
import updateTask from './jobs/update_data';
import errorMiddleware from './middlewares/error.middleware';
import config from './config/main';
import alertsTask from './jobs/check_alerts';
import AlertService from './services/alert.service';

dotenv.config();

// TODO - should be run separately
if (config.run_worker) {
    updateTask.start();
    alertsTask.start();
}
AlertService.checkAlerts();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', router);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
