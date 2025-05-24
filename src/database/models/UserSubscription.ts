import { Schema, model, Document, PaginateModel } from 'mongoose';
import { baseSchemaFields, baseSchemaOptions, BaseDocument } from './baseSchema';
import { mongoosePaginate } from '../../connection/dbConn';


export interface UserSubscription extends BaseDocument, Document {
  user: {
    _id: Schema.Types.ObjectId;
    fullName: string;
    username: string;
    email: string;
  };
  business: {
    _id: Schema.Types.ObjectId;
    name: string;
  };
  plan: {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
    duration: number;
    amount: number;
    datacap?: number;
    speedLimit?: number;
  };
  amountPaid: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  paymentReference: string;
  status: 'active' | 'paused' | 'expired';
}

const userSubscriptionSchema = new Schema({
  user: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    fullName: {
      type: String,
      required: [true, 'User full name is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
    },
  },
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
  plan: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    duration: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    datacap: Number,
    speedLimit: Number,
  },
  amountPaid: {
    type: Number,
    required: [true, 'Amount paid is required'],
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'NGN',
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  paymentReference: {
    type: String,
    required: [true, 'Payment reference is required'],
    unique: true,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'expired'],
    required: [true, 'Status is required'],
    default: 'active',
  },
  ...baseSchemaFields,
}, {
  ...baseSchemaOptions,
});

// Indexes
userSubscriptionSchema.index({ 'user._id': 1, 'business._id': 1, status: 1 });

userSubscriptionSchema.plugin(mongoosePaginate);

interface UserSubscriptionModel<T extends Document> extends PaginateModel<T> { }

export const UserSubscriptionModel = model<UserSubscription, UserSubscriptionModel<UserSubscription>>('UserSubscription', userSubscriptionSchema);
