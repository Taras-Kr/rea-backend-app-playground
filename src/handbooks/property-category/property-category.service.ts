import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePropertyCategoryDto } from './dto/create-property-category.dto';
import { UpdatePropertyCategoryDto } from './dto/update-property-category.dto';
import { IsNull, Not, Repository } from 'typeorm';
import { PropertyCategory } from './entities/property-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { throwUnprocessable } from 'src/common/exceptions/error-handler';
import { validateUUIDFormat } from '../../common/utils/uuid.utils';

@Injectable()
export class PropertyCategoryService {
  constructor(
    @InjectRepository(PropertyCategory)
    private readonly propertyCategoryRepository: Repository<PropertyCategory>,
  ) {}

  async create(createPropertyCategoryDto: CreatePropertyCategoryDto) {
    if (!createPropertyCategoryDto) {
      throw new BadRequestException();
    }
    const existingPropertyCategory =
      await this.propertyCategoryRepository.findOne({
        where: { name: createPropertyCategoryDto.name },
      });
    if (existingPropertyCategory) {
      throwUnprocessable('Така категорія вже існує', 'active_exists');
    }
    const existingDeletedPropertyCategory =
      await this.propertyCategoryRepository.findOne({
        withDeleted: true,
        where: {
          name: createPropertyCategoryDto.name,
          deletedAt: Not(IsNull()),
        },
      });
    if (existingDeletedPropertyCategory) {
      throwUnprocessable(
        'Категорія існує серед видалених записів',
        'deleted_exists',
      );
    }
    try {
      const propertyCategory = new PropertyCategory();
      propertyCategory.name = createPropertyCategoryDto.name;
      return this.propertyCategoryRepository.save(propertyCategory);
    } catch (error: any) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  findAll() {
    return this.propertyCategoryRepository.find();
  }

  async findOne(uuid: string) {
    validateUUIDFormat(uuid);
    const existingPropertyCategory =
      await this.propertyCategoryRepository.findOne({
        where: { uuid: uuid },
      });
    if (!existingPropertyCategory) {
      throw new NotFoundException('Запис не знайдено');
    }
    return existingPropertyCategory;
  }

  async update(
    uuid: string,
    updatePropertyCategoryDto: UpdatePropertyCategoryDto,
  ) {
    validateUUIDFormat(uuid);
    if (!updatePropertyCategoryDto) {
      throw new BadRequestException();
    }
    const existingPropertyCategory =
      await this.propertyCategoryRepository.findOne({
        where: { uuid: uuid },
      });
    if (!existingPropertyCategory) {
      throw new NotFoundException('Запис не знайдено');
    }

    const duplicatedPropertyCategory =
      await this.propertyCategoryRepository.findOne({
        withDeleted: true,
        where: {
          name: updatePropertyCategoryDto.name,
          uuid: Not(uuid),
        },
      });

    if (duplicatedPropertyCategory) {
      throwUnprocessable(
        'Категорія з такою назвою вже існує серед активний або видалених записів',
      );
    }

    const propertyCategory = this.propertyCategoryRepository.create({
      name: updatePropertyCategoryDto.name,
    });
    await this.propertyCategoryRepository.update(uuid, propertyCategory);
    return { uuid: uuid };
  }

  async softDelete(uuid: string) {
    validateUUIDFormat(uuid);
    const existingPropertyCategory =
      await this.propertyCategoryRepository.findOne({
        where: { uuid: uuid },
      });
    if (!existingPropertyCategory) {
      throw new NotFoundException('Запис не знайдено');
    }
    await this.propertyCategoryRepository.softDelete(uuid);
    return {
      uuid: uuid,
    };
  }

  async findDeletedAll() {
    return await this.propertyCategoryRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
      },
      select: ['uuid', 'name', 'slug', 'createdAt', 'updatedAt', 'deletedAt'],
    });
  }

  async restore(uuid: string) {
    validateUUIDFormat(uuid);
    const existingPropertyCategory =
      await this.propertyCategoryRepository.findOne({
        withDeleted: true,
        where: { uuid: uuid },
      });
    if (!existingPropertyCategory) {
      throw new NotFoundException('Deleted item not found');
    }
    const existingUndeletedPropertyCategory =
      await this.propertyCategoryRepository.findOne({
        where: { name: existingPropertyCategory.name },
      });
    if (existingUndeletedPropertyCategory) {
      throw new UnprocessableEntityException('Запис з такою назвою вже існує');
    }
    await this.propertyCategoryRepository.restore(uuid);
    return {
      uuid: uuid,
    };
  }
}
