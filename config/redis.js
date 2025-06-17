import { createClient } from 'redis';

let redisClient;
let isRedisConnected = false;

export const connectRedis = async () => {
  try {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
      isRedisConnected = false;
    });
    redisClient.on('connect', () => {
      console.log('Redis connected');
      isRedisConnected = true;
    });
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    isRedisConnected = false;
  }
};

export const getRedisClient = () => {
  if (!isRedisConnected) {
    console.warn('Redis is not connected, caching disabled');
    return null;
  }
  return redisClient;
};