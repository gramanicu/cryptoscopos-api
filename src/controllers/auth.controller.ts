/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import config from '../config/main';

const getAuth0Config = async (req: Request, res: Response, next: NextFunction) => {
    return res.json({
        domain: config.auth0.domain,
        clientId: config.auth0.clientId,
        audience: config.auth0.audience,
    });
};

const AuthController = {
    getAuth0Config,
};

export default AuthController;
