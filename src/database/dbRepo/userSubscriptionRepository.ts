import { FilterQuery, UpdateQuery } from 'mongoose';
import { UserSubscriptionModel, UserSubscription } from '../models/UserSubscription';
import { InternalErrorException } from '../../errors/exceptions/internalError';

export class UserSubscriptionRepository {
  async create(data: Partial<UserSubscription>) {
    try {
      const userSubscription = await UserSubscriptionModel.create(data);
      return userSubscription;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findOneByFilter(filter: FilterQuery<UserSubscription>) {
    try {
      const userSubscription = await UserSubscriptionModel.findOne({
        ...filter,
        isDeleted: false,
      });
      return userSubscription;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findManyByFilter(filter: FilterQuery<UserSubscription>, options = {}) {
    try {
      const userSubscriptions = await UserSubscriptionModel.find({
        ...filter,
        isDeleted: false,
      }).sort({ createdAt: -1 });
      return userSubscriptions;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<UserSubscription>,
    updateData: UpdateQuery<UserSubscription> = {},
    incrementData: UpdateQuery<UserSubscription> = {},
    appendData: UpdateQuery<UserSubscription> = {}
  ) {
    try {
      const userSubscription = await UserSubscriptionModel.findOneAndUpdate(
        { ...filter, isDeleted: false },
        { $set: updateData, $inc: incrementData, $push: appendData },
        { new: true }
      );
      return userSubscription;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateManyByFilter(
    filter: FilterQuery<UserSubscription>,
    updateData: UpdateQuery<UserSubscription> = {},
    incrementData: UpdateQuery<UserSubscription> = {},
    appendData: UpdateQuery<UserSubscription> = {}
  ) {
    try {
      const result = await UserSubscriptionModel.updateMany(
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
      const result = await UserSubscriptionModel.aggregate(pipeline);
      return result;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async countDocuments(filter: FilterQuery<UserSubscription>) {
    try {
      const count = await UserSubscriptionModel.countDocuments({
        ...filter,
        isDeleted: false,
      });
      return count;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findOneByFilterPagination(filter: FilterQuery<UserSubscription>, options = {}) {
    try {
      const userSubscription = await UserSubscriptionModel.paginate({
        ...filter,
        isDeleted: false,
      }, options);
      return userSubscription;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findManyByFilterPagination(filter: FilterQuery<UserSubscription>, options = {}) {
    try {
      const userSubscriptions = await UserSubscriptionModel.paginate({
        ...filter,
        isDeleted: false,
      }, options);
      return userSubscriptions;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }
}
