import { LogModel, ILog } from '../models/Log';
import { InternalErrorException } from '../../errors/exceptions/internalError';

export class LogRepository {
  async create(data: Partial<ILog>) {
    try {
      const log = await LogModel.create(data);
      return log;
    } catch (error: any) {
      console.error('Log Repository Error:', error);
      throw new InternalErrorException(error.message, error);
    }
  }
}