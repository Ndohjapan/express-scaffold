import { Schema, model } from 'mongoose';
import { baseSchemaFields, baseSchemaOptions, BaseDocument } from './baseSchema';
import { PaginateModel } from 'mongoose';
import { mongoosePaginate } from '../../connection/dbConn';

export interface Business extends BaseDocument, Document {
  account: {
    _id: Schema.Types.ObjectId;
    email: string;
    fullName: string;
  };
  name: string;
  subdomain: string;
  customDomain?: string;
  status: 'draft' | 'active' | 'suspended';
  subscriptionModel: 'voucher' | 'account';
  branding: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    logo?: {
      url: string;
      alt: string;
    };
    flyer?: {
      url: string;
      alt: string;
    };
  };
  settings: {
    maxUsers: number;
    showLeaderboard: boolean;
    showCapacity: boolean;
    maxDevicesPerUser: number;
    defaultBandwidth: number;
    freeTrialLimit: number;
  };
  paymentGateway?: {
    provider: 'paystack' | 'maclink';
    secretKey?: string;
    publicKey?: string;
    percentage?: number;
  };
  analytics: {
    totalRevenue: number;
    activeUsers: number;
    lastUpdated: Date;
  };
}

const businessSchema = new Schema({
  account: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    email: String,
    fullName: String
  },
  name: {
    type: String,
    required: [true, 'Business name is required']
  },
  subdomain: {
    type: String,
    required: [true, 'Subdomain is required'],
    lowercase: true,
    trim: true
  },
  customDomain: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'suspended'],
    default: 'draft'
  },
  subscriptionModel: {
    type: String,
    enum: ['voucher', 'account'],
    required: [true, 'Subscription model is required']
  },
  branding: {
    colors: {
      primary: {
        type: String,
        default: '#3B82F6'
      },
      secondary: {
        type: String,
        default: '#8B5CF6'
      },
      accent: {
        type: String,
        default: '#60A5FA'
      }
    },
    logo: {
      url: String,
      alt: String
    },
    flyer: {
      url: String,
      alt: String
    }
  },
  settings: {
    maxUsers: {
      type: Number,
      default: 100
    },
    showLeaderboard: {
      type: Boolean,
      default: true
    },
    showCapacity: {
      type: Boolean,
      default: true
    },
    maxDevicesPerUser: {
      type: Number,
      default: 2
    },
    defaultBandwidth: {
      type: Number,
      default: 1 // in Mbps
    },
    freeTrialLimit: {
      type: Number,
      default: 1
    }
  },
  paymentGateway: {
    provider: {
      type: String,
      enum: ['paystack', 'maclink'],
      default: 'maclink'
    },
    secretKey: String,
    publicKey: String,
    percentage: {
      type: Number,
      default: 2.5 // Default percentage for Maclink's cut
    }
  },
  analytics: {
    totalRevenue: {
      type: Number,
      default: 0
    },
    activeUsers: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  ...baseSchemaFields
}, {
  ...baseSchemaOptions
});

// Indexes for performance
businessSchema.index({ subdomain: 1 });
businessSchema.index({ customDomain: 1 });
businessSchema.index({ 'account._id': 1 });

businessSchema.plugin(mongoosePaginate);

interface BusinessModel<T extends Document> extends PaginateModel<T> { }

export const BusinessModel = model<Business, BusinessModel<Business>>('Business', businessSchema);
