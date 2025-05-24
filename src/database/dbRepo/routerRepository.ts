import { FilterQuery, UpdateQuery } from 'mongoose';
import { RouterModel, Router } from '../models/Router';
import { InternalErrorException } from '../../errors/exceptions/internalError';

export class RouterRepository {
  async create(data: Partial<Router>) {
    try {
      const router = await RouterModel.create(data);
      return router;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findOneByFilter(filter: FilterQuery<Router>) {
    try {
      const router = await RouterModel.findOne({
        ...filter,
        isDeleted: false,
      });
      return router;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async findManyByFilter(filter: FilterQuery<Router>, options = {}) {
    try {
      const routers = await RouterModel.find({
        ...filter,
        isDeleted: false,
      }).sort({ createdAt: -1 });
      return routers;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateOneByFilter(
    filter: FilterQuery<Router>,
    updateData: UpdateQuery<Router> = {},
    incrementData: UpdateQuery<Router> = {},
    appendData: UpdateQuery<Router> = {}
  ) {
    try {
      const router = await RouterModel.findOneAndUpdate(
        { ...filter, isDeleted: false },
        { $set: updateData, $inc: incrementData, $push: appendData },
        { new: true }
      );
      return router;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async updateManyByFilter(
    filter: FilterQuery<Router>,
    updateData: UpdateQuery<Router> = {},
    incrementData: UpdateQuery<Router> = {},
    appendData: UpdateQuery<Router> = {}
  ) {
    try {
      const result = await RouterModel.updateMany(
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
      const result = await RouterModel.aggregate(pipeline);
      return result;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }

  async countDocuments(filter: FilterQuery<Router>) {
    try {
      const count = await RouterModel.countDocuments({
        ...filter,
        isDeleted: false,
      });
      return count;
    } catch (error: any) {
      throw new InternalErrorException(error.message, error);
    }
  }
}
