import { config } from "./config";
import connectRedis from "connect-redis";
import expressSession from "express-session";
import Redis from "ioredis";

export const createRedisStore = async () => {
  const redis = new Redis({
    host: config.REDISHOST,
    port: config.REDISPORT,
    username: config.REDISUSER,
    password: config.REDISPASSWORD,
    lazyConnect: true,
  });

  const RedisStore = connectRedis(expressSession);

  return {
    store: new RedisStore({ client: redis }),
    client: redis,
  };
};
