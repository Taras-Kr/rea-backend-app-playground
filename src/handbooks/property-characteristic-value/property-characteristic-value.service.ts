import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePropertyCharacteristicValueDto } from './dto/create-property-characteristic-value.dto';
import { UpdatePropertyCharacteristicValueDto } from './dto/update-property-characteristic-value.dto';
import { PropertyCharacteristicValue } from './entities/property-characteristic-value.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyService } from '../../property/property.service';
import { PropertyCharacteristicService } from '../property-characteristic/property-characteristic.service';
import { PropertyCharacteristicsType } from '../property-characteristic/entities/property-characteristic.entity';
import { CharacteristicValueService } from '../characteristic-value/characteristic-value.service';
import { validateUUIDFormat } from '../../common/utils/uuid.utils';

@Injectable()
export class PropertyCharacteristicValueService {
  constructor(
    @InjectRepository(PropertyCharacteristicValue)
    private readonly propertyCharacteristicValueRepository: Repository<PropertyCharacteristicValue>,
    private readonly propertyService: PropertyService,
    private readonly propertyCharacteristicService: PropertyCharacteristicService,
    private readonly characteristicValueService: CharacteristicValueService,
  ) {}

  async create(
    createPropertyCharacteristicValueDto: CreatePropertyCharacteristicValueDto,
  ) {
    const existingProperty = await this.propertyService.findOne(
      createPropertyCharacteristicValueDto.property_uuid,
    );

    const existingCharacteristic =
      await this.propertyCharacteristicService.findOne(
        createPropertyCharacteristicValueDto.property_characteristic_uuid,
      );

    const duplicateCharacteristicValue =
      await this.propertyCharacteristicValueRepository.findOne({
        withDeleted: true,
        where: {
          property: { uuid: existingProperty.uuid },
          property_characteristic: { uuid: existingCharacteristic.uuid },
        },
      });

    if (duplicateCharacteristicValue) {
      throw new UnprocessableEntityException(
        `Значення характеристики ${existingCharacteristic.name} для об\'єкта нерухомості вже внесено`,
      );
    }

    const newPropertyCharacteristicValue =
      this.propertyCharacteristicValueRepository.create(
        createPropertyCharacteristicValueDto,
      );

    const inputValue = createPropertyCharacteristicValueDto.value;
    const propertyCharacteristicType = existingCharacteristic.type;
    const isMultiple = existingCharacteristic.is_multiple;
    switch (propertyCharacteristicType) {
      case PropertyCharacteristicsType.NUMBER:
        if (typeof inputValue !== 'number') {
          throw new UnprocessableEntityException(
            'Значення характеристики цього типу повинно бути числом',
          );
        }
        break;
      case PropertyCharacteristicsType.STRING:
        if (typeof inputValue !== 'string') {
          throw new UnprocessableEntityException(
            'Значення характеристики цього типу повинно бути текстом',
          );
        }
        break;
      case PropertyCharacteristicsType.SWITCH:
        if (typeof inputValue !== 'boolean') {
          throw new UnprocessableEntityException(
            'Значення характеристики цього типу повинно бути boolean (так/ні)',
          );
        }
        break;

      case PropertyCharacteristicsType.SELECT:
        const characteristicValue =
          await this.characteristicValueService.findAll(
            existingCharacteristic.uuid,
          );
        const allowedTextValues = characteristicValue.map((v) =>
          v.value.toLowerCase(),
        );

        if (isMultiple) {
          if (
            !Array.isArray(inputValue) ||
            !inputValue.every((v) => typeof v === 'string')
          ) {
            throw new UnprocessableEntityException(
              'Значення характеристики цього типу повинно бути масивом текстових значень',
            );
          }

          const allInputValuesAreAllowed = inputValue.every((inputValue) =>
            allowedTextValues.includes(inputValue.toLowerCase()),
          );

          if (!allInputValuesAreAllowed) {
            // Збираємо всі значення, які не знайшлися в дозволених
            const disallowedValues = inputValue.filter(
              (inputVal) => !allowedTextValues.includes(inputVal.toLowerCase()),
            );
            throw new UnprocessableEntityException(
              `Одне або кілька значень: [${disallowedValues.map((v) => `'${v}'`).join(', ')}] не знайдено у довіднику для характеристики '${existingCharacteristic.name}'.`,
            );
          }
        } else {
          if (typeof inputValue !== 'string') {
            throw new UnprocessableEntityException(
              'Значення характеристики цього типу повинно бути текстовим значенням',
            );
          }
          const allowedInputValue = allowedTextValues.includes(
            inputValue.toLowerCase(),
          );
          if (!allowedInputValue) {
            throw new UnprocessableEntityException(
              ` ${inputValue} не знайдено у довіднику для характеристики '${existingCharacteristic.name}'.`,
            );
          }
        }

        break;
    }

    newPropertyCharacteristicValue.property = existingProperty;
    newPropertyCharacteristicValue.property_characteristic =
      existingCharacteristic;
    newPropertyCharacteristicValue.value =
      createPropertyCharacteristicValueDto.value;

    return this.propertyCharacteristicValueRepository.save(
      newPropertyCharacteristicValue,
    );
  }

