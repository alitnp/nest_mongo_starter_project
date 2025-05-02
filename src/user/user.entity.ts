import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/common/schemas/baseEntitySchema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends BaseEntity {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Virtual({
    get: function () {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  fullName: string;

  @Prop()
  username: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  // This ensures the field is not confused with a populated reference
  roles: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
