import { Coin, CoinData, CoinInformation } from '@prisma/client';
import axios, { AxiosResponse, Method } from 'axios';

const callGecko = async (route: string, method: Method, data?: JSON): Promise<string | null> => {
    let res: AxiosResponse;
    try {
        res = await axios.request({
            method,
            url: route,
            baseURL: 'https://api.coingecko.com/api/v3',
            data,
        });
    } catch (err) {
        return null;
    }

    return JSON.stringify(res.data);
};

/**
 * Search for a specific coin. The results are ordered based on the market cap
 * @param search_term The coin to search for (coingecko_id, symbol, name)
 * @param limit How many results to return
 * @returns The array of coins (if they exist)
 */
const search = async (search_term: string, limit = 5): Promise<Coin[]> => {
    const url = `/search?query=${search_term}`;
    const coins: Coin[] = [];
    const res = await callGecko(url, 'GET');

    if (res) {
        const coinsJSON = JSON.parse(res)['coins'];

        [...coinsJSON].slice(0, limit).forEach(coin => {
            const newCoin: Coin = <Coin>{};
            newCoin.coingeckoId = coin.id;
            newCoin.name = coin.name;
            newCoin.symbol = coin.symbol;
            coins.push(newCoin);
        });
    }

    return coins;
};

/**
 * Get information for a coin (name, symbol, description, image, etc..)
 * @param gecko_id The id of the coin for which to acquire information
 * @returns The information for the coin, split into two objects (Coin and CoinInformation)
 */
const get_info = async (gecko_id: string): Promise<[Coin, CoinInformation]> => {
    const url = `/coins/${gecko_id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`;
    const coin = <Coin>{};
    const coin_info = <CoinInformation>{};
    const res = await callGecko(url, 'GET');

    if (res) {
        const infoJSON = JSON.parse(res);
        coin.coingeckoId = infoJSON.id;
        coin.symbol = infoJSON.symbol;
        coin.name = infoJSON.name;
        coin_info.description = infoJSON.description.en;
        coin_info.homepage = infoJSON.links.homepage[0];
        coin_info.image = infoJSON.image.large;
        coin_info.extra = infoJSON;
    }

    return [coin, coin_info];
};

/**
 * Get data for the specified coins (their values)
 * @param gecko_ids The id's of the coin for which data should be retrieved
 * @returns The coin values at the time the request was made
 */
const get_data = async (gecko_ids: string[]): Promise<{ geckoId: string; value: number }[]> => {
    const url = `/simple/price?ids=${gecko_ids.join(',')}&vs_currencies=usd`;
    const data: { geckoId: string; value: number }[] = [];
    const res = await callGecko(url, 'GET');

    if (res) {
        const dataJSON = JSON.parse(res);
        Object.keys(dataJSON).forEach(key => {
            const newData = <{ geckoId: string; value: number }>{};
            newData.geckoId = key;
            newData.value = dataJSON[key]['usd'];
            data.push(newData);
        });
    }

    return data;
};

const is_online = async (): Promise<boolean> => {
    const url = `/ping`;
    const res = await callGecko(url, 'GET');

    return res ? true : false;
};

/**
 * Get the top cryptocurrencies by market cap (first 250 max)
 * @param limit The number of coins to return (Max 250)
 * @returns An array of coins
 */
const get_top = async (limit = 250): Promise<Coin[]> => {
    const data: Coin[] = [];
    const url = `/coins/markets?vs_currency=usd&category=cryptocurrency&order=market_cap_desc&per_page=250&page=1&sparkline=false`;
    const res = await callGecko(url, 'GET');

    if (res) {
        const dataJSON = JSON.parse(res);
        [...dataJSON].forEach(entry => {
            const coin = <Coin>{};

            coin.coingeckoId = entry.id;
            coin.symbol = entry.symbol;
            coin.name = entry.name;

            data.push(coin);
        });
    }

    return data.slice(0, limit);
};

const GeckoService = {
    is_online,
    search,
    get_info,
    get_data,
    get_top,
};

export default GeckoService;
