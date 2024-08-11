import redisConnection from '../libs/redis';

class Cache<T> {
  public key: string;
  public cached: T | null;

  constructor(key: string) {
    this.key = key;
    this.cached = null;
  }

  async set(value: T, ttlInSecond?: number) {
    const self = this;
    await redisConnection.set(
      self.key,
      typeof value === 'string' ? value : JSON.stringify(value),
    );
    if (ttlInSecond) return await redisConnection.expire(self.key, ttlInSecond);

    return;
  }

  async get() {
    const self = this;
    const data = await redisConnection.get(self.key);
    if (data) {
      self.cached = JSON.parse(data) as T;
    }
    return self.cached;
  }
}

export default Cache;
