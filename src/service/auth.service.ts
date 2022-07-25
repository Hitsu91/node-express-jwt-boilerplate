import { DocumentType } from '@typegoose/typegoose';
import { omit } from 'lodash';
import { signJwt } from '../../utils/jwt';
import SessionModel from '../model/session.model';
import { User } from '../model/user.model';

export async function signRefreshToken(userId: string) {
  const refreshToken = signJwt({ session: userId }, 'refreshTokenPrivateKey', {
    expiresIn: '1y',
  });

  return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), User.PRIVATE_FIELDS);
  const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
    expiresIn: '1d',
  });
  return accessToken;
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}
