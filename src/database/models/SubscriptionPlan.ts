import { Schema, model } from 'mongoose';
import { baseSchemaFields, baseSchemaOptions, BaseDocument } from './baseSchema';

export interface SubscriptionPlan extends BaseDocument {
  business: {
    _id: Schema.Types.ObjectId;
    name: string;
  };
  name: string;
  description: string;
  amount: number;
  currency: string;
  duration: number; // minutes
  datacap?: number; // GB
  speedLimit?: number; // Mbps
  deviceLimit?: number;
  canBePaused: boolean;
  totalPauseTime?: number; // minutes
}

const subscriptionPlanSchema = new Schema({
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
  name: {
    type: String,
    required: [true, 'Plan name is required'],
  },
  description: {
    type: String,
    required: [true, 'Plan description is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Plan amount is required'],
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'NGN',
  },
  duration: {
    type: Number,
    required: [true, 'Duration in minutes is required'],
  },
  datacap: {
    type: Number,
  },
  speedLimit: {
    type: Number,
  },
  deviceLimit: {
    type: Number,
  },
  canBePaused: {
    type: Boolean,
    default: false,
  },
  totalPauseTime: {
    type: Number,
    default: 0,
  },
  ...baseSchemaFields,
}, {
  ...baseSchemaOptions,
});

export const SubscriptionPlanModel = model<SubscriptionPlan>('SubscriptionPlan', subscriptionPlanSchema);
