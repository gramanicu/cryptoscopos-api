import { Account, Prisma } from '@prisma/client';
import prisma from '../lib/prismaClient';

/**
 * Get all the stored accounts
 * @param userId (optional) The user for which we should return the account
 * @returns The account (of the user, id userId was specified)
 */
const all_accounts = async (userId?: string): Promise<Account[]> => {
    try {
        if (userId) {
            const accounts = await prisma.account.findMany({
                where: {
                    userId: userId,
                },
            });
            return accounts;
        } else {
            const accounts = await prisma.account.findMany();
            return accounts;
        }
    } catch (err) {
        return [];
    }
};

/**
 * Return an account from the DB
 * @param id The account to retrieve
 * @param incl_trans If it should retrieved all the transactions for the account (default false)
 * @returns The specified account
 */
const show_account = async (id: string, incl_trans = false): Promise<Account | null> => {
    try {
        const account = await prisma.account.findFirst({
            where: {
                id: id,
            },
            include: {
                transactions: incl_trans,
            },
        });

        return account;
    } catch (err) {
        return null;
    }
};

const create_account = async (data: Prisma.AccountCreateInput): Promise<Account | null> => {
    try {
        const account = await prisma.account.create({
            data: data,
        });

        return account;
    } catch (err) {
        return null;
    }
};

const AccountService = {
    all_accounts,
    show_account,
    create_account,
};

export default AccountService;
