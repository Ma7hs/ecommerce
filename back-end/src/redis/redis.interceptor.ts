import { Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import {  RedisService } from 'nestjs-redis'

@Injectable()
export class RedisUpdateInterceptor {
  constructor(
    private readonly cache: Cache,
  ) {}

  intercept(
    next: () => any,
    context: any,
  ) {

    const redisKey = context.request.headers['x-redis-key'];
    if (redisKey) {
      const redisValue = context.body;
      this.cache.set(redisKey, redisValue);
    }

    return next();
  }
}