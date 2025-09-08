import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { validateUUIDFormat } from '../common/utils/uuid.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyImage } from '../property-image/entities/property-image.entity';

@Injectable()
export class MinioService {
  private readonly bucketName = 'property-images';
  private readonly publicBucket = 'public-property-images';
  private readonly logger = new Logger(MinioService.name);

  constructor(
    @InjectRepository(PropertyImage)
    private readonly propertyImageRepository: Repository<PropertyImage>,
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const objectName = `${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: objectName,
      Body: file.buffer,
    });
    await this.s3Client.send(command);
    return objectName;
  }

  async uploadPublicFile(file: Express.Multer.File, galleryUuid: string) {
    const objectName = `${Date.now()}-${file.originalname}`;
    const objectDirName = `${galleryUuid}/${objectName}`;
    const command = new PutObjectCommand({
      Bucket: this.publicBucket,
      Key: objectDirName,
      Body: file.buffer,
    });
    await this.s3Client.send(command);
    const permanentUrl = `${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.publicBucket}/${objectDirName}`;
    return { objectName, permanentUrl };
  }

  async getPresignedUrl(objectName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.publicBucket,
      Key: objectName,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async deleteFile(objectName: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: objectName,
    });
    await this.s3Client.send(command);
  }

  async deletePublicFile(objectName: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.publicBucket,
      Key: objectName,
    });
    await this.s3Client.send(command);
  }
}
