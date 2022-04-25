/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Router } from 'express';
import CoinsController from '../controllers/coins.controller';
import checkJwt from '../middlewares/auth0.middleware';
import { requiredScopes, claimIncludes } from 'express-oauth2-jwt-bearer';

const CoinsRouter: Router = express.Router();

CoinsRouter.get('/', checkJwt, claimIncludes('permissions', 'read:coins'), CoinsController.index);

export default CoinsRouter;
