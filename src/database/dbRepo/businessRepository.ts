import { FilterQuery, UpdateQuery } from 'mongoose';
import { BusinessModel, Business } from '../models/Business';
import { InternalErrorException } from '../../errors/exceptions/internalError';

export class BusinessRepository {
  async create(data: Partial<Business>) {
    try {
      const business = await BusinessModel.create(data);
      return business;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findOneByFilter(filter: FilterQuery<Business>) {
    try {
      const business = await BusinessModel.findOne({
        ...filter,
        isDeleted: false,
      });
      return business;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findManyByFilter(filter: FilterQuery<Business>, options = {}) {
    try {
      const businesses = await BusinessModel.find({
        ...filter,
        isDeleted: false,
      }).sort({ createdAt: -1 });
      return businesses;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<Business>,
    updateData: UpdateQuery<Business> = {},
    incrementData: UpdateQuery<Business> = {},
    appendData: UpdateQuery<Business> = {}
  ) {
    try {
      const business = await BusinessModel.findOneAndUpdate(
        { ...filter, isDeleted: false },
        { $set: updateData, $inc: incrementData, $push: appendData },
        { new: true }
      );
      return business;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateManyByFilter(
    filter: FilterQuery<Business>,
    updateData: UpdateQuery<Business> = {},
    incrementData: UpdateQuery<Business> = {},
    appendData: UpdateQuery<Business> = {}
  ) {
    try {
      const result = await BusinessModel.updateMany(
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
      const result = await BusinessModel.aggregate(pipeline);
      return result;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async countDocuments(filter: FilterQuery<Business>) {
    try {
      const count = await BusinessModel.countDocuments({
        ...filter,
        isDeleted: false,
      });
      return count;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findOneByFilterPagination(filter: FilterQuery<Business>, options = {}) {
    try {
      const business = await BusinessModel.paginate({
        ...filter,
        isDeleted: false,
      }, options);
      return business;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findManyByFilterPagination(filter: FilterQuery<Business>, options = {}) {
    try {
      const businesses = await BusinessModel.paginate({
        ...filter,
        isDeleted: false,
      }, options);
      return businesses;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }
}