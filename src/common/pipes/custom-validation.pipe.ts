import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (
      value === null ||
      value === undefined ||
      Object.keys(value).length === 0
    ) {
      throw new BadRequestException({
        message: 'Request body can`t be empty',
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    console.log('metatype:', metatype?.name);
    const object = plainToInstance(metatype, value);

    console.log('Object to validate:', object);

    const errors: ValidationError[] = await validate(object);

    console.log('object after transformation:', object);
    console.log('validation errors:', errors);

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException({
        errors: formattedErrors,
        error: 'Bad Request',
        statusCode: 400,
      });
    }
    return value;
  }

  private toValidate(metatype: any) {
    const primitiveTypes = [String, Boolean, Number, Array, Object];
    return !primitiveTypes.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]) {
    const formattedErrors = {};
    errors.forEach((error) => {
      const messages = Object.values(error.constraints ?? {});
      if (messages.length > 0) {
        formattedErrors[error.property] = messages;
      }
    });
    return formattedErrors;
  }
}
