/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import config from '../config/main';
import UserService from '../services/users.service';
import auth0Manage from '../lib/auth0Manage';

const getAuth0Config = async (req: Request, res: Response, next: NextFunction) => {
    return res.json({
        domain: config.auth0.api.domain,
        clientId: config.auth0.api.clientId,
        audience: config.auth0.api.audience,
    });
};

const registerAuth0User = async (req: Request, res: Response, next: NextFunction) => {
    // Create the user in the DB
    const auth0_id = String(req.body.params.auth0_id);
    await UserService.store({ auth0_id });
    await auth0Manage.makeUserDefault(auth0_id);

    return res.sendStatus(200);
};

const AuthController = {
    getAuth0Config,
    registerAuth0User,
};

export default AuthController;
