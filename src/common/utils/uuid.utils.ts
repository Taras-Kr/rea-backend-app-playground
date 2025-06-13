import { validate as validateUUID } from 'uuid';
import { BadRequestException } from '@nestjs/common';

export function validateUUIDFormat(uuid: string, message?: string) {
  if (!validateUUID(uuid)) {
    if (!message) {
      throw new BadRequestException('Incorrect UUID');
    } else {
      throw new BadRequestException(message);
    }
  }
}
