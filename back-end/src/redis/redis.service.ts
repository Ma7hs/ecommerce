import { Injectable } from '@nestjs/common';
import { caching, Cache } from 'cache-manager';
import * as redisStore from 'cache-manager-redis-store';


@Injectable()
export class RedisService {
  private readonly cache: Cache;

  async get(key: string): Promise<any> {
    return this.cache.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    await this.cache.set(key, value);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }
}
