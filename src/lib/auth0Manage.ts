import axios, { AxiosResponse } from 'axios';
import config from '../config/main';
import { redis } from './redisClient';

const tokenKey = 'manageToken';

const updateManageToken = async () => {
    let res: AxiosResponse;
    try {
        res = await axios.request({
            method: 'POST',
            url: '/oauth/token',
            baseURL: `https://${config.auth0.api.domain}`,
            headers: { 'content-type': 'application/json' },
            data: {
                grant_type: 'client_credentials',
                client_id: config.auth0.m2m.clientId,
                client_secret: config.auth0.m2m.secret,
                audience: config.auth0.m2m.audience,
            },
        });

        redis.set(tokenKey, res.data.access_token, 'PX', res.data.expires_in * 0.95);
    } catch (err) {
        console.error(err);
    }
};

const getUserInfo = async (auth0_id: string): Promise<string> => {
    let manageToken = '';
    if (await redis.exists(tokenKey)) {
        manageToken = String(await redis.get(tokenKey));
    } else {
        await updateManageToken();
        manageToken = String(await redis.get(tokenKey));
    }

    let res: AxiosResponse;
    try {
        res = await axios.request({
            method: 'GET',
            url: `/api/v2/users/${auth0_id}`,
            baseURL: `https://${config.auth0.api.domain}`,
            headers: {
                authorization: `Bearer ${manageToken}`,
            },
        });

        return JSON.stringify(res.data);
    } catch (err) {
        console.error(err);
    }

    return '';
};

const makeUserDefault = async (auth0_id: string) => {
    let manageToken = '';
    if (await redis.exists(tokenKey)) {
        manageToken = String(await redis.get(tokenKey));
    } else {
        await updateManageToken();
        manageToken = String(await redis.get(tokenKey));
    }

    let res: AxiosResponse;
    try {
        res = await axios.request({
            method: 'POST',
            url: `/api/v2/users/${auth0_id}/roles`,
            baseURL: `https://${config.auth0.api.domain}`,
            headers: {
                authorization: `Bearer ${manageToken}`,
            },
            data: {
                roles: ['rol_KX84vSCK5n1jO5f6'],
            },
        });

        return JSON.stringify(res.data);
    } catch (err) {
        console.error(err);
    }

    return '';
};

const auth0Manage = {
    getUserInfo,
    updateManageToken,
    makeUserDefault,
};

export default auth0Manage;
