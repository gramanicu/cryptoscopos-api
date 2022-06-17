import express, { Router } from 'express';
import AlertController from '../controllers/alerts.controller';
import UserInfoMiddleware from '../middlewares/userinfo.middleware';

const AlertsRouter: Router = express.Router();

AlertsRouter.get('/', UserInfoMiddleware, AlertController.index);
AlertsRouter.post('/create', UserInfoMiddleware, AlertController.create);
AlertsRouter.get('/:id', UserInfoMiddleware, AlertController.get);
AlertsRouter.put('/:id/reset', UserInfoMiddleware, AlertController.reset);
AlertsRouter.delete('/:id', UserInfoMiddleware, AlertController.remove);

export default AlertsRouter;
