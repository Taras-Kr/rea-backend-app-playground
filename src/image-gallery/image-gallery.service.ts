import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateImageGalleryDto } from './dto/create-image-gallery.dto';
import { UpdateImageGalleryDto } from './dto/update-image-gallery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageGallery } from './entities/image-gallery.entity';
import { PropertyService } from '../property/property.service';
import { Repository } from 'typeorm';
import { validateUUIDFormat } from '../common/utils/uuid.utils';

@Injectable()
export class ImageGalleryService {
  private readonly logger = new Logger(ImageGalleryService.name);

  constructor(
    @InjectRepository(ImageGallery)
    private readonly imageGalleryRepository: Repository<ImageGallery>,
    @Inject(forwardRef(() => PropertyService))
    private readonly propertyService: PropertyService,
  ) {}

  async create(createImageGalleryDto: CreateImageGalleryDto) {
    const existingProperty = await this.propertyService.findOne(
      createImageGalleryDto.property_uuid,
    );

    if (!existingProperty) {
      this.logger.error(
        `Об'єкт нерухомості  ${createImageGalleryDto.property_uuid} не знайдено`,
      );
      throw new NotFoundException("Об'єкт нерухомості не знайдено");
    }

    const existingImageGallery = await this.imageGalleryRepository.findOne({
      where: { property_uuid: createImageGalleryDto.property_uuid },
    });
    if (existingImageGallery) {
      this.logger.error(
        `Галерея для об'єкта нерухомості ${createImageGalleryDto.property_uuid} вже існує`,
      );
      throw new UnprocessableEntityException(
        "Галерея для об'єкта нерухомості вже існує",
      );
    }

    const imageGallery = this.imageGalleryRepository.create({
      ...createImageGalleryDto,
      property: existingProperty,
    });
    try {
      const savedGallery = await this.imageGalleryRepository.save(imageGallery);
      return {
        uuid: savedGallery.uuid,
        property_uuid: savedGallery.property_uuid,
        description: savedGallery.description,
        propertyImages: savedGallery.propertyImages,
        created_at: savedGallery.created_at,
        updated_at: savedGallery.updated_at,
        deleted_at: savedGallery.deleted_at,
      };
    } catch (error) {
      this.logger.error(`Сталась помилка: ${error.message}`);
      throw new InternalServerErrorException('Не вдалось створити галерею ');
    }
  }

  async findByProperty(property_uuid: string) {
    validateUUIDFormat(
      property_uuid,
      "Некорекнтний формат UUID об'єкта нерухомості",
    );

    try {
      await this.propertyService.findOne(property_uuid);
    } catch {
      this.logger.error(`Об'єкт нерухомості ${property_uuid} не знайдено`);
      throw new NotFoundException("Об'єкт нерухомості не знайдено");
    }

    const existingImageGallery = await this.imageGalleryRepository.findOne({
      where: { property_uuid: property_uuid },
    });
    if (!existingImageGallery) {
      this.logger.error(
        `Галерея для об\'єкта нерухомості ${property_uuid} не знайдена`,
      );
      throw new NotFoundException("Галерея об'єкта нерухомості не знайдено");
    }
    return existingImageGallery;
  }

  findAll() {
    return `This action returns all imageGallery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageGallery`;
  }

  update(id: number, updateImageGalleryDto: UpdateImageGalleryDto) {
    return `This action updates a #${id} imageGallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageGallery`;
  }
}
