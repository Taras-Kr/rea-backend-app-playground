import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MinioService } from './minio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiProperty } from '@nestjs/swagger';
import { CustomApiResponse } from '../common/dto/api-response.dto';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post(`private-image`)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not provided');
    }
    const objectName = await this.minioService.uploadFile(file);

    // Повертаємо назву об'єкта, щоб потім зберегти її в БД
    return { message: 'Image uploaded successfully', objectName };
  }

  @Post('public-property-image/:gallery_uuid')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPublicPropertyImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('gallery_uuid') gallery_uuid: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is not provided');
    }
    const fileUrl = await this.minioService.uploadPublicFile(
      file,
      gallery_uuid,
    );
    // Повертаємо назву об'єкта, щоб потім зберегти її в БД
    return { message: 'Image uploaded successfully', fileUrl };
  }

  @Get('url/:fileName')
  async getUrl(@Param('fileName') fileName: string): Promise<string> {
    return this.minioService.getPresignedUrl(fileName);
  }

  @ApiProperty({
    name: 'objectName',
    description:
      'Видаляє файл із сховища MinIo. objectName - шлях до файлу у бакеті',
    example:
      '3019296b-f0f8-4358-ad3e-c18262ca1c3d/1756918097360-001_image.webp',
  })
  @Delete(':objectName')
  async deletePublicImage(@Param('objectName') objectName: string) {
    const response = await this.minioService.deletePublicFile(objectName);
    return new CustomApiResponse(response, 'Deleted', HttpStatus.OK);
  }
}
