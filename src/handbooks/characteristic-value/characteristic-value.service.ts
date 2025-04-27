import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCharacteristicValueDto } from './dto/create-characteristic-value.dto';
import { UpdateCharacteristicValueDto } from './dto/update-characteristic-value.dto';
import { throwUnprocessable } from '../../common/exceptions/error-handler';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacteristicValue } from './entities/characteristic-value.entity';
import { Not, Repository } from 'typeorm';
import { validateUUIDFormat } from '../../common/utils/uuid.utils';
import { PropertyCharacteristic } from '../property-characteristic/entities/property-characteristic.entity';

@Injectable()
export class CharacteristicValueService {
  constructor(
    @InjectRepository(CharacteristicValue)
    private readonly characteristicValueRepository: Repository<CharacteristicValue>,
    @InjectRepository(PropertyCharacteristic)
    private readonly propertyCharacteristicRepository: Repository<PropertyCharacteristic>,
  ) {}

  async existingValueByUUID(
    property_characteristic_uuid: string,
    value_uuid: string,
  ) {
    const existingItems = await this.characteristicValueRepository.findOne({
      where: {
        property_characteristic_uuid: property_characteristic_uuid,
        uuid: value_uuid,
      },
    });
    if (!existingItems) {
      throwUnprocessable('Значення для характеристики не існує');
    } else {
      return existingItems;
    }
  }

  async existingValueByValue(
    property_characteristic_uuid: string,
    value: string,
  ) {
    const existingItems = await this.characteristicValueRepository.findOne({
      where: {
        property_characteristic_uuid: property_characteristic_uuid,
        value: value,
      },
    });
    if (existingItems) {
      throwUnprocessable('Значення для характеристики вже існує');
    } else {
      return existingItems;
    }
  }

  async existingPropertyCharacteristic(uuid: string) {
    const existingCharacteristic =
      await this.propertyCharacteristicRepository.findOne({
        where: {
          uuid: uuid,
        },
      });
    if (!existingCharacteristic) {
      throw new NotFoundException('Характеристика не існує або видалена');
    } else {
      return existingCharacteristic;
    }
  }

  //POST /handbooks/property-characteristics/:property_characteristic_uuid/values
  async createCharacteristicValue(
    uuid: string,
    createCharacteristicValueDto: CreateCharacteristicValueDto,
  ) {
    validateUUIDFormat(uuid);
    await this.existingPropertyCharacteristic(uuid);
    await this.existingValueByValue(uuid, createCharacteristicValueDto.value);
    try {
      const propertyCharacteristicValue =
        this.characteristicValueRepository.create(createCharacteristicValueDto);
      propertyCharacteristicValue.property_characteristic_uuid = uuid;
      return this.characteristicValueRepository.save(
        propertyCharacteristicValue,
      );
    } catch (error) {
      throwUnprocessable(error.message, 'creating_error');
    }
  }

  //GET /handbooks/property-characteristics/:property_characteristic_uuid/values
  async findAll(uuid: string) {
    validateUUIDFormat(uuid);
    await this.existingPropertyCharacteristic(uuid);

    return this.characteristicValueRepository.find({
      where: {
        property_characteristic_uuid: uuid,
      },
      //ПОКИ ЩО ВИВОДИМО БЕЗ ОБ'ЄКТА ХАРАКТЕРИСТИКИ НЕРУХОМОСТІ. ПРИ ПОТРЕБІ БУДЕМО ВИВОДИТИ ТЕ ЩО НЕОБХІДНО.
      // relations: ['characteristic'],
      // select: {
      //   characteristic: {
      //     name: true,
      //   },
      //},
    });
  }

  async findOne(property_characteristic_uuid: string, value_uuid: string) {
    try {
      validateUUIDFormat(property_characteristic_uuid);
    } catch (error: any) {
      throw new BadRequestException(
        "'property_characteristic_uuid' - " + error.message,
      );
    }
    try {
      validateUUIDFormat(value_uuid);
    } catch (error: any) {
      throw new BadRequestException("'value_uuid' - " + error.message);
    }
    await this.existingPropertyCharacteristic(property_characteristic_uuid);
    return this.existingValueByUUID(property_characteristic_uuid, value_uuid);
  }

  async update(
    property_characteristic_uuid: string,
    value_uuid: string,
    updateCharacteristicValueDto: UpdateCharacteristicValueDto,
  ) {
    try {
      validateUUIDFormat(property_characteristic_uuid);
    } catch (error: any) {
      throw new BadRequestException(
        "'property_characteristic_uuid' - " + error.message,
      );
    }
    try {
      validateUUIDFormat(value_uuid);
    } catch (error: any) {
      throw new BadRequestException("'value_uuid' - " + error.message);
    }

    await this.existingPropertyCharacteristic(property_characteristic_uuid);
    await this.existingValueByUUID(property_characteristic_uuid, value_uuid);
    const existingItems = await this.characteristicValueRepository.findOne({
      where: {
        property_characteristic_uuid: property_characteristic_uuid,
        value: updateCharacteristicValueDto.value,
        uuid: Not(value_uuid),
      },
    });
    if (existingItems) {
      throwUnprocessable('Значення для характеристики вже існує');
    }
    await this.characteristicValueRepository.update(
      { property_characteristic_uuid, uuid: value_uuid },
      updateCharacteristicValueDto,
    );
    return {
      uuid: value_uuid,
    };
  }

  async remove(property_characteristic_uuid: string, value_uuid: string) {
    try {
      validateUUIDFormat(property_characteristic_uuid);
    } catch (error: any) {
      throw new BadRequestException(
        "'property_characteristic_uuid' - " + error.message,
      );
    }
    try {
      validateUUIDFormat(value_uuid);
    } catch (error: any) {
      throw new BadRequestException("'value_uuid' - " + error.message);
    }
    await this.existingPropertyCharacteristic(property_characteristic_uuid);
    const itemToDelete = await this.existingValueByUUID(
      property_characteristic_uuid,
      value_uuid,
    );
    await this.characteristicValueRepository.remove(itemToDelete);
    return {
      property_characteristic_uuid: property_characteristic_uuid,
      value_uuid: value_uuid,
    };
  }
}
