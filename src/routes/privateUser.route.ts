/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Router } from 'express';
import PrivateUserController from '../controllers/privateuser.controller';
import PrivateUserMiddleware from '../middlewares/privateuser.middleware';

const PrivateUserRouter: Router = express.Router();

PrivateUserRouter.post('/create', PrivateUserMiddleware, PrivateUserController.create);

export default PrivateUserRouter;
