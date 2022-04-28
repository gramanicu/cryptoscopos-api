import { Coin, CoinData, Prisma, CoinInformation } from '@prisma/client';
import { DateTime, Duration } from 'luxon';
import GeckoService from './gecko.service';
import prisma from '../lib/prismaClient';
import config from '../config/main';

/**
 * Get all the coins stored by the application
 * @returns All the coins in the DB
 */
const index = async (): Promise<Coin[]> => {
    try {
        const coins = await prisma.coin.findMany();
        return coins;
    } catch (err) {
        return [];
    }
};

/**
 * Get a coin stored by the application.
 * @param gecko_id The id of the coin to get
 * @returns A coin, if it exists inside the DB
 */
const show = async (gecko_id: string): Promise<Coin | null> => {
    try {
        const coin = await prisma.coin.findFirst({
            where: {
                coingeckoId: {
                    equals: gecko_id,
                },
            },
        });

        return coin;
    } catch (err) {
        return null;
    }
};

/**
 * Store a new coin inside the application's DB. The coin information will be retrieved from the GeckoService.
 * @param gecko_id The id of the coin to add to the application
 * @returns The new coin, if it was successfully stored.
 */
const store = async (gecko_id: string): Promise<Coin | null> => {
    let newCoin: Coin;
    let newCoinInfo: CoinInformation;

    try {
        [newCoin, newCoinInfo] = await GeckoService.get_info(gecko_id);
    } catch (e) {
        return null;
    }

    // This is a transaction that creates both the coin and the associated coin information
    const coin = await prisma.coin.create({
        data: {
            coingeckoId: newCoin.coingeckoId,
            name: newCoin.name,
            symbol: newCoin.symbol,
            information: {
                create: {
                    description: newCoinInfo.description,
                    homepage: newCoinInfo.homepage,
                    image: newCoinInfo.image,
                    // TODO - check if this workaround is still needed
                    extra: newCoinInfo.extra as Prisma.JsonObject,
                },
            },
        },
        include: {
            information: true,
        },
    });

    return coin;
};

/**
 * Get the data associated to a coin (it's value over time)
 * @param gecko_id The id of the coin that data should be retrieved for
 * @param start_date The "earliest" record we want to retrieve (first record if not specified)
 * @param end_date The "latest" record we want to retrieve ("now" if not specified)
 * @returns An array of CoinData entries
 */
const get_data = async (gecko_id: string, start_date?: DateTime, end_date?: DateTime): Promise<CoinData[]> => {
    if (!start_date) {
        start_date = DateTime.fromMillis(0);
    }

    if (!end_date) {
        end_date = DateTime.now();
    }

    const data = await prisma.coinData.findMany({
        where: {
            coin: {
                coingeckoId: gecko_id,
            },
            timestamp: {
                gte: start_date.toISO(),
                lte: end_date.toISO(),
            },
        },
        orderBy: {
            timestamp: 'desc',
        },
    });

    return data;
};

/**
 * Check if the coin data is still valid (if the update_interval has passed, the data is no longer valid)
 * @param currTime The current time (it is passed, as there can be multiple comparisons made during the same operation, and all should have the same result)
 * @returns If the data is still valid.
 */
const is_data_valid = async (currTime: DateTime): Promise<boolean> => {
    const data = await prisma.coinData.findFirst({
        orderBy: {
            timestamp: 'desc',
        },
    });
    const interval = Duration.fromMillis(config.coindata_update_interval.toMillis() * 0.95);

    if (data) {
        const toCompare = DateTime.fromJSDate(data.timestamp);

        if (currTime.diff(toCompare) < interval) {
            return true;
        }
    }

    return false;
};

/**
 * Update data for each registered coin, if the data is no longer valid (timeout passed)
 * @param force If the update should be forced
 */
const update_data = async (force = false) => {
    const time = DateTime.now();

    // There shouldn't be any updates until the data is invalidated
    if (!force && (await is_data_valid(time))) {
        throw new Error('The data is still valid. If you want to update the CoinData, you need to force the service');
    }

    const coins = await index();
    const coinGeckoIds = coins.map(coin => coin.coingeckoId);
    const data = await GeckoService.get_data(coinGeckoIds);

    for (const entry of data) {
        await prisma.coin.update({
            where: {
                coingeckoId: entry.geckoId,
            },
            data: {
                // The data field inside the coin table
                data: {
                    create: {
                        value: entry.value,
                        timestamp: time.toISO(),
                    },
                },
            },
        });
    }
};

/**
 * Updates all the Coin and CoinInformation tables.
 * ATTENTION - in the case the coingecko_id is changed by CoinGecko, this function may fail (as well as the whole application)
 */
const update_info = async () => {
    const coins = await index();

    for (const coin of coins) {
        const [base, info] = await GeckoService.get_info(coin.coingeckoId);

        // This is a transaction that creates both the coin and the associated coin information
        await prisma.coin.update({
            where: {
                id: coin.id,
            },
            data: {
                coingeckoId: base.coingeckoId,
                name: base.name,
                symbol: base.symbol,
                information: {
                    upsert: {
                        create: {
                            description: info.description,
                            homepage: info.homepage,
                            image: info.image,
                            // TODO - check if this workaround is still needed
                            extra: info.extra as Prisma.JsonObject,
                        },
                        update: {
                            description: info.description,
                            homepage: info.homepage,
                            image: info.image,
                            // TODO - check if this workaround is still needed
                            extra: info.extra as Prisma.JsonObject,
                        },
                    },
                },
            },
            include: {
                information: true,
            },
        });
    }
};

/**
 * Search for coins in the db. Matches the coingecko_id first, then name, then symbol.
 * @param search_term The term to search form
 * @returns The top 10 search results
 */
const search = async (search_term: string): Promise<Coin[]> => {
    try {
        const coins = await prisma.coin.findMany({
            where: {
                OR: [
                    {
                        coingeckoId: search_term,
                    },

                    {
                        name: search_term,
                    },
                    {
                        symbol: search_term,
                    },
                ],
            },
        });

        return coins.slice(0, 10);
    } catch (err) {
        return [];
    }
};

const CoinService = {
    index,
    show,
    store,
    update_data,
    update_info,
    get_data,
    search,
};

export default CoinService;
