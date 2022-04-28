import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

const _Middleware = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    next(err);
};

export default _Middleware;
