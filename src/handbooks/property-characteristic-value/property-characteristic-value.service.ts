import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePropertyCharacteristicValueDto } from './dto/create-property-characteristic-value.dto';
import { UpdatePropertyCharacteristicValueDto } from './dto/update-property-characteristic-value.dto';
import { PropertyCharacteristicValue } from './entities/property-characteristic-value.entity';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyService } from '../../property/property.service';
import { PropertyCharacteristicService } from '../property-characteristic/property-characteristic.service';
import {
  PropertyCharacteristic,
  PropertyCharacteristicsType,
} from '../property-characteristic/entities/property-characteristic.entity';
import { CharacteristicValueService } from '../characteristic-value/characteristic-value.service';
import { validateUUIDFormat } from '../../common/utils/uuid.utils';
import { CharacteristicValue } from '../characteristic-value/entities/characteristic-value.entity';
import { CreatePropertyCharacteristicsBatchDto } from './dto/create-property-characteristics-batch.dto';

@Injectable()
export class PropertyCharacteristicValueService {
  private readonly logger = new Logger(PropertyCharacteristicService.name);

  constructor(
    @InjectRepository(PropertyCharacteristicValue)
    private readonly propertyCharacteristicValueRepository: Repository<PropertyCharacteristicValue>,
    private readonly propertyService: PropertyService,
    private readonly propertyCharacteristicService: PropertyCharacteristicService,
    private readonly characteristicValueService: CharacteristicValueService,
    private readonly dataSource: DataSource,
  ) {}

  // Транзакція для пакетного зберігання значень характеристик нерухомості

