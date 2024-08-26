import Redis from 'ioredis';

let url = process.env.REDIS_URL;

if (process.env.REDIS_PROCESSOR_URL) {
  url = process.env.REDIS_PROCESSOR_URL;
}

if (!url) throw new Error('REDIS_URL or REDIS_PROCESSOR_URL is not set');

export const sharedProcessorRedisConn = new Redis(url, {
  maxRetriesPerRequest: null,
});
