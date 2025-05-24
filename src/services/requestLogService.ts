import { LogRepository } from '../database/dbRepo/logRepository';
import { LOG_RETENTION } from '../config/logConfig';

export class RequestLogService {
  private logRepository: LogRepository;

  constructor() {
    this.logRepository = new LogRepository();
  }

  async CreateRequestLog(requestData: {
    reqHttpVersion?: string;
    reqHeaders: Record<string, any>;
    reqMethod: string;
    reqOriginalUrl: string;
    reqParams?: string;
    reqQuery?: string;
    reqBody?: any;
    statusCode?: number;
    reqIp?: string;
    userId?: string;
  }) {
    try {
      const now = new Date();
      const retentionPeriod = requestData.statusCode && requestData.statusCode >= 400
        ? LOG_RETENTION.REQUEST.ERROR
        : LOG_RETENTION.REQUEST.NORMAL;

      await this.logRepository.create({
        type: 'request',
        level: 'info',
        message: `${requestData.reqMethod} ${requestData.reqOriginalUrl}`,
        timestamp: now,
        expiresAt: new Date(now.getTime() + retentionPeriod),
        ...requestData
      });
    } catch (error) {
      console.error('Request Log Service Error:', error);
      // Don't throw - we don't want logging errors to break the application
    }
  }
}

export default RequestLogService;
