/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Router } from 'express';
import AccountsController from '../controllers/accounts.controller';
import UserInfoMiddleware from '../middlewares/userinfo.middleware';

const AccountsRouter: Router = express.Router();

AccountsRouter.get('/', UserInfoMiddleware, AccountsController.index);
AccountsRouter.post('/create', UserInfoMiddleware, AccountsController.create);
AccountsRouter.get('/:id', UserInfoMiddleware, AccountsController.get);
AccountsRouter.put('/:id', UserInfoMiddleware, AccountsController.update);
AccountsRouter.delete('/:id', UserInfoMiddleware, AccountsController.remove);
AccountsRouter.get('/:id/transactions', UserInfoMiddleware, AccountsController.transactionsIndex);
AccountsRouter.get('/:id/transactions/:transaction_id', UserInfoMiddleware, AccountsController.transactionsGet);
AccountsRouter.post('/:id/transactions/:transaction_id', UserInfoMiddleware, AccountsController.transactionsCreate);
AccountsRouter.delete('/:id/transactions/:transaction_id', UserInfoMiddleware, AccountsController.transactionsRemove);
AccountsRouter.put('/:id/transactions/:transaction_id', UserInfoMiddleware, AccountsController.transactionsUpdate);

// accounts/:id/transaction/:transaction_id

export default AccountsRouter;
