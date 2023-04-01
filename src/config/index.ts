import { registerAs } from '@nestjs/config';
import database from './database';

export default registerAs('config', () => ({
  port: +process.env.PORT || 3000,
  saltHash: +process.env.SALT_HASH,
  jwtSecret: process.env.JWT_SECRET,
}));

export enum NODE_ENV {
  DEV = 'dev',
  PROD = 'prod',
  TEST = 'test',
}

export { database };
