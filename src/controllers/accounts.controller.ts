/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { Prisma, Account, Coin } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AccountService from '../services/accounts.service';
import UserService from '../services/users.service';
import CoinService from '../services/coins.service';
import TransactionService from '../services/transactions.service';
import { DateTime } from 'luxon';
import prisma from '../lib/prismaClient';

// Get all the accounts associated with the user
const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.show({
            where: { auth0_id: res.locals.auth0_id, OR: { private_id: res.locals.private_id } },
        });

        if (user) {
            const accounts = await AccountService.all_accounts(user.id);
            return res.send(accounts);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Add a new account
const create = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.sendStatus(400);
    if (!req.body.gecko_id || !req.body.name) return res.sendStatus(400);

    try {
        const user = await UserService.show({
            where: { auth0_id: res.locals.auth0_id, OR: { private_id: res.locals.private_id } },
        });
        const coin = await CoinService.show(req.body.gecko_id);

        if (user && coin) {
            const account = await AccountService.create_account({
                name: req.body.name,
                description: req.body.description,
                owner: {
                    connect: {
                        id: user.id,
                    },
                },
                currency: {
                    connect: {
                        id: coin.id,
                    },
                },
            });

            return res.send(account);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Return a specific account of the user
const get = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.id) return res.sendStatus(400);

    try {
        const user = await UserService.show({
            where: { auth0_id: res.locals.auth0_id, OR: { private_id: res.locals.private_id } },
        });

        if (user) {
            const account = await AccountService.show_account({
                where: {
                    owner: {
                        id: user.id,
                    },
                    id: req.params.id,
                },
                // include: {
                //     transactions: incl_trans,
                // },
            });

            if (!account) {
                return res.sendStatus(404);
            }

            return res.send(account);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Remove an account of the user
const remove = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.id) return res.sendStatus(400);

    try {
        const user = await UserService.show({
            where: { auth0_id: res.locals.auth0_id, OR: { private_id: res.locals.private_id } },
        });

        if (user) {
            const account = await AccountService.remove_account({
                where: {
                    id: req.params.id,
                },
            });

            if (!account) {
                return res.sendStatus(404);
            }

            return res.send(account);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Update an account of the user
const update = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params || !req.body) return res.sendStatus(400);
    if (!req.params.id || !req.body.name) return res.sendStatus(400);

    try {
        const user = await UserService.show({
            where: { auth0_id: res.locals.auth0_id, OR: { private_id: res.locals.private_id } },
        });

        let account: Account | null;
        if (user) {
            if (req.body.description) {
                account = await AccountService.update_account(req.params.id, req.body.name, req.body.description);
            } else {
                account = await AccountService.update_account(req.params.id, req.body.name);
            }

            if (!account) {
                return res.sendStatus(404);
            }

            return res.send(account);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Get all the transactions associated with an account
const transactionsIndex = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.id) return res.sendStatus(400);

    try {
        const transactions = await TransactionService.all_transactions(req.params.id);
        return res.send(transactions);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Get a specific transaction of an account
const transactionsGet = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.id || !req.params.transaction_id) return res.sendStatus(400);

    try {
        const transaction = await TransactionService.show_transaction({
            where: {
                id: req.params.transaction_id,
                accountId: req.params.id,
            },
        });

        if (!transaction) {
            return res.sendStatus(404);
        }

        return res.send(transaction);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Remove a transaction from an account
const transactionsRemove = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.id || !req.params.transaction_id) return res.sendStatus(400);

    try {
        const transaction = await TransactionService.remove_transaction({
            where: {
                id: req.params.transaction_id,
            },
        });

        if (!transaction) {
            return res.sendStatus(404);
        }

        return res.send(transaction);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Add a new transaction to the account
const transactionsCreate = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || !req.params) return res.sendStatus(400);
    if (!req.params.id || !req.body.comment || !req.body.amount) return res.sendStatus(400);

    let timestamp = req.body.timestamp;
    let value = req.body.timestamp;
    const amount = req.body.amount as number;

    if (!req.body.timestamp) {
        timestamp = DateTime.now().toISO();
    }

    try {
        const user = await UserService.show({
            where: { auth0_id: res.locals.auth0_id, OR: { private_id: res.locals.private_id } },
        });

        if (!user) {
            return res.sendStatus(404);
        }

        const account = await AccountService.show_account({
            where: {
                userId: user.id,
                id: req.params.id,
            },
        });

        if (account) {
            if (!req.body.value) {
                const coin = await prisma.coin.findFirst({
                    where: {
                        id: account.coinId,
                    },
                });

                const data = await prisma.coinData.findFirst({
                    where: {
                        coinId: coin?.id,
                        timestamp: {
                            gt: DateTime.fromISO(timestamp).plus({ hours: 1 }).toISO(),
                            lt: DateTime.fromISO(timestamp).minus({ hours: 1 }).toISO(),
                        },
                    },
                    orderBy: {
                        timestamp: 'desc',
                    },
                });

                if (data) {
                    value = (data?.value as number) * amount;
                } else {
                    const data1 = await prisma.coinData.findFirst({
                        where: {
                            coinId: coin?.id,
                        },
                        orderBy: {
                            timestamp: 'desc',
                        },
                    });
                    value = (data1?.value as number) * amount;
                }
            }

            const transaction = await TransactionService.create_transaction({
                timestamp: timestamp,
                comment: req.body.comment,
                value: value,
                amount: req.body.amount,
                account: {
                    connect: {
                        id: account.id,
                    },
                },
            });

            if (!transaction) {
                return res.sendStatus(400);
            }

            return res.send(transaction);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Update a existing transaction
const transactionsUpdate = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params || !req.body) return res.sendStatus(400);
    if (!req.params.id || !req.params.transaction_id || !req.body.comment) return res.sendStatus(400);

    try {
        const user = await UserService.show({
            where: { auth0_id: res.locals.auth0_id, OR: { private_id: res.locals.private_id } },
        });

        if (!user) {
            return res.sendStatus(404);
        }

        const account = await AccountService.show_account({
            where: {
                userId: user.id,
                id: req.params.id,
            },
        });

        const value = parseFloat(req.body.value);
        const amount = parseFloat(req.body.amount);
        const comment = req.body.comment;
        const timestamp = req.body.timestamp;

        if (account) {
            const transaction = await TransactionService.update_transaction(
                {
                    id: req.params.transaction_id,
                },
                {
                    value,
                    amount,
                    comment,
                    timestamp,
                }
            );

            console.log(transaction);
            if (!transaction) {
                return res.sendStatus(404);
            }

            return res.send(transaction);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

const AccountsController = {
    index,
    get,
    remove,
    update,
    create,
    transactionsIndex,
    transactionsGet,
    transactionsCreate,
    transactionsRemove,
    transactionsUpdate,
};

export default AccountsController;
