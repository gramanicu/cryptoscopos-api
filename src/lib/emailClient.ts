import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import config from '../config/main';

const transport = nodemailer.createTransport(
    {
        host: config.email.host,
        port: parseInt(config.email.port),
        disableFileAccess: true,
        disableUrlAccess: true,
        auth: {
            user: config.email.user,
            pass: config.email.pass,
        },
    },
    { from: 'notifications@cryptoscopos.com' }
);

export const send_email = async (options: MailOptions) => {
    await transport.sendMail(options);
};
