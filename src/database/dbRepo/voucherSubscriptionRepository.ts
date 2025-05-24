import { FilterQuery, UpdateQuery } from 'mongoose';
import { VoucherSubscriptionModel, VoucherSubscription } from '../models/VoucherSubscription';
import { InternalErrorException } from '../../errors/exceptions/internalError';

export class VoucherSubscriptionRepository {
  async create(data: Partial<VoucherSubscription>) {
    try {
      const voucherSubscription = await VoucherSubscriptionModel.create(data);
      return voucherSubscription;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findOneByFilter(filter: FilterQuery<VoucherSubscription>) {
    try {
      const voucherSubscription = await VoucherSubscriptionModel.findOne({
        ...filter,
        isDeleted: false,
      });
      return voucherSubscription;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findManyByFilter(filter: FilterQuery<VoucherSubscription>, options = {}) {
    try {
      const voucherSubscriptions = await VoucherSubscriptionModel.find({
        ...filter,
        isDeleted: false,
      }).sort({ createdAt: -1 });
      return voucherSubscriptions;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<VoucherSubscription>,
    updateData: UpdateQuery<VoucherSubscription> = {},
    incrementData: UpdateQuery<VoucherSubscription> = {},
    appendData: UpdateQuery<VoucherSubscription> = {}
  ) {
    try {
      const voucherSubscription = await VoucherSubscriptionModel.findOneAndUpdate(
        { ...filter, isDeleted: false },
        { $set: updateData, $inc: incrementData, $push: appendData },
        { new: true }
      );
      return voucherSubscription;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateManyByFilter(
    filter: FilterQuery<VoucherSubscription>,
    updateData: UpdateQuery<VoucherSubscription> = {},
    incrementData: UpdateQuery<VoucherSubscription> = {},
    appendData: UpdateQuery<VoucherSubscription> = {}
  ) {
    try {
      const result = await VoucherSubscriptionModel.updateMany(
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
      const result = await VoucherSubscriptionModel.aggregate(pipeline);
      return result;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async countDocuments(filter: FilterQuery<VoucherSubscription>) {
    try {
      const count = await VoucherSubscriptionModel.countDocuments({
        ...filter,
        isDeleted: false,
      });
      return count;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findOneByFilterPagination(filter: FilterQuery<VoucherSubscription>, options = {}) {
    try {
      const voucherSubscription = await VoucherSubscriptionModel.paginate({
        ...filter,
        isDeleted: false,
      }, options);
      return voucherSubscription;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findManyByFilterPagination(filter: FilterQuery<VoucherSubscription>, options = {}) {
    try {
      const voucherSubscriptions = await VoucherSubscriptionModel.paginate({
        ...filter,
        isDeleted: false,
      }, options);
      return voucherSubscriptions;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }
}