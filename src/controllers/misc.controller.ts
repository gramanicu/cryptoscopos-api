/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { DateTime } from 'luxon';
import prisma from '../lib/prismaClient';
import { Prisma } from '@prisma/client';
import CoinService from '../services/coins.service';

const site_stats = async (req: Request, res: Response, next: NextFunction) => {
    const usersCount = (await prisma.user.findMany()).length;
    const coinsCount = (await prisma.coin.findMany()).length;
    const dataCount = (
        await prisma.coinData.findMany({
            where: {
                timestamp: {
                    gte: DateTime.now().minus({ days: 1 }).startOf('day').toJSDate(),
                    lte: DateTime.now().startOf('day').toJSDate(),
                },
            },
        })
    ).length;

    return res.send({
        usersCount,
        coinsCount,
        dataCount,
    });
};

const user_stats = async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals) return res.sendStatus(400);
    if (!res.locals.auth0_id) return res.sendStatus(400);

    try {
        const userData = await prisma.user.findFirst({
            where: {
                id: res.locals.auth0_id,
            },
            include: {
                accounts: {
                    include: {
                        currency: true,
                        transactions: true,
                    },
                },
                alerts: true,
            },
        });

        let totalValue = 0;
        let totalProfit = 0;

        if (userData) {
            for (const account of userData.accounts) {
                const coin_data = await CoinService.get_current_data(account.currency.coingeckoId);

                if (!coin_data) {
                    return res.sendStatus(500);
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

                totalValue += acc_value;
                totalProfit += acc_profit;
            }

            return res.send({
                accountCount: userData.accounts.length,
                alertCount: userData.alerts.length,
            });
        }
        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        return res.sendStatus(500);
    }
};

const MiscController = {
    site_stats,
    user_stats,
};

export default MiscController;
