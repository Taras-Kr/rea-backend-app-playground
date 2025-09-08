import { forwardRef, Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { PropertyImageModule } from '../property-image/property-image.module';

@Module({
  imports: [ConfigModule, forwardRef(() => PropertyImageModule)],
  controllers: [MinioController],
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          endpoint: `${configService.get<string>('MINIO_ENDPOINT')}:${configService.get<string>('MINIO_PORT')}`,
          region: 'us-east-1',
          forcePathStyle: true,
          credentials: {
            accessKeyId: configService.get<string>('MINIO_ACCESS_KEY'),
            secretAccessKey: configService.get<string>('MINIO_SECRET_KEY'),
          },
        });
      },
      inject: [ConfigService],
    },
    MinioService,
  ],
  exports: [MinioService],
})
export class MinioModule {}
