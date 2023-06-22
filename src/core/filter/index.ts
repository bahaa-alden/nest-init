import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

const handelPassportError = () =>
  new UnauthorizedException({ message: 'الرجاء تسجيل الدخول' });

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let error: any = exception.getResponse();
    if (error.message === 'Unauthorized') error = handelPassportError();
    response
      .status(status)
      .json({ message: error.message, errors: error.errors });
  }
}
