import { FilterQuery, UpdateQuery } from 'mongoose';
import { UserModel, User } from '../models/User';
import { InternalErrorException } from '../../errors/exceptions/internalError';


export class UserRepository {
  async create(data: Partial<User>) {
    try {
      const user = await UserModel.create(data);
      return user;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findOneByFilter(filter: FilterQuery<User>) {
    try {
      const user = await UserModel.findOne({
        ...filter,
        isDeleted: false,
      });
      return user;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findManyByFilter(filter: FilterQuery<User>, options = {}) {
    try {
      const users = await UserModel.find({
        ...filter,
        isDeleted: false,
      }).sort({ createdAt: -1 });
      return users;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<User>,
    updateData: UpdateQuery<User> = {},
    incrementData: UpdateQuery<User> = {},
    appendData: UpdateQuery<User> = {}
  ) {
    try {
      const user = await UserModel.findOneAndUpdate(
        { ...filter, isDeleted: false },
        { $set: updateData, $inc: incrementData, $push: appendData },
        { new: true }
      );
      return user;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateManyByFilter(
    filter: FilterQuery<User>,
    updateData: UpdateQuery<User> = {},
    incrementData: UpdateQuery<User> = {},
    appendData: UpdateQuery<User> = {}
  ) {
    try {
      const result = await UserModel.updateMany(
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
      const result = await UserModel.aggregate(pipeline);
      return result;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async countDocuments(filter: FilterQuery<User>) {
    try {
      const count = await UserModel.countDocuments({
        ...filter,
        isDeleted: false,
      });
      return count;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }
}