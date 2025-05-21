import redisConn from "../connection/redisConn";

const redisClient = redisConn.getRedisClient()


class RedisRepository {
  async addKey(key: string, value: string) {
    return await redisClient.set(key, value);
  }
  async addKeyAndTTL(key: string, value: string, ttl: number) {
    return await redisClient.set(key, value, { EX: ttl });
  }

  async getVal(key: string) {
    return await redisClient.get(key);
  }

  async delKey(key: string) {
    return await redisClient.del(key);
  }

  async expireKey(key: string, seconds: number) {
    return await redisClient.expire(key, seconds);
  }

  async addToSet(key: string, members: string | string[]) {
    return await redisClient.sAdd(key, members);
  }
  async removeFromSet(key: string, members: string | string[]) {
    return await redisClient.sRem(key, members);
  }

  async getSetMembers(key: string) {
    return await redisClient.sMembers(key);
  }

  async setHashField(key: string, field: string, value: string) {
    return await redisClient.hSet(key, field, value);
  }

  async getHashField(key: string, field: string) {
    return await redisClient.hGet(key, field);
  }

  async getHashValues(key: string) {
    return await redisClient.hVals(key);
  }

  async delHashField(key: string, field: string) {
    return await redisClient.hDel(key, field);
  }

  async getAllHashFields(key: string) {
    return await redisClient.hGetAll(key);
  }

  async leftPushToList(key: string, values: string) {
    return await redisClient.lPush(key, values);
  }

  async rightPushToList(key: string, values: string) {
    return await redisClient.rPush(key, values);
  }

  async leftPopFromList(key: string) {
    return await redisClient.lPop(key);
  }

  async rightPopFromList(key: string) {
    return await redisClient.rPop(key);
  }

  async getListRange(key: string, start: number, stop: number) {
    return await redisClient.lRange(key, start, stop);
  }

  async getListLength(key: string) {
    return await redisClient.lLen(key);
  }

  async removeFromList(key: string, count: number, value: string) {
    return await redisClient.lRem(key, count, value);
  }

  async trimList(key: string, start: number, stop: number) {
    return await redisClient.lTrim(key, start, stop);
  }
}

export default RedisRepository;
