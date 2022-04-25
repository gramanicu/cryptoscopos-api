import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

const errorMiddleware = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send({ msg: 'Invalid token' });
    }

    if (err.name === 'InsufficientScopeError' || err.name === 'InvalidTokenError') {
        return res.status(403).send({ msg: 'No permissions for this route' });
    }

    next(err);
};

export default errorMiddleware;
