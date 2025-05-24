import { Schema, model, Document, PaginateModel } from 'mongoose';
import { baseSchemaFields, baseSchemaOptions, BaseDocument } from './baseSchema';
import { mongoosePaginate } from '../../connection/dbConn';


export interface User extends BaseDocument, Document {
  business: {
    _id: Schema.Types.ObjectId;
    name: string;
  };
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  captivePortalPassword: string;
  devices: Array<{
    macAddress: string;
    lastSeen: Date;
    name?: string;
  }>;
  currentPlan?: {
    plan: {
      _id: Schema.Types.ObjectId;
      name: string;
      duration: number;
      amount: number;
    };
    subscription: {
      _id: Schema.Types.ObjectId;
      startDate: Date;
      endDate: Date;
      status: 'active' | 'paused' | 'expired';
    };
    pause?: {
      status: boolean;
      startDate: Date;
      totalPauseTime: number;
    };
    amountPaid: number;
    startDate: Date;
    endDate: Date;
  };
  customFields?: Record<string, any>;
  stats: {
    totalTime: number;
    weeklyTime: number;
    freeTrialsUsed: number;
  };
  otp?: {
    code: string;
    expiresAt: Date;
  };
  resetToken?: {
    token: string;
    expiresAt: Date;
  };
  verified: boolean;
}

const userSchema = new Schema({
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
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  phone: String,
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false, // Password won't be returned in queries by default
  },
  captivePortalPassword: {
    type: String,
    required: [true, 'Captive portal password is required'],
  },
  devices: [{
    macAddress: {
      type: String,
      required: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    name: String,
  }],
  currentPlan: {
    plan: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'SubscriptionPlan',
      },
      name: String,
      duration: Number,
      amount: Number,
    },
    subscription: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'UserSubscription',
      },
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['active', 'paused', 'expired'],
      },
    },
    pause: {
      status: Boolean,
      startDate: Date,
      totalPauseTime: Number,
    },
    amountPaid: Number,
    startDate: Date,
    endDate: Date,
  },
  customFields: Schema.Types.Mixed,
  stats: {
    totalTime: {
      type: Number,
      default: 0,
    },
    weeklyTime: {
      type: Number,
      default: 0,
    },
    freeTrialsUsed: {
      type: Number,
      default: 0,
    },
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
  resetToken: {
    token: String,
    expiresAt: Date,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  ...baseSchemaFields,
}, {
  ...baseSchemaOptions,
});

// Indexes
userSchema.index({ 'business._id': 1, email: 1 }, { unique: true });
userSchema.index({ 'business._id': 1, username: 1 }, { unique: true });

userSchema.plugin(mongoosePaginate)

interface UserModel<T extends Document> extends PaginateModel<T> { }


export const UserModel = model<User, UserModel<User>>('User', userSchema);
