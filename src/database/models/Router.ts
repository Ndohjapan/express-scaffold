import { Schema, model } from 'mongoose';
import { baseSchemaFields, baseSchemaOptions, BaseDocument } from './baseSchema';

export interface Router extends BaseDocument {
  business: {
    _id: Schema.Types.ObjectId;
    name: string;
  };
  type: 'mikrotik';
  connection: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
  status: 'online' | 'offline' | 'maintenance';
  stats: {
    connectedUsers: number;
    bandwidth: number;
    lastPing: Date;
  };
  paymentReference?: string;
}

const routerSchema = new Schema({
  business: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Business name is required'],
    },
  },
  type: {
    type: String,
    enum: ['mikrotik'],
    required: [true, 'Router type is required'],
  },
  connection: {
    host: {
      type: String,
      required: [true, 'Host is required'],
    },
    port: {
      type: Number,
      required: [true, 'Port is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Password won't be returned in queries by default
    },
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance'],
    default: 'offline',
  },
  stats: {
    connectedUsers: {
      type: Number,
      default: 0,
    },
    bandwidth: {
      type: Number,
      default: 0,
    },
    lastPing: {
      type: Date,
      default: Date.now,
    },
  },
  paymentReference: {
    type: String,
  },
  ...baseSchemaFields,
}, {
  ...baseSchemaOptions,
});

export const RouterModel = model<Router>('Router', routerSchema);
