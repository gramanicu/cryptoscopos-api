import { Alert, Prisma } from '@prisma/client';
import { DateTime, Duration } from 'luxon';
import auth0Manage from '../lib/auth0Manage';
import { send_email } from '../lib/emailClient';
import prisma from '../lib/prismaClient';
import CoinService from './coins.service';

const isValidAlertString = async (trigger: string): Promise<boolean> => {
    const words = trigger.split(' ');

    if (words.length < 4) {
        return false;
    }

    const subject = words[0];
    const condition = words[2];
    const isPercent = words[3][words[3].length - 1] === '%' ? true : false;

    if (isPercent && subject === 'coin_value' && words.length == 5) {
        const period = parseInt(words[5]);

        if (period > 0 && (condition === '+' || condition === '-')) {
            return true;
        }
    } else if (
        !isPercent &&
        (subject === 'account_value' || subject === 'account_profit') &&
        (condition === '>=' || condition === '<=')
    ) {
        return true;
    }

    return false;
};

/**
 * Check if an alert should be triggered
 * @param alert The alert
 * @returns If it should trigger. For the format of the "trigger" string, check the documentation.
 */
const isTriggered = async (alert: Alert): Promise<boolean> => {
    const trigger = alert.trigger;
    const words = trigger.split(' ');

    if (words.length < 4) {
        return false;
    }

    const subject = words[0];
    const id = words[1];
    const condition = words[2];
    const isPercent = words[3][words[3].length - 1] === '%' ? true : false;
    const amount = isPercent ? parseFloat(words[3].slice(0, -1)) : parseFloat(words[3]);

    if (isPercent && subject === 'coin_value') {
        // Percents can be applied only to changes where there is "historical" data.
        const period = parseInt(words[5]);
        const interval = Duration.fromMillis(period);

        const cmp_data = await CoinService.get_closest_data(id, DateTime.now().minus(interval));
        const crr_data = await CoinService.get_current_data(id);

        if (!cmp_data || !crr_data) {
            return false;
        }

        if (condition === '+' && crr_data.value >= cmp_data.value * 0.01 * amount) {
            return true;
        }
        if (condition === '-' && crr_data.value <= cmp_data.value * 0.01 * amount) {
            return true;
        }

        return false;
    } else if (condition === '>=' || condition === '<=') {
        if (subject === 'coin_value') {
            const coinData = await CoinService.get_current_data(id);

            if (coinData) {
                if (condition === '>=' && coinData.value >= amount) {
                    return true;
                }

                if (condition === '<=' && coinData.value <= amount) {
                    return true;
                }
            }

            return false;
        } else if (subject === 'account_value' || subject === 'account_profit') {
            const account = await prisma.account.findFirst({
                where: {
                    id: id,
                },
                include: {
                    transactions: true,
                    currency: true,
                },
            });

            if (!account) {
                return false;
            }

            const coin_data = await CoinService.get_current_data(account.currency.coingeckoId);

            if (!coin_data) {
                return false;
            }

            let acc_value = 0;
            let acc_profit = 0;
            let acc_amount = 0;

            for (const t of account.transactions) {
                acc_amount += t.amount;
                acc_profit -= t.amount * t.value;
            }

            acc_value = acc_amount * coin_data.value;
            acc_profit += acc_value;

            const toCompare = subject === 'account_value' ? acc_value : acc_profit;

            if (condition === '>=' && toCompare >= amount) {
                return true;
            }

            if (condition === '<=' && toCompare <= amount) {
                return true;
            }

            return false;
        }
    }

    return false;
};

const checkAlerts = async () => {
    const alerts = await prisma.alert.findMany({ include: { notifications: true, createdBy: true } });

    for (const alert of alerts) {
        if (alert.isActive) {
            const triggered = await isTriggered(alert);

            if (triggered) {
                for (const notification of alert.notifications) {
                    switch (notification.type) {
                        case 'DISCORD':
                            {
                                // TODO
                            }
                            break;
                        case 'EMAIL':
                            {
                                if (alert.createdBy.auth0_id) {
                                    const userInfo = await auth0Manage.getUserInfo(alert.createdBy.auth0_id);
                                    const email = JSON.parse(userInfo).email;

                                    send_email({
                                        to: email,
                                        subject: `Alert triggered`,
                                        text: notification.message,
                                    });
                                }
                            }
                            break;
                    }
                }
            }

            await prisma.alert.update({
                where: {
                    id: alert.id,
                },
                data: {
                    isActive: false,
                },
            });
        }
    }
};

/**
 * Create a new alert
 * @param data The alert data
 * @returns The created alert, if the operation succeeded
 */
const create_alert = async (data: Prisma.AlertCreateInput): Promise<Alert | null> => {
    try {
        const alert = await prisma.alert.create({
            data: data,
        });

        return alert;
    } catch (err) {
        return null;
    }
};

/**
 * Delete an alert
 * @param searchFor What alert to delete
 * @returns The alert account
 */
const remove_alert = async (searchFor: Prisma.AlertDeleteArgs): Promise<Alert | null> => {
    try {
        const alert = await prisma.alert.delete(searchFor);
        return alert;
    } catch (err) {
        return null;
    }
};

/**
 * Set the status of an alert to "not triggered"
 * @param id The id of the alert to reset
 */
const reset_alert = async (id: string): Promise<Alert | null> => {
    try {
        const alert = await prisma.alert.update({
            where: {
                id: id,
            },
            data: {
                isActive: true,
            },
        });
        return alert;
    } catch (err) {
        return null;
    }
};

const all_alerts = async (userId: string): Promise<Alert[]> => {
    try {
        const alerts = await prisma.alert.findMany({
            where: {
                userId: userId,
            },
        });
        return alerts;
    } catch {
        return [];
    }
};

const get_alert = async (searchFor: Prisma.AlertFindFirstArgs): Promise<Alert | null> => {
    try {
        const alert = await prisma.alert.findFirst(searchFor);
        return alert;
    } catch {
        return null;
    }
};

const AlertService = {
    isTriggered,
    checkAlerts,
    isValidAlertString,
    create_alert,
    remove_alert,
    reset_alert,
    all_alerts,
    get_alert,
};

export default AlertService;
