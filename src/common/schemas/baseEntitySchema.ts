// create a base schema class that can be extended by other schemas with isActive, createdAt and updatedAt properties

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

export type BaseEntityDocument = HydratedDocument<BaseEntity>;

@Schema()
export class BaseEntity {
  // _id
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId; // ObjectId

  @Prop({ type: Date, default: Date.now })
  createdAt: Date; // Creation timestamp

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date; //Last update timestamp

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean; // Active status
}

export const BaseEntitySchema = SchemaFactory.createForClass(BaseEntity);
