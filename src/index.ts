import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';
import updateTask from './jobs/update_data';

// TODO - should be run separately
updateTask.start();

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});