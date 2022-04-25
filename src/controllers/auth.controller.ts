/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import config from '../config/main';
import UserService from '../services/users.service';

const getAuth0Config = async (req: Request, res: Response, next: NextFunction) => {
    return res.json({
        domain: config.auth0.api.domain,
        clientId: config.auth0.api.clientId,
        audience: config.auth0.api.audience,
    });
};

const registerAuth0User = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    // const user = await UserService.store({
    //     type:
    // })
    return res.json({
        data: req.body,
    });
};

const AuthController = {
    getAuth0Config,
    registerAuth0User,
};

export default AuthController;
