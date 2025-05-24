import { Schema, model, Document, PaginateModel } from 'mongoose';
import { baseSchemaFields, baseSchemaOptions, BaseDocument } from './baseSchema';
import { mongoosePaginate } from '../../connection/dbConn';

export interface VoucherSubscription extends BaseDocument, Document {
  business: {
    _id: Schema.Types.ObjectId;
    name: string;
  };
  fullName: string;
  email: string;
  paymentReference: string;
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
  voucherCode: string;
}

const voucherSubscriptionSchema = new Schema({
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
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
  },
  paymentReference: {
    type: String,
    required: [true, 'Payment reference is required'],
    unique: true,
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
  voucherCode: {
    type: String,
    required: [true, 'Voucher code is required'],
    unique: true,
  },
  ...baseSchemaFields,
}, {
  ...baseSchemaOptions,
});

// Indexes
voucherSubscriptionSchema.index({ 'business._id': 1, voucherCode: 1 }, { unique: true });

voucherSubscriptionSchema.plugin(mongoosePaginate)

interface VoucherSubscriptionModel<T extends Document> extends PaginateModel<T> { }

export const VoucherSubscriptionModel = model<VoucherSubscription, VoucherSubscriptionModel<VoucherSubscription>>('VoucherSubscription', voucherSubscriptionSchema);
