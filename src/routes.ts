import express, { Router } from 'express';
import PrivateUserRouter from './routes/privateUser.route';
import CoinsRouter from './routes/coins.route';
import AuthRouter from './routes/auth.route';
import AccountsRouter from './routes/accounts.route';
import PrivateAccountsRouter from './routes/privateAccounts.route';
import AlertsRouter from './routes/alerts.route';
import MiscRouter from './routes/misc.route';

const router: Router = express.Router();

router.use('/auth', AuthRouter);
router.use('/private-user', PrivateUserRouter);
router.use('/coins', CoinsRouter);
router.use('/private-accounts/', PrivateAccountsRouter);
router.use('/accounts/', AccountsRouter);
router.use('/alerts', AlertsRouter);
router.use('/', MiscRouter);

export default router;