  async createPropertyCharacteristicValueBatch(
    propertyUuid: string,
    dtos: CreatePropertyCharacteristicsBatchDto[],
  ): Promise<PropertyCharacteristicValue[]> {

    validateUUIDFormat(
      propertyUuid,
      "Некоректний формат UUID об'єкта нерухомості",
    );
    console.log('propertyUuid', propertyUuid);

    // const existingProperty = await transactionalEntityManager.findOne(
    //   Property,
    //   {
    //     where: { uuid: propertyUuid },
    //     relations: [
    //       'property_characteristic_values',
    //       'property_characteristic_values.property_characteristic',
    //     ],
    //   },
    // );

    const existingProperty = await this.propertyService.findOne(propertyUuid);


    if (!existingProperty) {
      this.logger.error(
        `Property with UUID ${propertyUuid} not found during characteristic batch creation.`,
      );
      throw new NotFoundException(
        `Об'єкт нерухомості з UUID ${propertyUuid} не знайдено.`,
      );
    }

    //Verify that income characteristics not present in property
    //Get characteristic uuid from existing property

    // const existingCharacteristicUuid = new Set(
    //   existingProperty.property_characteristic_values.map(
    //     (charValue) => charValue.property_characteristic.uuid,
    //   ),
    // );
    // console.log('existingCharacteristicUuid', existingCharacteristicUuid);
    // const duplicateCharacteristicUuid: string[] = [];
    // for (const dto of dtos) {
    //   if (existingCharacteristicUuid.has(dto.property_characteristic_uuid)) {
    //     duplicateCharacteristicUuid.push(dto.property_characteristic_uuid);
    //   }
    // }
    //
    // console.log('duplicate characteristicUuid', duplicateCharacteristicUuid);
    //
    // if (duplicateCharacteristicUuid.length > 0) {
    //   const duplicateUuids = duplicateCharacteristicUuid.join(',');
    //   this.logger.error(
    //     `For some characteristics data already entered: ${duplicateUuids}`,
    //   );
    //   throw new UnprocessableEntityException(
    //     `For some characteristics data already entered: ${duplicateUuids}`,
    //   );
    // }
    //
    // Verify that property_characteristic_uuid are uniq
    const characteristicUuids = dtos.map((d) => d.property_characteristic_uuid);
    //
    // const incorrectCharacteristicUuid: string[] = [];
    // for (const charUuid of characteristicUuids) {
    //   if (!validate(charUuid)) {
    //     incorrectCharacteristicUuid.push(charUuid);
    //   }
    // }
    // if (incorrectCharacteristicUuid.length > 0) {
    //   const validateUuidMessage = incorrectCharacteristicUuid.join(', ');
    //   this.logger.error(
    //     `Some characteristic uuid are invalid: ${validateUuidMessage}`,
    //   );
    //   throw new UnprocessableEntityException(
    //     `Some characteristic uuid are invalid: ${validateUuidMessage}`,
    //   );
    // }
    //
    // const dupl = duplicates(characteristicUuids);
    // if (dupl.length > 0) {
    //   this.logger.error(`Some characteristics are duplicated: ${dupl}`);
    //   throw new UnprocessableEntityException(
    //     `Some characteristics are duplicated: ${dupl}`,
    //   );
    // }

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        // if (dtos.length === 0) {
        //   return [];
        // }

        await transactionalEntityManager
          .getRepository(PropertyCharacteristicValue)
          .delete({ property: { uuid: propertyUuid } });

        // Verify that all characteristics exists
        const existingCharacteristics = await transactionalEntityManager.find(
          PropertyCharacteristic,
          {
            where: { uuid: In(characteristicUuids) },
          },
        );
        if (existingCharacteristics.length !== characteristicUuids.length) {
          const foundUuids = new Set(
            existingCharacteristics.map((v) => v.uuid),
          );

          const missingUuids = characteristicUuids.filter(
            (uuid) => !foundUuids.has(uuid),
          );
          this.logger.error(
            `Missing characteristic types: ${missingUuids.join(', ')}`,
          );
          throw new UnprocessableEntityException(
            `Деякі типи характеристик не знайдено: ${missingUuids.join(', ')}`,
          );
        }

        const characteristicMap = new Map<string, PropertyCharacteristic>();
        existingCharacteristics.forEach((charValue) =>
          characteristicMap.set(charValue.uuid, charValue),
        );
        for (const charValue of dtos) {
          const characteristic = characteristicMap.get(
            charValue.property_characteristic_uuid,
          );

          console.log('characteristic', characteristic);

          const propertyCharacteristicType = characteristic.type;
          const inputValue = charValue.value;
          const isMultiple = characteristic.is_multiple;
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
              const characteristicValue = await transactionalEntityManager.find(
                CharacteristicValue,
                {
                  where: {
                    property_characteristic_uuid:
                      charValue.property_characteristic_uuid,
                  },
                },
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

                const allInputValuesAreAllowed = inputValue.every(
                  (inputValue) =>
                    allowedTextValues.includes(inputValue.toLowerCase()),
                );

                if (!allInputValuesAreAllowed) {
                  // Збираємо всі значення, які не знайшлися в дозволених
                  const disallowedValues = inputValue.filter(
                    (inputVal) =>
                      !allowedTextValues.includes(inputVal.toLowerCase()),
                  );
                  throw new UnprocessableEntityException(
                    `Одне або кілька значень: [${disallowedValues.map((v) => `'${v}'`).join(', ')}] не знайдено у довіднику для характеристики '${characteristic.name}'.`,
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
                    ` ${inputValue} не знайдено у довіднику для характеристики '${characteristic.name}'.`,
                  );
                }
              }
              break;
          }
        }

        // --- ВИПРАВЛЕННЯ: Коректне створення та збереження сутностей PropertyCharacteristicValue ---
        const propertyCharacteristicValuesToCreate: PropertyCharacteristicValue[] =
          [];

        for (const dto of dtos) {
          const newCharValue = new PropertyCharacteristicValue();

          // Присвоюємо вже завантажений об'єкт Property
          newCharValue.property = existingProperty;

          // !!! ВАЖЛИВО: Оскільки ми не використовуємо мапу, нам потрібно ЗНОВУ ЗАВАНТАЖИТИ characteristic
          // якщо ця логіка буде після циклу валідації.
          // Або ж ми можемо передавати 'characteristic' в DTO під час валідації,
          // але це вимагатиме зміни структури DTO.

          const characteristicToLink = characteristicMap.get(
            dto.property_characteristic_uuid,
          );

          if (!characteristicToLink) {
            this.logger.error(
              `Internal error: Characteristic with UUID ${dto.property_characteristic_uuid} not found when creating entity. This should not happen after previous checks.`,
            );
            throw new InternalServerErrorException(
              'Внутрішня помилка сервера: характеристику не знайдено при створенні сутності.',
            );
          }

          newCharValue.property_characteristic = characteristicToLink;
          newCharValue.value = dto.value;
          propertyCharacteristicValuesToCreate.push(newCharValue);
        }
        // Збережіть новостворені сутності
        return await transactionalEntityManager.save(
          propertyCharacteristicValuesToCreate,
        );
      },
    );
  }

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
