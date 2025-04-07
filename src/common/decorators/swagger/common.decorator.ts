import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as successResponse from '../../swagger/success-responses';
import * as errorResponse from '../../swagger/error-responses';

export const SwaggerDelete = ({
  description = "М'яке видалення запису",
  summary = "М'яке видалення запису",
} = {}) =>
  applyDecorators(
    ApiOperation({ description, summary }),
    ApiResponse({ status: 200, example: successResponse.deleted }),
    ApiResponse({ status: 404, example: errorResponse.recordNotFound404 }),
    ApiResponse({ status: 400, example: errorResponse.incorrectUUId400 }),
  );

export const SwaggerRestore = ({
  description = 'Поновлення запису з архіву',
  summary = 'Поновлення запису з архіву',
} = {}) =>
  applyDecorators(
    ApiOperation({ description, summary }),
    ApiResponse({ status: 200, example: successResponse.restored }),
    ApiResponse({ status: 404, example: errorResponse.recordNotFound404 }),
    ApiResponse({ status: 400, example: errorResponse.incorrectUUId400 }),
  );

export const SwaggerUpdate = ({
  example422 = {
    error: 'Unprocessable Entity',
    statusCode: 422,
  },
  description = 'Редагувати запис',
  summary = 'Редагувати запис',
} = {}) =>
  applyDecorators(
    ApiOperation({ description, summary }),
    ApiResponse({ status: 200, example: successResponse.updated }),
    ApiResponse({ status: 404, example: errorResponse.recordNotFound404 }),
    ApiResponse({ status: 400, example: errorResponse.incorrectUUId400 }),
    ApiResponse({ status: 422, example: example422 }),
  );

export const SwaggerGetByUUID = ({
  example200 = {
    data: {},
    message: 'Success',
    statusCode: 200,
  },
  description = 'Отримати записи за ідентифікатором',
  summary = 'Отримати записи за ідентифікатором',
} = {}) =>
  applyDecorators(
    ApiOperation({ description, summary }),
    ApiResponse({ status: 200, example: example200 }),
    ApiResponse({ status: 400, example: errorResponse.incorrectUUId400 }),
    ApiResponse({ status: 404, example: errorResponse.recordNotFound404 }),
  );

export const SwaggerGet = ({
  example200 = {
    data: [],
    message: 'Success',
    statusCode: 200,
  },
  description = 'Success',
  summary = 'Success',
} = {}) =>
  applyDecorators(
    ApiOperation({ description, summary }),
    ApiResponse({ status: 200, example: example200 }),
  );
export const SwaggerGetArchive = ({
  example200 = {
    data: [],
    message: 'Success',
    statusCode: 200,
  },
  description = "Отримання записів після м'якого видалення",
  summary = "Отримання записів після м'якого видалення",
} = {}) =>
  applyDecorators(
    ApiOperation({ description, summary }),
    ApiResponse({ status: 200, example: example200 }),
  );

export const SwaggerCreate = ({
  example201 = {
    data: {},
    message: 'Success',
    statusCode: 201,
  },
  example400 = {
    errors: {},
    error: 'Bad Request',
    statusCode: 400,
  },
  example422 = {
    message: 'Запис вже існує',
    error: 'Unprocessable Entity',
    statusCode: 422,
  },
  description = 'Створення нового запису',
  summary = 'Створення нового запису',
} = {}) =>
  applyDecorators(
    ApiOperation({ description, summary }),
    ApiResponse({ status: 201, example: example201 }),
    ApiResponse({ status: 400, example: example400 }),
    ApiResponse({ status: 422, example: example422 }),
  );
