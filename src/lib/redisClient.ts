import Redis from 'ioredis';
import config from '../config/main';

export const redis = new Redis(String(config.redis_url));
