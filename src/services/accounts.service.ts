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
                include: {
                    currency: {
                        select: {
                            name: true,
                            coingeckoId: true,
                            symbol: true,
                        },
                    },
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
 * @param searchFor What to search for
 * @returns The account (if found)
 */
const show_account = async (searchFor: Prisma.AccountFindFirstArgs): Promise<Account | null> => {
    try {
        const account = await prisma.account.findFirst(searchFor);
        return account;
    } catch (err) {
        return null;
    }
};

/**
 * Create a new account
 * @param data The account data
 * @returns The created account, if the operation succeeded
 */
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

/**
 * Delete an account
 * @param searchFor What account to delete
 * @returns The deleted account
 */
const remove_account = async (searchFor: Prisma.AccountDeleteArgs): Promise<Account | null> => {
    try {
        const account = await prisma.account.delete(searchFor);
        return account;
    } catch (err) {
        return null;
    }
};

/**
 * Update information about an account. Connections (owner and currency) cannot be changed
 * @param account_id The account to update
 * @param name The new name of the account
 * @param description The new description of the account (OPTIONAL)
 * @returns The modified account
 */
const update_account = async (account_id: string, name: string, description?: string): Promise<Account | null> => {
    try {
        const account = await prisma.account.update({
            where: {
                id: account_id,
            },
            data: {
                name,
                description,
            },
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
    remove_account,
    update_account,
};

export default AccountService;
