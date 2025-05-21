import { config } from "../config/env";
import redis from 'redis'


let redisClient: ReturnType<typeof redis.createClient>;

const getRedisClient = () => {
  if (!redisClient) {
    redisClient = redis.createClient({
      url: config.redis.URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            return new Error('Retry attempts exhausted');
          }
          // Reconnect after
          return Math.min(retries * 100, 3000);
        }
      }
    }
    );

    redisClient.on('connect', () => {
      if (config.env != 'test') {
        console.log('Connected to redis server');
      }
    });

    redisClient.on('error', (error) => {
      console.error(`Redis server error: ${error}`);
    });

    redisClient.connect().catch((err) => {
      console.error('Error connecting to Redis:', err);
    });
  }

  return redisClient;
};

export default { getRedisClient }
