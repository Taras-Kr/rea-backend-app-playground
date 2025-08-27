import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyWithLocationDto } from './dto/create-property-with-location.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { PropertyTypeService } from '../handbooks/property-type/property-type.service';
import { LocationService } from '../location/location.service';
import { validateUUIDFormat } from '../common/utils/uuid.utils';
import { Location } from '../location/entities/location.entity';
import { CreateFullPropertyDto } from './dto/create-full-property';
import { UpdateFullPropertyDto } from './dto/update-full-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly propertyTypeService: PropertyTypeService,
    private readonly propertyLocationService: LocationService,
    private readonly dataSource: DataSource,
  ) {}

  // Метод створення об'єкта нерухомості використовуючи транзакції
  async createProperty(
    createProperty: CreateFullPropertyDto,
  ): Promise<Property> {
    return await this.dataSource.manager.transaction(
      async (transactionEntityManager) => {
        const propertyType = await this.propertyTypeService.findOne(
          createProperty.property.property_type_uuid,
        );
        if (!propertyType) {
          throw new NotFoundException('Тип нерухомості не знайдено.');
        }

        const locationRepository =
          transactionEntityManager.getRepository(Location);
        const newLocation = locationRepository.create(createProperty.location);
        const savedLocation = await locationRepository.save(newLocation);

        const newProperty = this.propertyRepository.create(
          createProperty.property,
        );
        newProperty.property_type = propertyType;
        newProperty.location = savedLocation;
        newProperty.gallery_uuid = createProperty.property.gallery_uuid || null;
        return await transactionEntityManager.save(Property, newProperty);
      },
    );
  }

  async create(
    createPropertyDto: CreatePropertyWithLocationDto,
  ): Promise<Property> {
    const propertyType = await this.propertyTypeService.findOne(
      createPropertyDto.property_type_uuid,
    );
    if (!propertyType) {
      throw new NotFoundException('Тип нерухомості не знайдено.');
    }

    const location = await this.propertyLocationService.findOne(
      createPropertyDto.location_uuid,
    );
    if (!location) {
      throw new NotFoundException('Адреса обєкта нерухомості не знайдена');
    }

    const newProperty = this.propertyRepository.create(createPropertyDto);
    newProperty.property_type = propertyType;
    newProperty.location = location;
    newProperty.gallery_uuid = createPropertyDto.gallery_uuid || null;

    return this.propertyRepository.save(newProperty);
  }

  findAll() {
    return this.propertyRepository.find({
      relations: ['property_type', 'location', 'property_type.category'],
      select: {
        uuid: true,
        title: true,
        is_published: true,
        gallery_uuid: true,
        property_type: {
          uuid: true,
          name: true,
          category: {
            uuid: true,
            name: true,
          },
        },
        location: {
          uuid: true,
          community: true,
          settlement: true,
          district: true,
          street: true,
          building_number: true,
          apartment_number: true,
        },
        created_at: true,
      },
    });
  }

  async findOne(uuid: string) {
    validateUUIDFormat(uuid, "Некоректний формат UUID об'єкта нерухомості.");
    const existingProperty = await this.propertyRepository.findOne({
      where: {
        uuid: uuid,
      },
      relations: [
        'property_type',
        'location',
        'property_type.category',
        'property_characteristic_values',
        'property_characteristic_values.property_characteristic',
      ],
      select: {
        uuid: true,
        title: true,
        is_published: true,
        gallery_uuid: true,
        property_type: {
          uuid: true,
          name: true,
          category: {
            uuid: true,
            name: true,
          },
        },
        location: {
          uuid: true,
          community: true,
          settlement: true,
          district: true,
          street: true,
          building_number: true,
          apartment_number: true,
          description: true,
          latitude: true,
          longitude: true,
        },
        property_characteristic_values: {
          uuid: true,
          value: true,
          property_characteristic: {
            uuid: true,
            name: true,
            type: true,
            is_multiple: true,
            description: true,
          },
        },
        created_at: true,
      },
    });
    if (!existingProperty) {
      throw new NotFoundException("Об'єкт нерухомості не знайдено");
    }
    return existingProperty;
  }

  //Оновлення об'єкта нерухомості використовуючи транзакції
  async updateProperty(uuid: string, updatePropertyDto: UpdateFullPropertyDto) {
    validateUUIDFormat(uuid, "Некоректний формат UUID об'єкта нерухомості");
    // Verify that property exist
    const existingProperty = await this.findOne(uuid);
    if (!existingProperty) {
      throw new NotFoundException("Об'єкт нерухомості не знайдено");
    }
    //Verify that location exist
    const existingLocation = await this.propertyLocationService.findOne(
      existingProperty.location.uuid,
    );
    if (!existingLocation) {
      throw new NotFoundException("Локацію об'єкта нерухомості не знайдено");
    }
    validateUUIDFormat(
      updatePropertyDto.property.property_type_uuid,
      "Некоректний формат UUID типу об'єкта нерухомості",
    );

    //Verify that property type exist
    const existingPropertyType = await this.propertyTypeService.findOne(
      updatePropertyDto.property.property_type_uuid,
    );
    if (!existingPropertyType) {
      throw new NotFoundException("Тип об'єкта нерухомості не знайдено");
    }

    return await this.dataSource.manager.transaction(
      async (transactionManager) => {
        const updatedLocation = Object.assign(
          existingProperty.location,
          updatePropertyDto.location,
        );
        const savedLocation = await transactionManager.save(
          Location,
          updatedLocation,
        );

        const updatedProperty = Object.assign(
          existingProperty,
          updatePropertyDto.property,
        );
        updatedProperty.property_type = existingPropertyType;
        updatedProperty.location = savedLocation;

        return await transactionManager.save(Property, updatedProperty);
      },
    );
  }

  async update(uuid: string, updatePropertyDto: UpdatePropertyDto) {
    validateUUIDFormat(uuid, "Некоректний формат UUID об'єкта нерухомості.");

    const existingProperty = await this.propertyRepository.findOne({
      where: { uuid: uuid },
    });
    if (!existingProperty) {
      throw new NotFoundException("Об'єкт нерухомості не знайдено.");
    }

    validateUUIDFormat(
      updatePropertyDto.property_type_uuid,
      "Некоректний формат UUID об'єкта нерухомості.",
    );
    const propertyType = await this.propertyTypeService.findOne(
      updatePropertyDto.property_type_uuid,
    );
    if (!propertyType) {
      throw new NotFoundException('Тип нерухомості не знайдено.');
    }

    existingProperty.title = updatePropertyDto.title;
    existingProperty.is_published = updatePropertyDto.is_published;
    existingProperty.property_type = propertyType;
    existingProperty.gallery_uuid = updatePropertyDto.gallery_uuid;

    return this.propertyRepository.save(existingProperty);
  }

  async softDelete(uuid: string) {
    validateUUIDFormat(uuid, "Некоректний формат UUID об'єкта нерухомості.");
    const existingProperty = await this.propertyRepository.findOne({
      where: { uuid: uuid },
    });
    if (!existingProperty) {
      throw new NotFoundException("Об'єкт нерухомості не знайдено.");
    }
    await this.propertyRepository.softDelete(uuid);
    return { uuid: uuid };
  }

  async restore(uuid: string) {
    validateUUIDFormat(uuid, "Некоректний формат UUID об'єкта нерухомості.");
    const existingProperty = await this.propertyRepository.findOne({
      withDeleted: true,
      where: { uuid: uuid },
    });
    if (!existingProperty) {
      throw new NotFoundException("Об'єкт нерухомості не знайдено.");
    }
    await this.propertyRepository.restore(uuid);
    return { uuid: uuid };
  }

  findDeletedAll() {
    return this.propertyRepository.find({
      withDeleted: true,
      where: {
        deleted_at: Not(IsNull()),
      },
      relations: ['property_type', 'location', 'property_type.category'],
      select: {
        uuid: true,
        title: true,
        is_published: true,
        gallery_uuid: true,
        property_type: {
          uuid: true,
          name: true,
          category: {
            uuid: true,
            name: true,
          },
        },
        location: {
          uuid: true,
          community: true,
          settlement: true,
          district: true,
          street: true,
          building_number: true,
          apartment_number: true,
        },
        created_at: true,
        updated_at: true,
        deleted_at: true,
      },
    });
  }
}
