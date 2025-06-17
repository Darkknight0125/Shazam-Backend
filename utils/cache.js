import { getRedisClient } from '../config/redis.js';

export const cache = async (key, ttl, fetchFn) => {
  const client = getRedisClient();
  if (!client) {
    return await fetchFn();
  }
  try {
    const cached = await client.get(key);
    if (cached) return JSON.parse(cached);
    const data = await fetchFn();
    await client.setEx(key, ttl, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Cache error:', error);
    return await fetchFn();
  }
};