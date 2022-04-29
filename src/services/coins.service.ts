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
 * Compute the percentage change between two numbers
 * @param n1 The number that stayed the same
 * @param n2 The new value of that number
 * @returns The percentage change between n1 and n2
 */
function percentageChange(n1: number, n2: number): number {
    return ((n2 - n1) / n1) * 100;
}

const get_stats = async (gecko_id: string): Promise<CoinStats | null> => {
    const data = await prisma.coinData.findMany({
        where: {
            coin: {
                coingeckoId: gecko_id,
            },
        },
        orderBy: {
            timestamp: 'desc',
        },
    });

    if (data.length > 0) {
        const last_update = DateTime.fromJSDate(data[0].timestamp);

        if (data.length > 1) {
            const processed = data.slice(1).reverse();
            const last_hour_value = processed.find(elem => {
                return (
                    DateTime.fromJSDate(elem.timestamp).diffNow('hours') >= Duration.fromDurationLike({ hours: -2 }) &&
                    DateTime.fromJSDate(elem.timestamp).diffNow('days') < Duration.fromDurationLike({ hours: -1 })
                );
            });
            const last_24hour_value = processed.find(elem => {
                return (
                    DateTime.fromJSDate(elem.timestamp).diffNow('hours') >= Duration.fromDurationLike({ hours: -25 }) &&
                    DateTime.fromJSDate(elem.timestamp).diffNow('days') < Duration.fromDurationLike({ hours: -24 })
                );
            });
            const last_7day_value = processed.find(elem => {
                return (
                    DateTime.fromJSDate(elem.timestamp).diffNow('days') >= Duration.fromDurationLike({ days: -8 }) &&
                    DateTime.fromJSDate(elem.timestamp).diffNow('days') < Duration.fromDurationLike({ days: -7 })
                );
            });
            const last_30day_value = processed.find(elem => {
                return (
                    DateTime.fromJSDate(elem.timestamp).diffNow('days') >= Duration.fromDurationLike({ days: -31 }) &&
                    DateTime.fromJSDate(elem.timestamp).diffNow('days') < Duration.fromDurationLike({ days: -30 })
                );
            });

            return {
                last_update: last_update.toJSDate(),
                last_1h: last_hour_value ? percentageChange(data[0].value, last_hour_value.value) : 'unavailable',
                last_24h: last_24hour_value ? percentageChange(data[0].value, last_24hour_value.value) : 'unavailable',
                last_7day: last_7day_value ? percentageChange(data[0].value, last_7day_value.value) : 'unavailable',
                last_30day: last_30day_value ? percentageChange(data[0].value, last_30day_value.value) : 'unavailable',
                gecko_id,
            };
        }
        return {
            last_update: last_update.toJSDate(),
            last_1h: 'unavailable',
            last_24h: 'unavailable',
            last_7day: 'unavailable',
            last_30day: 'unavailable',
            gecko_id,
        };
    } else {
        return null;
    }
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

/**
 * Statistics about a coin (percentage change of value)
 */
export interface CoinStats {
    gecko_id: string;
    last_update: Date | 'unavailable';
    last_1h: number | 'unavailable';
    last_24h: number | 'unavailable';
    last_7day: number | 'unavailable';
    last_30day: number | 'unavailable';
}

const CoinService = {
    index,
    show,
    store,
    update_data,
    update_info,
    get_data,
    get_stats,
    search,
};

export default CoinService;
