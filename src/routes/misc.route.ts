import express, { Router } from 'express';
import MiscController from '../controllers/misc.controller';
import UserInfoMiddleware from '../middlewares/userinfo.middleware';

const MiscRouter: Router = express.Router();

MiscRouter.get('/site-stats', MiscController.site_stats);
MiscRouter.get('/user-stats', UserInfoMiddleware, MiscController.user_stats);

export default MiscRouter;
