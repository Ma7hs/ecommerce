import { Module } from "@nestjs/common";
import {CacheModule} from "@nestjs/cache-manager"
import * as redisStore from "cache-manager-redis-store";
import type { RedisClientOptions } from "redis";

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: process.env.REDIS_STORE,
      url: "redis://localhost:6379",
    }),
  ],
})
export class RedisModule {}