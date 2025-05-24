import { AccountRepository } from '../dbRepo/accountRepository';
import RedisRepository from '../redisRepo';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { Account } from '../models/Account';
import { BadRequestException } from '../../errors/exceptions/badRequest';

export class AccountDBService {
  private db_repository: AccountRepository;
  private redis_repository: RedisRepository;
  private service: string;

  constructor() {
    this.db_repository = new AccountRepository();
    this.redis_repository = new RedisRepository();
    this.service = 'accounts';
  }

  async create(data: Partial<Account>) {
    try {
      const account = await this.db_repository.create(data);
      await this.redis_repository.delKey(this.service);
      return account;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findOneByFilter(filter: FilterQuery<Account>) {
    try {
      const hash_key = `one-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const account = await this.db_repository.findOneByFilter(filter);

      if (account) {
        await this.redis_repository.setHashField(
          this.service,
          hash_key,
          JSON.stringify(account)
        );
      }

      return account;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findManyByFilter(filter: FilterQuery<Account>) {
    try {
      const hash_key = `many-${JSON.stringify(filter)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const accounts = await this.db_repository.findManyByFilter(filter);

      await this.redis_repository.setHashField(
        this.service,
        hash_key,
        JSON.stringify(accounts)
      );

      return accounts;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findOneByFilterPagination(filter: FilterQuery<Account>, options = {}) {
    try {
      const hash_key = `one-paginate-${JSON.stringify(filter)}-${JSON.stringify(options)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const account = await this.db_repository.findOneByFilterPagination(filter, options);

      if (account) {
        await this.redis_repository.setHashField(
          this.service,
          hash_key,
          JSON.stringify(account)
        );
      }

      return account;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async findManyByFilterPagination(filter: FilterQuery<Account>, options = {}) {
    try {
      const hash_key = `many-paginate-${JSON.stringify(filter)}-${JSON.stringify(options)}`;
      const cached_response = await this.redis_repository.getHashField(
        this.service,
        hash_key
      );

      if (cached_response) {
        return JSON.parse(cached_response);
      }

      const accounts = await this.db_repository.findManyByFilterPagination(filter, options);

      await this.redis_repository.setHashField(
        this.service,
        hash_key,
        JSON.stringify(accounts)
      );

      return accounts;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<Account>,
    updateData: UpdateQuery<Account> = {},
    incrementData: UpdateQuery<Account> = {},
    appendData: UpdateQuery<Account> = {}
  ) {
    try {
      const account = await this.db_repository.updateOneByFilter(
        filter,
        updateData,
        incrementData,
        appendData
      );

      await this.redis_repository.delKey(this.service);
      return account;
    } catch (error: any) {
      throw new BadRequestException(error.message, error.code);
    }
  }

  async updateManyByFilter(
    filter: FilterQuery<Account>,
    updateData: UpdateQuery<Account> = {},
    incrementData: UpdateQuery<Account> = {},
    appendData: UpdateQuery<Account> = {}
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

  async countDocuments(filter: FilterQuery<Account>) {
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
