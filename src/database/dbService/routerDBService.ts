import { RouterRepository } from '../dbRepo/routerRepository';
import RedisRepository from '../redisRepo';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { Router } from '../models/Router';
import { BadRequestException } from '../../errors/exceptions/badRequest';

export class RouterDBService {
  private db_repository: RouterRepository;
  private redis_repository: RedisRepository;
  private service: string;

  constructor() {
    this.db_repository = new RouterRepository();
    this.redis_repository = new RedisRepository();
    this.service = 'routers';
  }

  async create(data: Partial<Router>) {
    try {
      const router = await this.db_repository.create(data);
      await this.redis_repository.delKey(this.service);
      return router;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findOneByFilter(filter: FilterQuery<Router>) {
    try {
      const hash_key = `one-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const router = await this.db_repository.findOneByFilter(filter);

      if (router) {
        await this.redis_repository.setHashField(
          this.service,
          hash_key,
          JSON.stringify(router)
        );
      }

      return router;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findManyByFilter(filter: FilterQuery<Router>) {
    try {
      const hash_key = `many-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const routers = await this.db_repository.findManyByFilter(filter);

      await this.redis_repository.setHashField(
        this.service,
        hash_key,
        JSON.stringify(routers)
      );

      return routers;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<Router>,
    updateData: UpdateQuery<Router> = {},
    incrementData: UpdateQuery<Router> = {},
    appendData: UpdateQuery<Router> = {}
  ) {
    try {
      const router = await this.db_repository.updateOneByFilter(
        filter,
        updateData,
        incrementData,
        appendData
      );

      await this.redis_repository.delKey(this.service);
      return router;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async updateManyByFilter(
    filter: FilterQuery<Router>,
    updateData: UpdateQuery<Router> = {},
    incrementData: UpdateQuery<Router> = {},
    appendData: UpdateQuery<Router> = {}
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

  async countDocuments(filter: FilterQuery<Router>) {
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
