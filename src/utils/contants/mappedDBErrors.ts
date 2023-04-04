import { HttpStatus } from '@nestjs/common';

export const MAPPED_DB_ERRORS: Record<number, HttpStatus> = {
  23505: HttpStatus.CONFLICT,
};
