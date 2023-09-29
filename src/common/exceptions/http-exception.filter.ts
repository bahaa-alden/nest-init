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
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';

const handelPassportError = () =>
  new UnauthorizedException({ message: 'الرجاء تسجيل الدخول' });
const exist = (table: string) => {
  if (table === 'role_permissions_permission')
    return new BadRequestException('permission already exist in role');
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

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
    console.log(exception);
    if (status === 500) console.log(exception);

    httpAdapter.reply(
      response,
      {
        type: error.errors ? 'form' : 'default',
        message: error.message,
        errors: error.errors,
      },
      status,
    );
  }
}
