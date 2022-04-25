import express, { Router } from 'express';
import _Router from './routes/_.route';
import CoinsRouter from './routes/coins.route';
import AuthRouter from './routes/auth.route';

const router: Router = express.Router();

router.use('/auth', AuthRouter);
router.use('/_', _Router);
router.use('/coins', CoinsRouter);

export default router;
