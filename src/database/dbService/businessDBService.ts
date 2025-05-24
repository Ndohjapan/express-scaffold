import { BusinessRepository } from '../dbRepo/businessRepository';
import RedisRepository from '../redisRepo';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { Business } from '../models/Business';
import { BadRequestException } from '../../errors/exceptions/badRequest';

export class BusinessDBService {
  private db_repository: BusinessRepository;
  private redis_repository: RedisRepository;
  private service: string;

  constructor() {
    this.db_repository = new BusinessRepository();
    this.redis_repository = new RedisRepository();
    this.service = 'businesses';
  }

  async create(data: Partial<Business>) {
    try {
      const business = await this.db_repository.create(data);
      await this.redis_repository.delKey(this.service);
      return business;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findOneByFilter(filter: FilterQuery<Business>) {
    try {
      const hash_key = `one-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const business = await this.db_repository.findOneByFilter(filter);

      if (business) {
        await this.redis_repository.setHashField(
          this.service,
          hash_key,
          JSON.stringify(business)
        );
      }

      return business;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findManyByFilter(filter: FilterQuery<Business>) {
    try {
      const hash_key = `many-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const businesses = await this.db_repository.findManyByFilter(filter);

      await this.redis_repository.setHashField(
        this.service,
        hash_key,
        JSON.stringify(businesses)
      );

      return businesses;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findOneByFilterPagination(filter: FilterQuery<Business>, options = {}) {
    try {
      const hash_key = `one-paginate-${JSON.stringify(filter)}-${JSON.stringify(options)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const business = await this.db_repository.findOneByFilterPagination(filter, options);

      if (business) {
        await this.redis_repository.setHashField(
          this.service,
          hash_key,
          JSON.stringify(business)
        );
      }

      return business;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findManyByFilterPagination(filter: FilterQuery<Business>, options = {}) {
    try {
      const hash_key = `many-paginate-${JSON.stringify(filter)}-${JSON.stringify(options)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const businesses = await this.db_repository.findManyByFilterPagination(filter, options);

      await this.redis_repository.setHashField(
        this.service,
        hash_key,
        JSON.stringify(businesses)
      );

      return businesses;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<Business>,
    updateData: UpdateQuery<Business> = {},
    incrementData: UpdateQuery<Business> = {},
    appendData: UpdateQuery<Business> = {}
  ) {
    try {
      const business = await this.db_repository.updateOneByFilter(
        filter,
        updateData,
        incrementData,
        appendData
      );

      await this.redis_repository.delKey(this.service);
      return business;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async updateManyByFilter(
    filter: FilterQuery<Business>,
    updateData: UpdateQuery<Business> = {},
    incrementData: UpdateQuery<Business> = {},
    appendData: UpdateQuery<Business> = {}
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

  async countDocuments(filter: FilterQuery<Business>) {
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
