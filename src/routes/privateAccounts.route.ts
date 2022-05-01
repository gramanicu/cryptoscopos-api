/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Router } from 'express';
import AccountsController from '../controllers/accounts.controller';
import PrivateUserMiddleware from '../middlewares/privateuser.middleware';

const PrivateAccountsRouter: Router = express.Router();

// Routes used for private users
PrivateAccountsRouter.get('/', PrivateUserMiddleware, AccountsController.index);
PrivateAccountsRouter.post('/create', PrivateUserMiddleware, AccountsController.create);
PrivateAccountsRouter.get('/:id', PrivateUserMiddleware, AccountsController.get);
PrivateAccountsRouter.put('/:id', PrivateUserMiddleware, AccountsController.update);
PrivateAccountsRouter.delete('/:id', PrivateUserMiddleware, AccountsController.remove);
PrivateAccountsRouter.get('/:id/transactions', PrivateUserMiddleware, AccountsController.transactionsIndex);
PrivateAccountsRouter.get(
    '/:id/transactions/:transaction_id',
    PrivateUserMiddleware,
    AccountsController.transactionsGet
);
PrivateAccountsRouter.post(
    '/:id/transactions/:transaction_id',
    PrivateUserMiddleware,
    AccountsController.transactionsCreate
);
PrivateAccountsRouter.delete(
    '/:id/transactions/:transaction_id',
    PrivateUserMiddleware,
    AccountsController.transactionsRemove
);
PrivateAccountsRouter.put(
    '/:id/transactions/:transaction_id',
    PrivateUserMiddleware,
    AccountsController.transactionsUpdate
);

export default PrivateAccountsRouter;
