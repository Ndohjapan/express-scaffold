import { VoucherSubscriptionRepository } from '../dbRepo/voucherSubscriptionRepository';
import RedisRepository from '../redisRepo';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { VoucherSubscription } from '../models/VoucherSubscription';
import { BadRequestException } from '../../errors/exceptions/badRequest';

export class VoucherSubscriptionDBService {
  private db_repository: VoucherSubscriptionRepository;
  private redis_repository: RedisRepository;
  private service: string;

  constructor() {
    this.db_repository = new VoucherSubscriptionRepository();
    this.redis_repository = new RedisRepository();
    this.service = 'voucher-subscriptions';
  }

  async create(data: Partial<VoucherSubscription>) {
    try {
      const voucherSubscription = await this.db_repository.create(data);
      await this.redis_repository.delKey(this.service);
      return voucherSubscription;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findOneByFilter(filter: FilterQuery<VoucherSubscription>) {
    try {
      const hash_key = `one-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const voucherSubscription = await this.db_repository.findOneByFilter(filter);

      if (voucherSubscription) {
        await this.redis_repository.setHashField(
          this.service,
          hash_key,
          JSON.stringify(voucherSubscription)
        );
      }

      return voucherSubscription;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findManyByFilter(filter: FilterQuery<VoucherSubscription>, options = {}) {
    try {
      const hash_key = `many-${JSON.stringify(filter)}-${JSON.stringify(options)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const voucherSubscriptions = await this.db_repository.findManyByFilter(filter, options);

      await this.redis_repository.setHashField(
        this.service,
        hash_key,
        JSON.stringify(voucherSubscriptions)
      );

      return voucherSubscriptions;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<VoucherSubscription>,
    updateData: UpdateQuery<VoucherSubscription> = {},
    incrementData: UpdateQuery<VoucherSubscription> = {},
    appendData: UpdateQuery<VoucherSubscription> = {}
  ) {
    try {
      const voucherSubscription = await this.db_repository.updateOneByFilter(
        filter,
        updateData,
        incrementData,
        appendData
      );

      if (voucherSubscription) {
        await this.redis_repository.delKey(this.service);
      }

      return voucherSubscription;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async countDocuments(filter: FilterQuery<VoucherSubscription>) {
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
