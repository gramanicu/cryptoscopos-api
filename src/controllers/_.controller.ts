/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import _Service from '../services/_.service';
import GeckoService from '../services/gecko.service';

const index = async (req: Request, res: Response, next: NextFunction) => {
    return res.send(await GeckoService.get_data(["ethereum", "bitcoin"]));
};

const _Controller = {
    index,
};

export default _Controller;
