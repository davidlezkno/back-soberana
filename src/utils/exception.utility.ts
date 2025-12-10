import { HttpException, HttpStatus } from '@nestjs/common';

export function Exception(exception: any, errors?: string[], logs?: any) {
  if (logs || process.env.DEVELOPMENT) console.log(logs);

  if (typeof exception == 'string') {
    const errors_clean = errors.map((error) =>
      error.replace(/^[a-zA-Z]+: /, '')
    );

    throw new HttpException(
      {
        errors: {
          [exception]: errors_clean,
        },
      },
      HttpStatus.BAD_REQUEST
    );
  } else if (exception.exception) {
    throw new HttpException(
      {
        message: exception.exception.message,
        errors: {
          [exception.exception.title]: [`${exception.message}`, ...errors],
        },
      },
      exception.exception.http_code
    );
  } else {
    throw new HttpException(
      {
        message: exception.message,
        errors: {
          [exception.title]: [`${exception.message}`, ...(errors || [])],
        },
      },
      exception.http_code
    );
  }
}

