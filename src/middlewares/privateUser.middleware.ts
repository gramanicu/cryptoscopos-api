import { NextFunction, Request, Response } from 'express';

const PrivateUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers && req.headers.private_id) {
        res.locals.private_id = req.headers.private_id;
    }
    next();
};

export default PrivateUserMiddleware;
