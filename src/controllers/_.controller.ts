import { Prisma, Coin } from '@prisma/client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import _Service from '../services/_.service';
import GeckoService from '../services/gecko.service';
import CoinService from '../services/coins.service';
import { readSync } from 'fs';

const index = async (req: Request, res: Response, next: NextFunction) => {
    // try {
    //     const r = await CoinService.get_data(req.params.query);
    //     return res.send(r);
    // } catch (e) {
    //     if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
    //     return res.sendStatus(500);
    // }

    try {
        await CoinService.update_info();
        return res.sendStatus(200);
    } catch (e) {
        return res.sendStatus(500);
    }
};

const _Controller = {
    index,
};

export default _Controller;
