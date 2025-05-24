import { Schema } from 'mongoose';

export interface BaseDocument {
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

export const baseSchemaFields = {
  isDeleted: {
    type: Boolean,
    default: false,
    select: false,
  }
};

export const baseSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc: any, ret: any) {
      delete ret.__v;
      return ret;
    }
  }
};

export const baseSchema = new Schema({
  ...baseSchemaFields
}, baseSchemaOptions);
