import process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
    host: process.env.EMAIL_HOST || '',
    port: process.env.EMAIL_PORT || '',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
};
