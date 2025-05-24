import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface ILog extends Document {
  type: 'error' | 'request';
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  expiresAt: Date;
  reqHttpVersion?: string;
  reqHeaders?: Record<string, any>;
  reqMethod?: string;
  reqOriginalUrl?: string;
  reqParams?: string;
  reqQuery?: string;
  reqBody?: any;
  reqIp?: string;
  userId?: string;
  stack?: string;
  statusCode?: number;
  metadata?: Record<string, any>;
}

const LogSchema = new Schema<ILog>({
  type: { type: String, required: true, enum: ['error', 'request'] },
  level: { type: String, required: true, enum: ['info', 'warn', 'error'] },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  reqHttpVersion: String,
  reqHeaders: Schema.Types.Mixed,
  reqMethod: String,
  reqOriginalUrl: String,
  reqParams: String,
  reqQuery: String,
  reqBody: Schema.Types.Mixed,
  reqIp: String,
  userId: String,
  stack: String,
  statusCode: Number,
  metadata: Schema.Types.Mixed
});

LogSchema.plugin(mongoosePaginate);
LogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
LogSchema.index({ timestamp: -1, type: 1 });

export const LogModel = mongoose.model<ILog>('Log', LogSchema);