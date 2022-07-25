import {
  DocumentType,
  getModelForClass,
  ModelOptions,
  pre,
  prop,
  Severity,
} from '@typegoose/typegoose';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';
import log from '../../utils/logger';

@pre<User>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const hash = await argon2.hash(this.password);

  this.password = hash;

  return;
})
@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  static readonly PRIVATE_FIELDS: Array<keyof DocumentType<User>> = [
    'password',
    '__v',
  ];

  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstname: string;

  @prop({ required: true })
  lastname: string;

  @prop({ required: true, default: () => nanoid() })
  password: string;

  async validatePassword(this: DocumentType<User>, candicatePassword: string) {
    try {
      return await argon2.verify(this.password, candicatePassword);
    } catch (e) {
      log.error(e, 'Could not validate password');
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
