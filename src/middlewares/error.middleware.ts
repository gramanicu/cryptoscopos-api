import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

const errorMiddleware = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send({ msg: 'Invalid token' });
    }

    next(err);
};

export default errorMiddleware;
