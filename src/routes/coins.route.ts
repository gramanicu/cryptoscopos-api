/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Router } from 'express';
import CoinsController from '../controllers/coins.controller';

const CoinsRouter: Router = express.Router();

CoinsRouter.get('/', CoinsController.index);

export default CoinsRouter;
