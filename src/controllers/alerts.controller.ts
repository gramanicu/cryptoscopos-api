/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AlertService from '../services/alert.service';
import UserService from '../services/users.service';

const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.show({
            where: { auth0_id: res.locals.auth0_id },
        });

        if (user) {
            const accounts = await AlertService.all_alerts(user.id);
            return res.send(accounts);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        return res.sendStatus(500);
    }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.id) return res.sendStatus(400);

    try {
        const alert = await AlertService.get_alert({
            where: {
                id: req.params.id,
            },
        });

        return res.send(alert);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        return res.sendStatus(500);
    }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.sendStatus(400);
    if (!req.body.name || !req.body.description || !req.body.trigger || !req.body.message) return res.sendStatus(400);

    try {
        const user = await UserService.show({
            where: { auth0_id: res.locals.auth0_id },
        });

        const isValid = await AlertService.isValidAlertString(req.body.trigger);

        if (user && isValid) {
            const alert = await AlertService.create_alert({
                name: req.body.name,
                description: req.body.description,
                trigger: req.body.trigger,
                notifications: {
                    create: {
                        message: req.body.message,
                        type: 'EMAIL',
                    },
                },
                createdBy: {
                    connect: {
                        id: user.id,
                    },
                },
            });
            return res.send(alert);
        }
        return res.sendStatus(404);
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        return res.sendStatus(500);
    }
};

const reset = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.id) return res.sendStatus(400);

    try {
        const alert = await AlertService.reset_alert(req.params.id);
        if (alert) {
            return res.send(alert);
        }
        return res.sendStatus(404);
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        return res.sendStatus(500);
    }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.id) return res.sendStatus(400);

    try {
        const alert = await AlertService.remove_alert({
            where: {
                id: req.params.id,
            },
        });
        if (alert) {
            return res.send(alert);
        }
        return res.sendStatus(404);
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        return res.sendStatus(500);
    }
};

const AlertController = {
    index,
    create,
    get,
    reset,
    remove,
};

export default AlertController;
