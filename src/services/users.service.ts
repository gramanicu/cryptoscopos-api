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
 *
 * @param id
 * @returns
 */
const show = async (id: string): Promise<User | null> => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: id,
            },
        });

        return user;
    } catch (err) {
        return null;
    }
};

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
