/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import CoinService from '../services/coins.service';
import UserService from '../services/users.service';
import GeckoService from '../../dist/src/services/gecko.service';
import { DateTime } from 'luxon';

// Get all the coins stored in the db
const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const r = await CoinService.index();
        return res.send(r);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        return res.sendStatus(500);
    }
};

interface SearchResult {
    name: string;
    gecko_id: string;
    symbol: string;
    is_internal: boolean;
}

// Search for a coin in the internal db. Returns name, gecko_id, symbol
const internal_search = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.search_term) return res.sendStatus(400);

    try {
        const coins = await CoinService.search(req.params.search_term);

        if (coins.length > 0) {
            const data = coins.map((elem): SearchResult => {
                return {
                    name: elem.name,
                    gecko_id: elem.coingeckoId,
                    symbol: elem.symbol,
                    is_internal: true,
                };
            });

            return res.send(data);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Search for a coin in the internal db and on the coingecko api. Returns name, gecko_id, symbol, is_internal
const full_search = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.search_term) return res.sendStatus(400);

    try {
        const user = await UserService.show({ where: { auth0_id: res.locals.auth0_id } });

        if (!user) {
            return res.sendStatus(404);
        }

        const coins = await CoinService.search(req.params.search_term);
        let data: SearchResult[] = [];

        if (coins.length > 0) {
            data = coins.map((elem): SearchResult => {
                return {
                    name: elem.name,
                    gecko_id: elem.coingeckoId,
                    symbol: elem.symbol,
                    is_internal: true,
                };
            });
        }

        if (coins.length < 10) {
            const ext_data = await GeckoService.search(req.params.search_term, 10 - coins.length);

            if (ext_data.length > 0) {
                data.push(
                    ...ext_data
                        .filter(elem => {
                            return data.filter(el => el.gecko_id === elem.coingeckoId).length == 0;
                        })
                        .map((elem): SearchResult => {
                            return {
                                name: elem.name,
                                gecko_id: elem.coingeckoId,
                                symbol: elem.symbol,
                                is_internal: false,
                            };
                        })
                );
            }
        }

        if (data.length > 0) {
            return res.send(data);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Get a coin from the db using the gecko_id
const get = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.gecko_id) return res.sendStatus(400);

    try {
        const coin = await CoinService.show(req.params.gecko_id);

        if (coin) {
            return res.send(coin);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Get the stats for a coin from the db using the gecko_id
const get_stats = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.gecko_id) return res.sendStatus(400);

    try {
        const coin_stats = await CoinService.get_stats(req.params.gecko_id);

        if (coin_stats) {
            return res.send(coin_stats);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Get the data for a coin, using the gecko_id
const get_data = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.gecko_id) return res.sendStatus(400);

    try {
        const start_date: DateTime | undefined = req.body.start_date
            ? DateTime.fromISO(req.body.start_date)
            : undefined;
        const end_date: DateTime | undefined = req.body.end_date ? DateTime.fromISO(req.body.end_date) : undefined;

        const coin = await CoinService.get_data(req.params.gecko_id, start_date, end_date);

        if (coin) {
            return res.send(coin);
        }

        return res.sendStatus(404);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

// Add a new coin in the db. The data will be taken from the GK API, only the gecko_id must be specified
const create = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params) return res.sendStatus(400);
    if (!req.params.gecko_id) return res.sendStatus(400);

    try {
        const coin = await CoinService.store(req.params.gecko_id);

        if (coin) {
            return res.send(coin);
        }

        return res.sendStatus(400);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) return res.sendStatus(400);
        if (axios.isAxiosError(e)) return res.sendStatus(404);
        return res.sendStatus(500);
    }
};

const CoinsController = {
    index,
    create,
    get,
    internal_search,
    full_search,
    get_data,
    get_stats,
};

export default CoinsController;
