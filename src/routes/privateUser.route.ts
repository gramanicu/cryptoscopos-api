/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Router } from 'express';
import PrivateUserController from '../controllers/privateUser.controller';
import PrivateUserMiddleware from '../middlewares/privateUser.middleware';

const PrivateUserRouter: Router = express.Router();

PrivateUserRouter.post('/create', PrivateUserMiddleware, PrivateUserController.create);

export default PrivateUserRouter;
