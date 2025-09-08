import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { UpdatePropertyImageDto } from './dto/update-property-image.dto';
import { validateUUIDFormat } from '../common/utils/uuid.utils';

import { PropertyImage } from './entities/property-image.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyService } from '../property/property.service';
import { ImageGalleryService } from '../image-gallery/image-gallery.service';
import { CreateImageGalleryDto } from '../image-gallery/dto/create-image-gallery.dto';
import { Property } from '../property/entities/property.entity';
import { ImageGallery } from '../image-gallery/entities/image-gallery.entity';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class PropertyImageService {
  constructor(
    @InjectRepository(PropertyImage)
    private readonly propertyImageRepository: Repository<PropertyImage>,
    private readonly propertyService: PropertyService,
    private readonly imageGalleryService: ImageGalleryService,
    private readonly minioService: MinioService,
    private readonly dataSource: DataSource,
  ) {}

  private readonly logger = new Logger('PropertyImageService');

  async create(
    property_uuid: string,
    createPropertyImageDto: CreatePropertyImageDto,
  ) {
    validateUUIDFormat(
      property_uuid,
      "Некоректний формат UUID об'єкта нерухомості",
    );
    let existingProperty: Property;
    try {
      existingProperty = await this.propertyService.findOne(property_uuid);
    } catch (error) {
      this.logger.error(`${error.message}: ${property_uuid} `);
      throw new NotFoundException(`Об'єкт нерухомості не знайдено`);
    }

    const existingFileName = await this.propertyImageRepository.findOne({
      where: { file_name: createPropertyImageDto.file_name },
    });
    if (existingFileName) {
      this.logger.error(
        `Файл з таким ім\'ям вже завантажений: ${existingFileName.file_name}`,
      );
      throw new UnprocessableEntityException(
        `Файл з таким ім'ям вже завантажений: ${existingFileName.file_name}`,
      );
    }

    return await this.dataSource.manager.transaction(async (transaction) => {
      let existingGallery: ImageGallery;
      try {
        existingGallery =
          await this.imageGalleryService.findByProperty(property_uuid);
      } catch (error) {
        if (error instanceof NotFoundException) {
          // Нічого не робимо, галереї немає, але це не помилка
          // Виконання коду продовжиться після блоку catch
        } else {
          // Якщо це інша, неочікувана помилка, ми її прокидаємо далі
          throw error;
        }
      }
      if (!existingGallery) {
        const createGallery: CreateImageGalleryDto = {
          property_uuid: property_uuid,
          description: existingProperty.title,
        };

        const imageGalleryRepository = transaction.getRepository(ImageGallery);

        existingGallery = await imageGalleryRepository.save({
          ...createGallery,
          property: existingProperty,
        });

        this.logger.log(
          `Галерею для об'єкта нерухомості ${property_uuid} створено!`,
        );

        const propertyRepository = transaction.getRepository(Property);
        const propertyToUpdate = await propertyRepository.findOne({
          where: { uuid: property_uuid },
        });
        if (propertyToUpdate) {
          propertyToUpdate.gallery = existingGallery;
          await propertyRepository.save(propertyToUpdate);
        }
      }

      const imageRepository = transaction.getRepository(PropertyImage);
      const isPrimaryExist = await imageRepository.exists({
        where: {
          is_primary: true,
          gallery_uuid: existingGallery.uuid,
        },
      });
      if (isPrimaryExist) {
        createPropertyImageDto.is_primary = false;
      }
      const imageToSave = imageRepository.create({
        ...createPropertyImageDto,
        gallery: existingGallery,
      });
      const savedImage = await imageRepository.save(imageToSave);
      return {
        uuid: savedImage.uuid,
        file_name: savedImage.file_name,
        url: savedImage.url,
        gallery_uuid: savedImage.gallery_uuid,
        property_uuid: property_uuid,
        is_primary: savedImage.is_primary,
        position: savedImage.position,
        description: savedImage.description,
        created_at: savedImage.created_at,
        updated_at: savedImage.updated_at,
        deleted_at: savedImage.deleted_at,
      };
    });
  }

  async uploadAndSaveFile(
    property_uuid: string,
    createPropertyImageDto: CreatePropertyImageDto,
    file: Express.Multer.File,
  ) {
    let uploadedFileName: string | null = null;
    try {
      const response = await this.minioService.uploadPublicFile(
        file,
        property_uuid,
      );
      uploadedFileName = response.objectName;
      createPropertyImageDto.file_name = uploadedFileName;
      createPropertyImageDto.url = response.permanentUrl;

      console.log('url', response.permanentUrl);

      return await this.create(property_uuid, createPropertyImageDto);
    } catch (error) {
      this.logger.error(`Сталась помилка завантаження файлу: ${error.message}`);
      if (uploadedFileName) {
        try {
          // Намагаємося видалити файл
          await this.minioService.deletePublicFile(uploadedFileName);
          this.logger.log(`Файл ${uploadedFileName} успішно видалено з MinIO.`);
        } catch (deleteError) {
          // Логуємо помилку видалення, але не зупиняємо виконання
          this.logger.error(
            `Не вдалось видалити файл ${uploadedFileName} з MinIO: ${deleteError.message}`,
          );
        }
      }
      throw error;
    }
  }

  findAll() {
    return this.propertyImageRepository.find();
  }

  async findByPropertyUuid(propertyUuid: string) {
    validateUUIDFormat(propertyUuid);

    await this.propertyService.findOne(propertyUuid);
    try {
      return await this.propertyImageRepository.find({
        where: {
          gallery: {
            property_uuid: propertyUuid,
          },
        },
        order: {
          created_at: 'ASC',
        },
      });
    } catch (error) {
      this.logger.error(
        `Отримання зображень об'єкта нерухомості сталась помилка: ${error}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(uuid: string) {
    validateUUIDFormat(uuid, 'Некоректний UUID зображення');

    const existingImage = await this.propertyImageRepository.findOne({
      where: { uuid: uuid },
    });

    if (!existingImage) {
      this.logger.error(`Зображення ${uuid} не знайдено.`);
      throw new NotFoundException('Зображення не знайдено.');
    }
    return existingImage;
  }

  async update(uuid: string, updatePropertyImageDto: UpdatePropertyImageDto) {
    validateUUIDFormat(uuid);
    if (!updatePropertyImageDto) {
      this.logger.error('Тіло запиту порожнє');
      throw new UnprocessableEntityException('Тіло запиту порожнє');
    }

    await this.dataSource.transaction(async (transactionManager) => {
      const existingImage = await transactionManager.findOne(PropertyImage, {
        where: {
          uuid: uuid,
        },
      });

      if (!existingImage) {
        this.logger.error(`Зображення ${uuid} не знайдено`);
        throw new NotFoundException(`Зображення ${uuid} не знайдено`);
      }

      if (updatePropertyImageDto.is_primary) {
        await transactionManager.update(
          PropertyImage,
          {
            is_primary: true,
            gallery_uuid: existingImage.gallery_uuid,
          },
          { is_primary: false },
        );
      }
      await transactionManager.update(
        PropertyImage,
        { uuid: uuid },
        updatePropertyImageDto,
      );
    });

    return { uuid: uuid };
  }

  async delete(uuid: string) {
    validateUUIDFormat(uuid);
    await this.dataSource.manager.transaction(async (transactionManager) => {
      const existingImage = await transactionManager.findOne(PropertyImage, {
        where: { uuid: uuid },
        relations: ['gallery'],
      });

      if (!existingImage) {
        this.logger.error(`Зображення ${uuid} не знайдено`);
        throw new NotFoundException('Зображення не знайдено.');
      }

      const objectName =
        existingImage.gallery.property_uuid + '/' + existingImage.file_name;

      try {
        await this.minioService.deletePublicFile(objectName);
        await transactionManager.delete(PropertyImage, { uuid });
        const imageCount = await transactionManager.count(PropertyImage, {
          where: {
            gallery_uuid: existingImage.gallery.uuid,
          },
        });

        if (imageCount > 0) {
          if (existingImage.is_primary) {
            const firstRemainingImage = await transactionManager.findOne(
              PropertyImage,
              {
                where: { gallery_uuid: existingImage.gallery.uuid },
                order: { created_at: 'ASC' },
              },
            );
            if (firstRemainingImage) {
              await transactionManager.update(
                PropertyImage,
                { uuid: firstRemainingImage.uuid },
                { is_primary: true },
              );
            }
          }
        } else {
          const property = await transactionManager.findOne(Property, {
            where: {
              uuid: existingImage.gallery.property_uuid,
            },
          });
          if (property) {
            property.gallery_uuid = null;
            property.gallery = null;
            await transactionManager.save(property);
          }
          await transactionManager.delete(ImageGallery, {
            uuid: existingImage.gallery.uuid,
          });
        }
        this.logger.log(
          `Зображення ${uuid} та файл "${objectName}" успішно видалено.`,
        );
      } catch (error) {
        this.logger.error(`Помилка видалення файлу ${uuid}: ${error.message}`);
        throw new InternalServerErrorException(
          'Виникла помилка при видаленні зображення.',
        );
      }
    });
    return {
      uuid: uuid,
    };
  }
}
