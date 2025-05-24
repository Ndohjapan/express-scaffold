import { UserRepository } from '../dbRepo/userRepository';
import RedisRepository from '../redisRepo';
import { BadRequestException } from '../../errors/exceptions/badRequest';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { User } from '../models/User';

export class UserDBService {
  private db_repository: UserRepository;
  private redis_repository: RedisRepository;
  private service: string;

  constructor() {
    this.db_repository = new UserRepository();
    this.redis_repository = new RedisRepository();
    this.service = 'users';
  }

  async create(data: Partial<User>) {
    try {
      const user = await this.db_repository.create(data);
      await this.redis_repository.delKey(this.service);
      return user;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findOneByFilter(filter: FilterQuery<User>) {
    try {
      const hash_key = `one-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const user = await this.db_repository.findOneByFilter(filter);

      if (user) {
        await this.redis_repository.setHashField(
          this.service,
          hash_key,
          JSON.stringify(user)
        );
      }

      return user;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findManyByFilter(filter: FilterQuery<User>) {
    try {
      const hash_key = `many-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const users = await this.db_repository.findManyByFilter(filter);

      await this.redis_repository.setHashField(
        this.service,
        hash_key,
        JSON.stringify(users)
      );

      return users;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<User>,
    updateData: UpdateQuery<User> = {},
    incrementData: UpdateQuery<User> = {},
    appendData: UpdateQuery<User> = {}
  ) {
    try {
      const user = await this.db_repository.updateOneByFilter(
        filter,
        updateData,
        incrementData,
        appendData
      );

      await this.redis_repository.delKey(this.service);
      return user;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async updateManyByFilter(
    filter: FilterQuery<User>,
    updateData: UpdateQuery<User> = {},
    incrementData: UpdateQuery<User> = {},
    appendData: UpdateQuery<User> = {}
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

  async countDocuments(filter: FilterQuery<User>) {
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
