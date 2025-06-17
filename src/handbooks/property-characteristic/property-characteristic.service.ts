import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyCharacteristicDto } from './dto/create-property-characteristic.dto';
import { UpdatePropertyCharacteristicDto } from './dto/update-property-characteristic.dto';
import {
  PropertyCharacteristic,
  PropertyCharacteristicsType,
} from './entities/property-characteristic.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { throwUnprocessable } from '../../common/exceptions/error-handler';
import { validateUUIDFormat } from '../../common/utils/uuid.utils';

@Injectable()
export class PropertyCharacteristicService {
  constructor(
    @InjectRepository(PropertyCharacteristic)
    private readonly propertyCharacteristicRepository: Repository<PropertyCharacteristic>,
  ) {}

  async create(
    createPropertyCharacteristicDto: CreatePropertyCharacteristicDto,
  ) {
    const existingItem = await this.propertyCharacteristicRepository.findOne({
      where: {
        name: createPropertyCharacteristicDto.name,
      },
    });

    if (existingItem) {
      throwUnprocessable('Характеристика з такою назвою вже існує');
    }

    const existingDeletedItem =
      await this.propertyCharacteristicRepository.findOne({
        withDeleted: true,
        where: {
          name: createPropertyCharacteristicDto.name,
          deleted_at: Not(IsNull()),
        },
      });

    if (existingDeletedItem) {
      throwUnprocessable(
        "Характеристика з таким ім'ям серед видалених",
        'deleted_exist',
      );
    }

    if (
      createPropertyCharacteristicDto.type !==
        PropertyCharacteristicsType.SELECT &&
      createPropertyCharacteristicDto.is_multiple === true
    ) {
      throwUnprocessable(
        `'is_multiple=true' доступно лише для типу ${PropertyCharacteristicsType.SELECT}`,
      );
    }

    try {
      return this.propertyCharacteristicRepository.save(
        createPropertyCharacteristicDto,
      );
    } catch (error) {
      throwUnprocessable(error.message, 'creating_error');
    }
  }

  findAll() {
    return this.propertyCharacteristicRepository.find();
  }

  async findOne(uuid: string) {
    validateUUIDFormat(uuid);
    const existingItem = await this.propertyCharacteristicRepository.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (!existingItem) {
      throw new NotFoundException(
        "Характеристику об'єкту нерухомості не знайдено",
      );
    }
    return existingItem;
  }

  async update(
    uuid: string,
    updatePropertyCharacteristicDto: UpdatePropertyCharacteristicDto,
  ) {
    validateUUIDFormat(uuid);
    const existingItem = await this.propertyCharacteristicRepository.findOne({
      where: { uuid: uuid },
    });
    if (!existingItem) {
      throw new NotFoundException('Запис не знайдено');
    }
    const duplicatedItem = await this.propertyCharacteristicRepository.findOne({
      withDeleted: true,
      where: {
        name: updatePropertyCharacteristicDto.name,
        uuid: Not(uuid),
      },
    });
    if (duplicatedItem) {
      throwUnprocessable(
        'Характеристика з такою назвою вже існує серед активних або видалених записів',
      );
    }
    //Додати перевірку на is_several = true і type = 3
    if (
      existingItem.type !== PropertyCharacteristicsType.SELECT &&
      updatePropertyCharacteristicDto.is_multiple === true
    ) {
      throwUnprocessable(
        `'is_multiple=true' доступно лише для типу ${PropertyCharacteristicsType.SELECT}`,
      );
    }

    await this.propertyCharacteristicRepository.update(
      uuid,
      updatePropertyCharacteristicDto,
    );
    return { uuid: uuid };
  }

  async softDelete(uuid: string) {
    validateUUIDFormat(uuid);
    const existingItem = await this.propertyCharacteristicRepository.findOne({
      where: { uuid: uuid },
    });
    if (!existingItem) {
      throw new NotFoundException('Запис не знайдено');
    }
    await this.propertyCharacteristicRepository.softDelete(uuid);
    return {
      uuid: uuid,
    };
  }

  findDeletedAll() {
    return this.propertyCharacteristicRepository.find({
      withDeleted: true,
      where: {
        deleted_at: Not(IsNull()),
      },
      select: [
        'uuid',
        'name',
        'type',
        'description',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
    });
  }

  async restore(uuid: string) {
    validateUUIDFormat(uuid);
    const existingItem = await this.propertyCharacteristicRepository.findOne({
      withDeleted: true,
      where: {
        uuid: uuid,
      },
    });
    if (!existingItem) {
      throw new NotFoundException('Deleted item not found');
    }

    await this.propertyCharacteristicRepository.restore(uuid);
    return {
      uuid: uuid,
    };
  }
}
