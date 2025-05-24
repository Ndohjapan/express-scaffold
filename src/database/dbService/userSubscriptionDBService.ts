import { UserSubscriptionRepository } from '../dbRepo/userSubscriptionRepository';
import RedisRepository from '../redisRepo';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { UserSubscription } from '../models/UserSubscription';
import { BadRequestException } from '../../errors/exceptions/badRequest';

export class UserSubscriptionDBService {
  private db_repository: UserSubscriptionRepository;
  private redis_repository: RedisRepository;
  private service: string;

  constructor() {
    this.db_repository = new UserSubscriptionRepository();
    this.redis_repository = new RedisRepository();
    this.service = 'user-subscriptions';
  }

  async create(data: Partial<UserSubscription>) {
    try {
      const userSubscription = await this.db_repository.create(data);
      await this.redis_repository.delKey(this.service);
      return userSubscription;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findOneByFilter(filter: FilterQuery<UserSubscription>) {
    try {
      const hash_key = `one-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const userSubscription = await this.db_repository.findOneByFilter(filter);

      if (userSubscription) {
        await this.redis_repository.setHashField(
          this.service,
          hash_key,
          JSON.stringify(userSubscription)
        );
      }

      return userSubscription;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findManyByFilter(filter: FilterQuery<UserSubscription>, options = {}) {
    try {
      const hash_key = `many-${JSON.stringify(filter)}-${JSON.stringify(options)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const userSubscriptions = await this.db_repository.findManyByFilter(filter, options);

      await this.redis_repository.setHashField(
        this.service,
        hash_key,
        JSON.stringify(userSubscriptions)
      );

      return userSubscriptions;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<UserSubscription>,
    updateData: UpdateQuery<UserSubscription> = {},
    incrementData: UpdateQuery<UserSubscription> = {},
    appendData: UpdateQuery<UserSubscription> = {}
  ) {
    try {
      const userSubscription = await this.db_repository.updateOneByFilter(
        filter,
        updateData,
        incrementData,
        appendData
      );

      if (userSubscription) {
        await this.redis_repository.delKey(this.service);
      }

      return userSubscription;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async countDocuments(filter: FilterQuery<UserSubscription>) {
    try {
      const hash_key = `count-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const count = await this.db_repository.countDocuments(filter);

      await this.redis_repository.setHashField(
        this.service,
        hash_key,
        JSON.stringify(count)
      );

      return count;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async aggregate(pipeline: any[]) {
    try {
      const hash_key = `aggregate-${JSON.stringify(pipeline)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const result = await this.db_repository.aggregate(pipeline);

      await this.redis_repository.setHashField(
        this.service,
        hash_key,
        JSON.stringify(result)
      );

      return result;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }
}
