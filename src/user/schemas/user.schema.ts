import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({ example: 'a@a.com', description: 'User email adress'})
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: 'Volodymyr', description: 'User first name'})
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({ example: 'Naradovyi', description: 'User last name'})
  @Prop({ required: true })
  secondName: string;

  @ApiProperty({ example: '123', description: 'User password'})
  @Prop({ required: true })
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function preSave(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(3);
  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

export { UserSchema };
