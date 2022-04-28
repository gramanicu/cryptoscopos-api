import { User, Prisma } from '@prisma/client';
import prisma from '../lib/prismaClient';

/**
 * Get all the stored users
 * @returns All the users stored in the DB
 */
const index = async (): Promise<User[]> => {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (err) {
        return [];
    }
};

/**
 * Search for the user that matches the condition
 * @param searchFor What parameters to search for
 * @returns The user, if any was found
 */
const show = async (searchFor: Prisma.UserFindFirstArgs): Promise<User | null> => {
    try {
        const user = await prisma.user.findFirst(searchFor);

        return user;
    } catch (err) {
        return null;
    }
};

/**
 * Add a new user to the db
 * @param data The data associated with the user
 * @returns The new user, if the operation succeeded
 */
const store = async (data: Prisma.UserCreateInput): Promise<User | null> => {
    try {
        const user = await prisma.user.create({
            data: data,
        });

        return user;
    } catch (err) {
        return null;
    }
};

const UserService = {
    index,
    show,
    store,
};

export default UserService;
