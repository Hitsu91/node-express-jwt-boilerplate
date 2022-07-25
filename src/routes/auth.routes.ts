import express from 'express';
import {
  refreshAccessTokenHandler,
  signinHandler,
} from '../controllers/auth.controller';
import {
  createUserHandler,
  getCurrentUserHandler,
} from '../controllers/user.controller';
import requireUser from '../middleware/requireUser';
import validateResourse from '../middleware/validateResourse';
import { createSessionSchema } from '../schema/auth.schema';
import { createUserSchema } from '../schema/user.schema';

const router = express.Router();

router.post(
  '/api/auth/signin',
  validateResourse(createSessionSchema),
  signinHandler
);

router.post(
  '/api/signup',
  validateResourse(createUserSchema),
  createUserHandler
);

router.post('/api/auth/refresh', refreshAccessTokenHandler);

router.get('/api/auth/who-am-i', requireUser, getCurrentUserHandler);

export default router;
