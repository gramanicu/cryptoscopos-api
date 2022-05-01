import axios from 'axios';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import UserService from '../services/users.service';

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.store({
            private_id: res.locals.private_id,
        });
        return res.send(user);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

const PrivateUserController = {
    create,
};

export default PrivateUserController;
