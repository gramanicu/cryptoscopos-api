import { NextFunction, Request, Response } from 'express';
import auth0Manage from '../lib/auth0Manage';
import { redis } from '../lib/redisClient';

const redisPrefix = 'userinfo-';

const UserInfoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        const key = `${redisPrefix}${token}`;

        if (!(await redis.exists(key))) {
            try {
                const userString = await auth0Manage.getTokenUserInfo(token);
                await redis.set(key, userString, 'EX', 1800);
                next();
            } catch (err) {
                res.sendStatus(403);
                res.end();
            }
        } else {
            res.locals.auth0_id = JSON.parse(String(await redis.get(key))).sub;
            next();
        }
    }
};

export default UserInfoMiddleware;
