/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import CoinService from '../services/coins.service';

const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const r = await CoinService.index();
        return res.send(r);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        return res.sendStatus(500);
    }
};

const CoinsController = {
    index,
};

export default CoinsController;
