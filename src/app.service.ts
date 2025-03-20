import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello() {
    return {
      message: 'Hello World!',
      host: process.env.DB_HOST,
      db_port: process.env.DB_PORT,
      db_username: process.env.DB_USERNAME,
      db_password: process.env.DB_PASSWORD,
      db_name: process.env.DB_NAME,
      configService_host: this.configService.get('DB_HOST'),
      configService_db_port: this.configService.get('DB_PORT'),
      configService_username: this.configService.get('DB_USERNAME'),
      configService_password: this.configService.get('DB_PASWORD'),
      configService_db_name: this.configService.get('DB_NAME'),
    };
  }
}
