/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { DateTime } from 'luxon';
import prisma from '../lib/prismaClient';

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

const MiscController = {
    site_stats,
};

export default MiscController;
