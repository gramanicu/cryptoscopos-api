import { Transaction, Prisma } from '@prisma/client';
import prisma from '../lib/prismaClient';

/**
 * Get all the stored transactions
 * @param accountId (optional) The account for which we should return the transaction
 * @returns The transaction)
 */
const all_transactions = async (accountId?: string): Promise<Transaction[]> => {
    try {
        if (accountId) {
            const transactions = await prisma.transaction.findMany({
                where: {
                    accountId,
                },
            });
            return transactions;
        } else {
            const transactions = await prisma.transaction.findMany();
            return transactions;
        }
    } catch (err) {
        return [];
    }
};

/**
 * Return an transaction from the DB
 * @param searchFor What to search for
 * @returns The transaction (if found)
 */
const show_transaction = async (searchFor: Prisma.TransactionFindFirstArgs): Promise<Transaction | null> => {
    try {
        const transaction = await prisma.transaction.findFirst(searchFor);
        return transaction;
    } catch (err) {
        return null;
    }
};

/**
 * Create a new transaction
 * @param data The transaction data
 * @returns The created transaction, if the operation succeeded
 */
const create_transaction = async (data: Prisma.TransactionCreateInput): Promise<Transaction | null> => {
    try {
        const transaction = await prisma.transaction.create({
            data: data,
        });

        return transaction;
    } catch (err) {
        return null;
    }
};

/**
 * Delete an transaction
 * @param searchFor What transaction to delete
 * @returns The deleted transaction
 */
const remove_transaction = async (searchFor: Prisma.TransactionDeleteArgs): Promise<Transaction | null> => {
    try {
        const transaction = await prisma.transaction.delete(searchFor);
        return transaction;
    } catch (err) {
        return null;
    }
};

/**
 * Update a transaction
 * @param where What transaction to search for
 * @param data What data to update
 * @returns The updated transaction
 */
const update_transaction = async (
    where: Prisma.TransactionWhereUniqueInput,
    data: Prisma.TransactionUpdateWithoutAccountInput
): Promise<Transaction | null> => {
    try {
        const transaction = await prisma.transaction.update({ where, data });
        return transaction;
    } catch (err) {
        return null;
    }
};

const TransactionService = {
    all_transactions,
    show_transaction,
    create_transaction,
    remove_transaction,
    update_transaction,
};

export default TransactionService;
