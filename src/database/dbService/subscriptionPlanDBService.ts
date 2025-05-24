import { SubscriptionPlanRepository } from '../dbRepo/subscriptionPlanRepository';
import RedisRepository from '../redisRepo';
import { BadRequestException } from '../../errors/exceptions/badRequest';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { SubscriptionPlan } from '../models/SubscriptionPlan';

export class SubscriptionPlanDBService {
  private db_repository: SubscriptionPlanRepository;
  private redis_repository: RedisRepository;
  private service: string;

  constructor() {
    this.db_repository = new SubscriptionPlanRepository();
    this.redis_repository = new RedisRepository();
    this.service = 'subscription_plans';
  }

  async create(data: Partial<SubscriptionPlan>) {
    try {
      const plan = await this.db_repository.create(data);
      await this.redis_repository.delKey(this.service);
      return plan;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findOneByFilter(filter: FilterQuery<SubscriptionPlan>) {
    try {
      const hash_key = `one-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const plan = await this.db_repository.findOneByFilter(filter);

      if (plan) {
        await this.redis_repository.setHashField(
          this.service,
          hash_key,
          JSON.stringify(plan)
        );
      }

      return plan;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findManyByFilter(filter: FilterQuery<SubscriptionPlan>) {
    try {
      const hash_key = `many-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const plans = await this.db_repository.findManyByFilter(filter);

      await this.redis_repository.setHashField(
        this.service,
        hash_key,
        JSON.stringify(plans)
      );

      return plans;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<SubscriptionPlan>,
    updateData: UpdateQuery<SubscriptionPlan> = {},
    incrementData: UpdateQuery<SubscriptionPlan> = {},
    appendData: UpdateQuery<SubscriptionPlan> = {}
  ) {
    try {
      const plan = await this.db_repository.updateOneByFilter(
        filter,
        updateData,
        incrementData,
        appendData
      );

      await this.redis_repository.delKey(this.service);
      return plan;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async updateManyByFilter(
    filter: FilterQuery<SubscriptionPlan>,
    updateData: UpdateQuery<SubscriptionPlan> = {},
    incrementData: UpdateQuery<SubscriptionPlan> = {},
    appendData: UpdateQuery<SubscriptionPlan> = {}
  ) {
    try {
      const result = await this.db_repository.updateManyByFilter(
        filter,
        updateData,
        incrementData,
        appendData
      );

      await this.redis_repository.delKey(this.service);
      return result;
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

  async countDocuments(filter: FilterQuery<SubscriptionPlan>) {
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
}
