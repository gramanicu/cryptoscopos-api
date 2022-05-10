/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Router } from 'express';
import CoinsController from '../controllers/coins.controller';
import checkJwt from '../middlewares/auth0.middleware';

const CoinsRouter: Router = express.Router();

CoinsRouter.get('/', CoinsController.index);
CoinsRouter.get('/search/:search_term', CoinsController.internal_search);
CoinsRouter.get('/full-search/:search_term', checkJwt, CoinsController.full_search);
CoinsRouter.get('/getbyid/:id', CoinsController.getById);
CoinsRouter.get('/:gecko_id', CoinsController.get);
CoinsRouter.get('/:gecko_id/data', CoinsController.get_data);
CoinsRouter.get('/:gecko_id/stats', CoinsController.get_stats);
CoinsRouter.post('/:gecko_id', checkJwt, CoinsController.create);

export default CoinsRouter;
