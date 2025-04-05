import { validate as validateUUID } from 'uuid';
import { BadRequestException } from '@nestjs/common';

export function validateUUIDFormat(uuid: string) {
  if (!validateUUID(uuid)) {
    throw new BadRequestException('Incorrect UUID');
  }
}
