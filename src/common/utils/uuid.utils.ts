import { validate as validateUUID } from 'uuid';
import { BadRequestException, Logger } from '@nestjs/common';

export function validateUUIDFormat(uuid: string, message?: string) {
  const logger = new Logger('UUIDValidator');
  if (!validateUUID(uuid)) {
    if (!message) {
      logger.error(`Incorrect UUID ${uuid}`);
      throw new BadRequestException('Incorrect UUID');
    } else {
      logger.error(`${message}: ${uuid}`);
      throw new BadRequestException(`${message}: ${uuid}`);
    }
  }
}
