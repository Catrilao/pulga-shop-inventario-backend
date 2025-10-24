import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorDto } from '../dto/error.dto';
import { ERROR_CODES } from '../constants/error-codes';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let payload: ErrorDto = {
      message: 'Ocurrio un error en el servidor',
      error: ERROR_CODES.ERROR_INTERNO,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === 'object') {
        payload.message = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message.join(', ')
          : (exceptionResponse.message ?? String(exceptionResponse));
        payload.error =
          exceptionResponse.error ?? (exception as any).name ?? 'ERROR';
      } else {
        payload.message = String(exceptionResponse);
        payload.error = HttpStatus[status] ?? 'ERROR';
      }

      // TODO: add prisma specific errors
    } else if (exception instanceof Error) {
      payload.message = exception.message;
      payload.error = exception.name;
    }

    this.logger.error(
      payload.message,
      (exception as any)?.stack ?? '',
      AllExceptionsFilter.name,
    );

    this.logger.debug(
      JSON.stringify({
        status,
        path: req?.url,
        method: req?.method,
        body: (req as any)?.body,
        error: payload.error,
      }),
      AllExceptionsFilter.name,
    );

    res.status(status).json(payload);
  }
}
