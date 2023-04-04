/* istanbul ignore file */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import 'dotenv/config';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { MAPPED_DB_ERRORS } from './contants/mappedDBErrors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger('ERROR');
  }

  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    let exc: HttpException | QueryFailedError;
    let statusCode: HttpStatus;
    let message: string;

    switch (true) {
      case exception instanceof HttpException:
        exc = exception as HttpException;
        statusCode = exc.getStatus();
        message = exc['response']['message'];
        break;

      case exception instanceof QueryFailedError:
        exc = exception as QueryFailedError;
        statusCode =
          MAPPED_DB_ERRORS[+exc.driverError.code] ??
          HttpStatus.INTERNAL_SERVER_ERROR;
        message = exc.driverError.detail;
        break;

      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
        break;
    }

    const userAgent = request.get('user-agent') || '';
    const { ip } = request;

    const resultResponse: any = {
      statusCode,
      message,
    };

    response.on('close', () => {
      const { statusCode, statusMessage } = response;
      this.logger.log(
        `status: ${statusCode} ${statusMessage} ${request.method} ${request.url} - ${userAgent} ${ip} \n ${exception.stack}`,
      );
    });

    response.status(statusCode).json(resultResponse);
  }
}
