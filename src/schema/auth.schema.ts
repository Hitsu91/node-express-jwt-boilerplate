import { object, string, TypeOf } from 'zod';

export const createSessionSchema = object({
  email: string({
    required_error: 'email is required',
  }).email('Invalid email or password'),
  password: string({ required_error: 'Password is required' }).min(
    6,
    'Invalid email or password'
  ),
});

export type CreaSessionInput = TypeOf<typeof createSessionSchema>;
