import { LogRepository } from '../database/dbRepo/logRepository';
import { LOG_RETENTION } from '../config/logConfig';

interface ErrorLogData {
  message: string;
  stack?: string;
  name?: string;
  statusCode?: number;
  userId?: string;
  metadata?: Record<string, any>;
  reqHttpVersion?: string;
  reqHeaders?: Record<string, any>;
  reqMethod?: string;
  reqOriginalUrl?: string;
  reqParams?: string;
  reqQuery?: string;
  reqBody?: Record<string, any>;
  reqIp?: string;
}

class ErrorLogService {
  private logRepository: LogRepository;

  constructor() {
    this.logRepository = new LogRepository();
  }

  async CreateErrorLog(errorData: ErrorLogData) {
    try {
      const now = new Date();
      const retentionPeriod = LOG_RETENTION.ERROR.DEFAULT;

      const logData = {
        ...errorData,
        type: "error" as "error",
        level: "error" as "error",
        timestamp: now,
        expiresAt: new Date(now.getTime() + retentionPeriod),
        metadata: {
          ...errorData.metadata,
          timestamp: now.toISOString(),
          environment: process.env.NODE_ENV
        }
      };

      await this.logRepository.create(logData);
    } catch (error) {
      // Log to console as fallback if database logging fails
      console.error('Error Log Service Error:', error);
      // Don't throw - we don't want logging failures to affect the application
    }
  }
}

export default ErrorLogService;
