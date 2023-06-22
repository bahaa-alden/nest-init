import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as argon from 'argon2';

export type UserDocument = User & Document;

@Schema({
  toJSON: { virtuals: true, versionKey: false },
  toObject: { virtuals: true, versionKey: false },
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ default: 'https://i.imgur.com/7rlze8l.jpg' })
  photo: string;

  @Prop({ enum: ['admin', 'user', 'superadmin'], default: 'user' })
  role: string;

  @Prop({ required: true, select: false })
  password: string;
}
export const userSchema = SchemaFactory.createForClass(User);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await argon.hash(this.password);
  next();
});

userSchema.methods.comparePassword = async function (
  password: string,
  dtoPassword: string,
) {
  return await argon.verify(password, dtoPassword);
};
