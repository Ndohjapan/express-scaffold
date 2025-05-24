import { FilterQuery, UpdateQuery } from 'mongoose';
import { AccountModel, Account } from '../models/Account';
import { InternalErrorException } from '../../errors/exceptions/internalError';

export class AccountRepository {
  async create(data: Partial<Account>) {
    try {
      const account = await AccountModel.create(data);
      return account;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findOneByFilter(filter: FilterQuery<Account>) {
    try {
      const account = await AccountModel.findOne({
        ...filter,
        isDeleted: false,
      });
      return account;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findManyByFilter(filter: FilterQuery<Account>, options = {}) {
    try {
      const accounts = await AccountModel.find({
        ...filter,
        isDeleted: false,
      }, options);
      return accounts;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findOneByFilterPagination(filter: FilterQuery<Account>, options = {}) {
    try {
      const account = await AccountModel.paginate({
        ...filter,
        isDeleted: false,
      }, options);
      return account;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findManyByFilterPagination(filter: FilterQuery<Account>, options = {}) {
    try {
      const accounts = await AccountModel.paginate({
        ...filter,
        isDeleted: false,
      }, options);
      return accounts;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<Account>,
    updateData: UpdateQuery<Account> = {},
    incrementData: UpdateQuery<Account> = {},
    appendData: UpdateQuery<Account> = {}
  ) {
    try {
      const account = await AccountModel.findOneAndUpdate(
        { ...filter, isDeleted: false },
        { $set: updateData, $inc: incrementData, $push: appendData },
        { new: true }
      );
      return account;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateManyByFilter(
    filter: FilterQuery<Account>,
    updateData: UpdateQuery<Account> = {},
    incrementData: UpdateQuery<Account> = {},
    appendData: UpdateQuery<Account> = {}
  ) {
    try {
      const result = await AccountModel.updateMany(
        { ...filter, isDeleted: false },
        { $set: updateData, $inc: incrementData, $push: appendData }
      );
      return result;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async aggregate(pipeline: any[]) {
    try {
      pipeline.unshift({ $match: { isDeleted: false } });
      const result = await AccountModel.aggregate(pipeline);
      return result;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async countDocuments(filter: FilterQuery<Account>) {
    try {
      const count = await AccountModel.countDocuments({
        ...filter,
        isDeleted: false,
      });
      return count;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }
}
