/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Router } from 'express';
import CoinsController from '../controllers/coins.controller';
import checkJwt from '../middlewares/auth0.middleware';

const CoinsRouter: Router = express.Router();

CoinsRouter.get('/', checkJwt, CoinsController.index);

export default CoinsRouter;
