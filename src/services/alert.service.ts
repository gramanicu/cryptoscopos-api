import { Alert } from '@prisma/client';
import prisma from '../lib/prismaClient';
import CoinService from './coins.service';

/**
 * Check if an alert should be triggered
 * @param alert The alert
 * @returns If it should trigger. For the format of the "trigger" string, check the documentation.
 */
const isTriggered = async (alert: Alert): Promise<boolean> => {
    const trigger = alert.trigger;
    const words = trigger.split(' ');

    if (words.length < 4) {
        console.log('Not enough words');
        return false;
    }

    const subject = words[0];
    const id = words[1];
    const condition = words[2];
    const isPercent = words[3][words[3].length - 1] === '%' ? true : false;
    const amount = isPercent ? parseFloat(words[3].slice(0, -1)) : parseFloat(words[3]);

    if (isPercent && subject === 'coin_value') {
        const period = parseInt(words[5]);
        const coin = await prisma.coin.findFirst({
            where: {
                coingeckoId: id,
            },
        });

        return false;
    } else if (condition === '>=' || condition === '<=') {
        if (subject === 'coin_value') {
            const coinData = await CoinService.get_stats(id);

            if (coinData && coinData.value != 'unavailable') {
                if (condition === '>=' && coinData.value >= amount) {
                    return true;
                } else if (condition === '<=' && coinData.value <= amount) {
                    return true;
                }
                return false;
            }

            return false;
        } else if (subject === 'account_value' || subject === 'account_profit') {
            const account = await prisma.account.findFirst({
                where: {
                    id: id,
                },
            });

            return false;
        }
    }

    return false;
};

const AlertService = {
    isTriggered,
};

export default AlertService;
