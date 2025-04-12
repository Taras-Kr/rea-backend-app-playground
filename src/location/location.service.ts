import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { IsNull, Not, Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { validateUUIDFormat } from '../common/utils/uuid.utils';
import { GeocodingService } from '../geocoding/geocoding.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly geocodingService: GeocodingService,
  ) {}

  create(createLocationDto: CreateLocationDto) {
    return this.locationRepository.save(createLocationDto);
  }

  findAll() {
    return this.locationRepository.find();
  }

  async findOne(uuid: string) {
    validateUUIDFormat(uuid);
    const existingLocation = await this.locationRepository.findOne({
      where: { uuid: uuid },
    });
    if (!existingLocation) {
      throw new NotFoundException('Запис не знайдено');
    }
    return existingLocation;
  }

  async update(uuid: string, updateLocationDto: UpdateLocationDto) {
    validateUUIDFormat(uuid);
    const existingLocation = await this.locationRepository.findOne({
      where: { uuid: uuid },
    });

    if (!existingLocation) {
      throw new NotFoundException('Запис не знайдено');
    }
    await this.locationRepository.update(uuid, updateLocationDto);
    return { uuid: uuid };
  }

  async softDelete(uuid: string) {
    validateUUIDFormat(uuid);
    const existingLocation = await this.locationRepository.findOne({
      where: { uuid: uuid },
    });
    if (!existingLocation) {
      throw new NotFoundException('Запис не знайдено');
    }
    await this.locationRepository.softDelete(uuid);
    return { uuid: uuid };
  }

  async findDeletedAll() {
    return this.locationRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
      },
      select: [
        'uuid',
        'community',
        'settlement',
        'district',
        'street',
        'building_number',
        'apartment_number',
        'description',
        'latitude',
        'longitude',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ],
    });
  }

  async restore(uuid: string) {
    validateUUIDFormat(uuid);
    const existingDeletedLocation = await this.locationRepository.findOne({
      withDeleted: true,
      where: { uuid: uuid },
    });
    if (!existingDeletedLocation) {
      throw new NotFoundException('Deleted item not found');
    }
    await this.locationRepository.restore(uuid);
    return { uuid: uuid };
  }

  async updateCoordinates(uuid: string) {
    validateUUIDFormat(uuid);
    const existingLocation = await this.locationRepository.findOne({
      where: { uuid: uuid },
    });
    if (!existingLocation) {
      throw new NotFoundException('Запис не знайдено');
    }

    const addressParts = [
      existingLocation.settlement,
      existingLocation.street,
      existingLocation.building_number,
    ].filter(Boolean);

    const address = addressParts.join(', ');

    const coordinates =
      await this.geocodingService.getCoordinatesByAddress(address);
    existingLocation.latitude = coordinates.latitude;
    existingLocation.longitude = coordinates.longitude;
    await this.locationRepository.save(existingLocation);
    console.log('Coordinates', coordinates);
    return {
      uuid: uuid,
      latitude: existingLocation.latitude,
      longitude: existingLocation.longitude,
    };
  }
}
