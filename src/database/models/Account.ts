import { Schema, model, Document } from 'mongoose';
import { PaginateModel } from 'mongoose';
import { mongoosePaginate } from '../../connection/dbConn';
import { baseSchemaFields, baseSchemaOptions, BaseDocument } from './baseSchema';

export interface Account extends BaseDocument, Document {
  fullName: string;
  email: string;
  password: string;
  businesses: Schema.Types.ObjectId[];
  status: 'active' | 'suspended' | 'deleted';
}

const accountSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  businesses: [{
    type: Schema.Types.ObjectId,
    ref: 'Business'
  }],
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  }, ...baseSchemaFields
}, {
  ...baseSchemaOptions
});

accountSchema.plugin(mongoosePaginate);

interface AccountModel<T extends Document> extends PaginateModel<T> { }

export const AccountModel = model<Account, AccountModel<Account>>('Account', accountSchema);
