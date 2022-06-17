import express, { Router } from 'express';
import MiscController from '../controllers/misc.controller';

const MiscRouter: Router = express.Router();

MiscRouter.get('/site-stats', MiscController.site_stats);

export default MiscRouter;
