import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyType } from './entities/property-type.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { throwUnprocessable } from '../../common/exceptions/error-handler';
import { validateUUIDFormat } from '../../common/utils/uuid.utils';
import { PropertyCategoryService } from '../property-category/property-category.service';

@Injectable()
export class PropertyTypeService {
  constructor(
    @InjectRepository(PropertyType)
    private readonly propertyTypeRepository: Repository<PropertyType>,
    private readonly propertyCategoryService: PropertyCategoryService,
  ) {}

  async create(createPropertyTypeDto: CreatePropertyTypeDto) {
    const existingPropertyType = await this.propertyTypeRepository.findOne({
      where: { name: createPropertyTypeDto.name },
    });
    if (existingPropertyType) {
      throwUnprocessable(
        'Тип нерухомості з такою назвою вже існує',
        'active_exists',
      );
    }
    const existingDeletedPropertyTpe =
      await this.propertyTypeRepository.findOne({
        withDeleted: true,
        where: {
          name: createPropertyTypeDto.name,
          deleted_at: Not(IsNull()),
        },
      });
    if (existingDeletedPropertyTpe) {
      throwUnprocessable(
        'Тип нерухомості з такою назвою вже існує',
        'deleted_exists',
      );
    }
    validateUUIDFormat(createPropertyTypeDto.category_uuid);
    try {
      // const existingPropertyCategory =
      await this.propertyCategoryService.findOne(
        createPropertyTypeDto.category_uuid,
      );
    } catch (error: any) {
      throwUnprocessable('Категорія з таким UUID не існує');
    }

    try {
      const propertyType = new PropertyType();
      propertyType.name = createPropertyTypeDto.name;
      propertyType.description = createPropertyTypeDto.description;
      propertyType.category_uuid = createPropertyTypeDto.category_uuid;
      return this.propertyTypeRepository.save(propertyType);
    } catch (error: any) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  findAll() {
    return this.propertyTypeRepository.find({
      relations: ['category'],
      select: {
        category: {
          name: true,
        },
      },
    });
  }

  async findOne(uuid: string) {
    validateUUIDFormat(uuid);
    const existingPropertyType = await this.propertyTypeRepository.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (!existingPropertyType) {
      throw new NotFoundException("Тип Об'єкту нерухомості не знайдено");
    }
    return existingPropertyType;
  }

  async update(uuid: string, updatePropertyTypeDto: UpdatePropertyTypeDto) {
    validateUUIDFormat(uuid);
    const existingPropertyType = await this.propertyTypeRepository.findOne({
      where: { uuid: uuid },
    });
    if (!existingPropertyType) {
      throw new NotFoundException('Запис не знайдено');
    }

    const duplicatePropertyType = await this.propertyTypeRepository.find({
      withDeleted: true,
      where: {
        name: ILike(updatePropertyTypeDto.name),
        uuid: Not(uuid),
      },
    });
    if (duplicatePropertyType.length !== 0) {
      throwUnprocessable(
        `Тип з такою назвою \'${updatePropertyTypeDto.name}\' вже існує серед активних/видалених записів!`,
      );
    }

    try {
      validateUUIDFormat(uuid);
    } catch (error) {
      throwUnprocessable('Невірний формат UUID для категорії');
    }

    try {
      await this.propertyCategoryService.findOne(
        updatePropertyTypeDto.category_uuid,
      );
    } catch (error) {
      throwUnprocessable('Категорії з таким ідентифікатором не знайдено');
    }
    const propertyType = new PropertyType();
    propertyType.name = updatePropertyTypeDto.name;
    propertyType.description = updatePropertyTypeDto.description;
    propertyType.category_uuid = updatePropertyTypeDto.category_uuid;
    await this.propertyTypeRepository.update(uuid, propertyType);
    return { uuid: uuid };
  }

  async softDelete(uuid: string) {
    validateUUIDFormat(uuid);
    const existingPropertyType = await this.propertyTypeRepository.findOne({
      where: { uuid: uuid },
    });
    if (!existingPropertyType) {
      throwUnprocessable('Запис не знайдено');
    }
    try {
      await this.propertyTypeRepository.softDelete(uuid);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
    return {
      uuid: uuid,
    };
  }

  async findDeletedAll() {
    return this.propertyTypeRepository.find({
      withDeleted: true,
      where: {
        deleted_at: Not(IsNull()),
      },
      relations: ['category'],
      select: {
        uuid: true,
        name: true,
        slug: true,
        description: true,
        category_uuid: true,
        category: {
          name: true,
        },
        created_at: true,
        updated_at: true,
        deleted_at: true,
      },
    });
  }

  async restore(uuid: string) {
    validateUUIDFormat(uuid);
    const existingPropertyType = await this.propertyTypeRepository.findOne({
      withDeleted: true,
      where: {
        uuid: uuid,
      },
    });
    if (!existingPropertyType) {
      throw new NotFoundException('Deleted item not found');
    }
    const existingUndeletedItem = await this.propertyTypeRepository.findOne({
      where: {
        name: existingPropertyType.name,
        uuid: Not(uuid),
      },
    });
    if (existingUndeletedItem) {
      throwUnprocessable(
        'Тип нерухомості з такою назвою вже існує',
        'active_exists',
      );
    }
    await this.propertyTypeRepository.restore(uuid);
    return { uuid: uuid };
  }
}
