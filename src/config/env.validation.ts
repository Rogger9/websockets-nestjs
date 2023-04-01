import * as Joi from 'joi';
import { NODE_ENV } from '.';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(NODE_ENV.PROD, NODE_ENV.DEV, NODE_ENV.TEST)
    .default(NODE_ENV.DEV),
  PORT: Joi.number().default(3000),
  DB_TYPE: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().default('localhost'),
  SALT_HASH: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
});
