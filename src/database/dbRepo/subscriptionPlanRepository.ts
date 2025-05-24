import { FilterQuery, UpdateQuery } from 'mongoose';
import { SubscriptionPlanModel, SubscriptionPlan } from '../models/SubscriptionPlan';
import { InternalErrorException } from '../../errors/exceptions/internalError';

export class SubscriptionPlanRepository {
  async create(data: Partial<SubscriptionPlan>) {
    try {
      const plan = await SubscriptionPlanModel.create(data);
      return plan;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findOneByFilter(filter: FilterQuery<SubscriptionPlan>) {
    try {
      const plan = await SubscriptionPlanModel.findOne({
        ...filter,
        isDeleted: false,
      });
      return plan;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findManyByFilter(filter: FilterQuery<SubscriptionPlan>, options = {}) {
    try {
      const plans = await SubscriptionPlanModel.find({
        ...filter,
        isDeleted: false,
      }).sort({ createdAt: -1 });
      return plans;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<SubscriptionPlan>,
    updateData: UpdateQuery<SubscriptionPlan> = {},
    incrementData: UpdateQuery<SubscriptionPlan> = {},
    appendData: UpdateQuery<SubscriptionPlan> = {}
  ) {
    try {
      const plan = await SubscriptionPlanModel.findOneAndUpdate(
        { ...filter, isDeleted: false },
        { $set: updateData, $inc: incrementData, $push: appendData },
        { new: true }
      );
      return plan;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateManyByFilter(
    filter: FilterQuery<SubscriptionPlan>,
    updateData: UpdateQuery<SubscriptionPlan> = {},
    incrementData: UpdateQuery<SubscriptionPlan> = {},
    appendData: UpdateQuery<SubscriptionPlan> = {}
  ) {
    try {
      const result = await SubscriptionPlanModel.updateMany(
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
      const result = await SubscriptionPlanModel.aggregate(pipeline);
      return result;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async countDocuments(filter: FilterQuery<SubscriptionPlan>) {
    try {
      const count = await SubscriptionPlanModel.countDocuments({
        ...filter,
        isDeleted: false,
      });
      return count;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }
}