  findAll() {
    return this.propertyCharacteristicValueRepository.find({
      relations: ['property', 'property_characteristic'],
    });
  }

  async findOne(uuid: string) {
    validateUUIDFormat(
      uuid,
      "Некоректний UUID значення характеристики об'єкта нерухомості",
    );

    const existingCharacteristicValue =
      await this.propertyCharacteristicValueRepository.findOne({
        where: {
          uuid: uuid,
        },
        relations: ['property', 'property_characteristic'],
        select: {
          uuid: true,
          value: true,
          property: {
            uuid: true,
            title: true,
          },
          property_characteristic: {
            uuid: true,
            name: true,
            type: true,
            is_multiple: true,
            description: true,
          },
          created_at: true,
          updated_at: true,
        },
      });

    if (!existingCharacteristicValue) {
      throw new NotFoundException(
        "Значення характеристики об'єкта нерухомості не знайдено",
      );
    }
    return existingCharacteristicValue;
  }

  async update(
    uuid: string,
    updatePropertyCharacteristicValueDto: UpdatePropertyCharacteristicValueDto,
  ) {
    validateUUIDFormat(
      uuid,
      "Некоректний UUID значення характеристики об'єкта нерухомості",
    );

    const existingCharacteristicValue =
      await this.propertyCharacteristicValueRepository.findOne({
        where: {
          uuid: uuid,
        },
        relations: ['property_characteristic'],
      });

    if (!existingCharacteristicValue) {
      throw new NotFoundException(
        "Значення характеристики об'єкта нерухомості не знайдено",
      );
    }

    const propertyCharacteristicType =
      existingCharacteristicValue.property_characteristic.type;
    const isMultiple =
      existingCharacteristicValue.property_characteristic.is_multiple;
    const inputValue = updatePropertyCharacteristicValueDto.value;

    switch (propertyCharacteristicType) {
      case PropertyCharacteristicsType.NUMBER:
        if (typeof inputValue !== 'number') {
          throw new UnprocessableEntityException(
            'Значення характеристики цього типу повинно бути числом',
          );
        }
        break;

      case PropertyCharacteristicsType.STRING:
        if (typeof inputValue !== 'string') {
          throw new UnprocessableEntityException(
            'Значення характеристики цього типу повинно бути текстовим значенням',
          );
        }
        break;

      case PropertyCharacteristicsType.SWITCH:
        if (typeof inputValue !== 'boolean') {
          throw new UnprocessableEntityException(
            'Значення характеристики цього типу повинно бути boolean (так/ні)',
          );
        }
        break;

      case PropertyCharacteristicsType.SELECT:
        const characteristicValues =
          await this.characteristicValueService.findAll(
            existingCharacteristicValue.property_characteristic.uuid,
          );
        const allowedValues = characteristicValues.map((allowedVal) =>
          allowedVal.value.toLowerCase(),
        );

        if (!isMultiple) {
          if (typeof inputValue !== 'string') {
            throw new UnprocessableEntityException(
              'Значення характеристики цього типу повинно бути текстовим значенням',
            );
          }
          const allowedInputValue = allowedValues.includes(
            inputValue.toLowerCase(),
          );
          if (!allowedInputValue) {
            throw new UnprocessableEntityException(
              ` ${inputValue} не знайдено у довіднику для характеристики '${existingCharacteristicValue.property_characteristic.name}'.`,
            );
          }
        }
        if (isMultiple) {
          if (
            !Array.isArray(inputValue) ||
            !inputValue.every((inputVal) => typeof inputVal === 'string')
          ) {
            throw new UnprocessableEntityException(
              'Значення характеристики цього типу повинно бути масивом текстових значень',
            );
          }

          const allInputValuesAreAllowed = inputValue.every((inputVal) =>
            allowedValues.includes(inputVal.toLowerCase()),
          );

          if (!allInputValuesAreAllowed) {
            const disallowedValues = inputValue.filter(
              (inputVal) => !allowedValues.includes(inputVal.toLowerCase()),
            );
            throw new UnprocessableEntityException(
              `Одне або кілька значень: [${disallowedValues.map((v) => `'${v}'`).join(', ')}] не знайдено у довіднику для характеристики '${existingCharacteristicValue.property_characteristic.name}'.`,
            );
          }
        }
    }
    existingCharacteristicValue.value = inputValue;

    await this.propertyCharacteristicValueRepository.save(
      existingCharacteristicValue,
    );
    return existingCharacteristicValue;
  }

  async remove(uuid: string) {
    validateUUIDFormat(
      uuid,
      "Некоректний UUID значення характеристики об'єкта нерухомості",
    );

    const existingCharacteristicValue =
      await this.propertyCharacteristicValueRepository.findOne({
        where: {
          uuid: uuid,
        },
      });
    if (!existingCharacteristicValue) {
      throw new NotFoundException(
        "Значення характеристики об'єкта нерухомості не знайдено",
      );
    }

    await this.propertyCharacteristicValueRepository.delete(uuid);
    return { uuid: uuid };
  }
}
