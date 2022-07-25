import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

const validateResourse =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).send(error.errors);
    }
  };

export default validateResourse;
