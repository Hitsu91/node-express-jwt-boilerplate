import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  firstname: string({
    required_error: 'Firstname is required',
  }),
  lastname: string({
    required_error: 'Lastname is required',
  }),
  password: string({
    required_error: 'Password is required',
  }).min(6, 'Password is too short -  should be min 6 chars'),
  passwordConfirmation: string({
    required_error: 'Password confirmation is required',
  }),
  email: string({
    required_error: 'Email is required',
  }).email('Not a valid email'),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;
