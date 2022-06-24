import express, { Router } from 'express';
import PrivateUserRouter from './routes/privateUser.route';
import CoinsRouter from './routes/coins.route';
import AuthRouter from './routes/auth.route';
import AccountsRouter from './routes/accounts.route';
import PrivateAccountsRouter from './routes/privateAccounts.route';
import AlertsRouter from './routes/alerts.route';
import MiscRouter from './routes/misc.route';
import checkJwt from './middlewares/auth0.middleware';

const router: Router = express.Router();

router.use('/auth', AuthRouter);
router.use('/private-user', checkJwt, PrivateUserRouter);
router.use('/coins', CoinsRouter);
router.use('/private-accounts/', checkJwt, PrivateAccountsRouter);
router.use('/accounts/', checkJwt, AccountsRouter);
router.use('/alerts', checkJwt, AlertsRouter);
router.use('/', MiscRouter);

export default router;
