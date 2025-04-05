import { UnprocessableEntityException } from '@nestjs/common';

export function throwUnprocessable(message: string, status?: string) {
  throw new UnprocessableEntityException({
    message,
    status,
    error: 'Unprocessable Entity',
    statusCode: 422,
  });
}
