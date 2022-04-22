import express, { Router } from 'express';
import _Router from './routes/_.route';
import CoinsRouter from './routes/coins.route';

const router: Router = express.Router();

router.use('/_', _Router);
router.use('/coins', CoinsRouter);

export default router;
