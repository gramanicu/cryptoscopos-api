import { NextFunction, Request, Response } from "express";
import _Service from '../services/_.service';

const index = async (req: Request, res:Response, next: NextFunction) => {
    return res.sendStatus(await _Service.empty());
}

const _Controller = {
    index
};

export default _Controller;