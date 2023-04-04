import * as argon2 from 'argon2';

export const createHash = (value: string) => argon2.hash(value);

export const validateHash = (value: string, hash: string) =>
  argon2.verify(hash, value);
