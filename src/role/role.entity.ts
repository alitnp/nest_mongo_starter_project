import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/common/schemas/baseEntitySchema';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role extends BaseEntity {
  @Prop({
    required: true,
    unique: true,
  })
  title: string;

  @Prop()
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
