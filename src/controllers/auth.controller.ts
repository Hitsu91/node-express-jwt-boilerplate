import { Request, Response } from 'express';
import { verifyJwt } from '../../utils/jwt';
import { CreaSessionInput } from '../schema/auth.schema';
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from '../service/auth.service';
import { findUserByEmail, findUserById } from '../service/user.service';

export async function signinHandler(
  req: Request<{}, {}, CreaSessionInput>,
  res: Response
) {
  const message = 'Invalid email or password';
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.send(message);
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  // Sign an access token
  const accessToken = signAccessToken(user);
  // Sign a refresh token
  const refreshToken = await signRefreshToken(user._id);
  // Send the tokens
  return res.send({ accessToken, refreshToken });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = req.headers['x-refresh'] as string;
  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    'refreshTokenPublicKey'
  );

  if (!decoded) {
    return res.status(401).send('Could not refresh access token');
  }

  const session = await findSessionById(decoded.session);

  if (!session || !session.valid) {
    return res.status(401).send('Could not refresh access token');
  }
  const user = await findUserById(String(session.user));

  if (!user) {
    return res.status(401).send('Could not refresh access token');
  }

  const accessToken = signAccessToken(user);

  return res.send({ accessToken });
}
