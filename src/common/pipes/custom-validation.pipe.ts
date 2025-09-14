import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// @Injectable()
// export class CustomValidationPipe implements PipeTransform {
//   async transform(value: any, { metatype }: ArgumentMetadata) {
//     if (!metatype || !this.toValidate(metatype)) {
//       return value;
//     }
//
//     if (
//       value === null ||
//       value === undefined ||
//       Object.keys(value).length === 0
//     ) {
//       throw new BadRequestException({
//         message: 'Request body can`t be empty',
//         error: 'Bad Request',
//         statusCode: 400,
//       });
//     }
//
//     const object = plainToInstance(metatype, value);
//     const errors: ValidationError[] = await validate(object);
//
//     if (errors.length > 0) {
//       const formattedErrors = this.formatErrors(errors);
//       throw new BadRequestException({
//         errors: formattedErrors,
//         error: 'Bad Request',
//         statusCode: 400,
//       });
//     }
//     return value;
//   }
//
//   private toValidate(metatype: any) {
//     const primitiveTypes = [String, Boolean, Number, Array, Object];
//     return !primitiveTypes.includes(metatype);
//   }
//
//   private formatErrors(errors: ValidationError[]) {
//     const formattedErrors = {};
//     errors.forEach((error) => {
//       const messages = Object.values(error.constraints ?? {});
//       if (messages.length > 0) {
//         formattedErrors[error.property] = messages;
//       }
//     });
//     return formattedErrors;
//   }
// }
@Injectable()
export class CustomValidationPipe implements PipeTransform {
  /**
   * Метод transform - це серце пайпа. Він виконується для кожного аргументу контролера,
   * до якого застосовано пайп.
   *
   * @param value - Вхідні дані (тіло запиту, параметри URL тощо).
   * @param metatype - Метатип аргументу, тобто клас DTO, який очікується.
   * Наприклад, для @Body() createDto: CreateFullPropertyDto, metatype буде CreateFullPropertyDto.
   */
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // 1. Перевірка на "не-DTO" типи
    // Якщо metatype не визначено (наприклад, для примітивів, які не є DTO)
    // або якщо toValidate повертає false (що означає, що це примітивний тип, як String, Number тощо),
    // ми пропускаємо валідацію через class-validator, оскільки вона призначена для класів DTO.
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // 2. Перевірка на порожнє або некоректне тіло запиту
    // Ця умова є надійною і охоплює різні сценарії "порожніх" або невідповідних вхідних даних:
    // - value === null: Тіло запиту є явно null.
    // - value === undefined: Тіло запиту відсутнє.
    // - typeof value !== 'object': Тіло запиту є примітивом (число, рядок, булеве) замість об'єкта DTO.
    // - Object.keys(value).length === 0: Тіло запиту є порожнім об'єктом ({}).
    if (
      value === null ||
      value === undefined ||
      typeof value !== 'object' ||
      Object.keys(value).length === 0
    ) {
      throw new BadRequestException({
        message:
          "Тіло запиту не може бути порожнім або некоректним об'єктом. Очікується JSON-об'єкт з даними.",
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    // 3. Перетворення "сирого" об'єкта на екземпляр DTO-класу
    // plainToInstance з class-transformer бере звичайний JavaScript-об'єкт (отриманий з JSON)
    // і перетворює його на справжній екземпляр класу metatype. Це дозволяє class-validator
    // коректно застосовувати декоратори валідації, включно з @ValidateNested() та @Type().
    // enableImplicitConversion: true допомагає автоматично конвертувати прості типи
    // (наприклад, рядок "123" в число 123, якщо поле DTO очікує number).
    const object = plainToInstance(metatype, value, {
      enableImplicitConversion: true,
    });

    // 4. Виконання валідації
    // Функція validate з class-validator перевіряє об'єкт на відповідність правилам,
    // визначеним декораторами (@IsNotEmpty, @IsUUID, @ValidateNested тощо).
    const errors: ValidationError[] = await validate(object, {
      whitelist: true, // Видаляє властивості, яких немає в DTO.
      forbidNonWhitelisted: false, // Кидає помилку, якщо вхідні дані містять невідомі властивості.
      forbidUnknownValues: false, // Забороняє невідомі властивості також і у вкладених об'єктах.
    });

    // 5. Обробка помилок валідації
    // Якщо масив errors не порожній, це означає, що валідація не пройшла.
    // Ми форматуємо ці помилки для зручного виведення на фронтенд і викидаємо BadRequestException.
    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException({
        errors: formattedErrors, // Список відформатованих помилок
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    // 6. Повернення провалідованого об'єкта
    // Якщо валідація пройшла успішно, повертаємо трансформований об'єкт.
    // Контролер отримає вже типобезпечний екземпляр DTO.
    return object;
  }

  /**
   * Допоміжна функція, яка визначає, чи потрібно виконувати валідацію.
   * Ми валідуємо лише класи (DTO), а не примітивні типи JavaScript.
   *
   * @param metatype - Метатип, який перевіряється.
   */
  private toValidate(metatype: Function): boolean {
    const primitiveTypes: (
      | StringConstructor
      | BooleanConstructor
      | NumberConstructor
      | ArrayConstructor
      | ObjectConstructor
    )[] = [String, Boolean, Number, Array, Object];
    return !(primitiveTypes as any[]).includes(metatype);
  }

  /**
   * Рекурсивно форматує масив об'єктів ValidationError в більш читабельний формат.
   * Помилки вкладених об'єктів будуть відображені з префіксами (наприклад, "property.title").
   *
   * @param errors - Масив об'єктів ValidationError, отриманих від class-validator.
   * @returns Об'єкт з відформатованими помилками, де ключ - це ім'я поля, а значення - масив повідомлень.
   */
  private formatErrors(errors: ValidationError[]): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    errors.forEach((error) => {
      // Якщо поточний об'єкт помилки має прямі обмеження (constraints), додаємо їх.
      // constraints - це об'єкт, де ключі - це назви валідаторів, а значення - повідомлення.
      if (error.constraints) {
        formattedErrors[error.property] = Object.values(error.constraints);
      }
      // Якщо об'єкт помилки має вкладені помилки (children), рекурсивно викликаємо formatErrors для них.
      if (error.children && error.children.length > 0) {
        const nestedErrors = this.formatErrors(error.children);
        // Додаємо префікс до ключа вкладеної помилки для чіткості (наприклад, "property.title").
        for (const key in nestedErrors) {
          formattedErrors[`${error.property}.${key}`] = nestedErrors[key];
        }
      }
    });
    return formattedErrors;
  }
}
