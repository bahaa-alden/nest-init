import { ForbiddenError } from '@casl/ability';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  HttpStatus,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { AppConfig } from '../../config/app';
import { ConfigType } from '@nestjs/config';

const handelPassportError = () =>
  new UnauthorizedException({ message: 'الرجاء تسجيل الدخول' });
const exist = (table: string) => {
  if (table === 'roles_permissions')
    return new BadRequestException('permission already exist in role');
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly appConfig: ConfigType<typeof AppConfig>,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let error: any =
      exception instanceof ForbiddenError
        ? new ForbiddenException(exception.message)
        : exception.code === '23505'
        ? new BadRequestException(exception.detail)
        : exception.code === '23503'
        ? new NotFoundException(exception.detail + ' not found')
        : exception instanceof HttpException
        ? exception.getResponse()
        : new InternalServerErrorException('something went very wrong');

    if (error.message === 'Unauthorized') error = handelPassportError();
    const status = (() => {
      switch (true) {
        case exception instanceof HttpException:
          return exception.getStatus();
        case exception instanceof ForbiddenError:
          return HttpStatus.FORBIDDEN;
        default:
          return HttpStatus.INTERNAL_SERVER_ERROR;
      }
    })();

    if (this.appConfig.env === 'production') {
      if (status === 500) console.log(exception);
      const rep = {
        type: error.errors ? 'form' : 'default',
        message: error.message,
        errors: error.errors,
      };
      this.reply(httpAdapter, response, status, rep);
    } else {
      const rep = {
        error: exception,
        stack: exception.stack,
        message: exception.message,
      };
      this.reply(httpAdapter, response, status, rep);
    }
  }

  reply(
    httpAdapter: AbstractHttpAdapter,
    response: Response,
    status: number,
    rep: any,
  ) {
    httpAdapter.reply(response, rep, status);
  }
}
