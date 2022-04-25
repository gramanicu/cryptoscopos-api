/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import _Service from '../services/_.service';
import CoinService from '../services/coins.service';
import auth0Manage from '../lib/auth0Manage';

const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const r = await auth0Manage.getUserInfo(req.params.query);
        return res.send(r);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        return res.sendStatus(500);
    }

    // try {
    //     return res.send(await CoinService.update_data());
    // } catch (e) {
    //     return res.sendStatus(500);
    // }
};

const _Controller = {
    index,
};

export default _Controller;
