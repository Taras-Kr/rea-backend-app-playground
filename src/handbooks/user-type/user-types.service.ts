import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType } from './entities/user-type.entity';
import { FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { validate } from 'uuid';
import { CustomApiResponse } from '../../common/dto/api-response.dto';
import { UserRole } from '../user-role/entities/user-role.entity';

@Injectable()
export class UserTypesService {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async create(createUserTypeDto: CreateUserTypeDto) {
    const existingUserType = await this.userTypeRepository.findOne({
      where: [
        { type: createUserTypeDto.type },
        { title: createUserTypeDto.title },
      ],
    });

    if (existingUserType) {
      throw new UnprocessableEntityException(
        'Запис з такими типом та/або назвою вже існує',
      );
    }
    return this.userTypeRepository.save(createUserTypeDto);
  }

  findAll() {
    return this.userTypeRepository.find();
  }

  async findOne(uuid: string) {
    if (!validate(uuid)) {
      throw new UnprocessableEntityException('Invalid uuid');
    }
    const userType = await this.userTypeRepository.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (!userType) {
      throw new NotFoundException(`User with ${uuid} not found`);
    }
    return userType;
  }

  async update(uuid: string, updateUserTypeDto: UpdateUserTypeDto) {
    if (!validate(uuid)) {
      throw new UnprocessableEntityException('Invalid uuid');
    }
    const userType = await this.userTypeRepository.findOne({
      where: [
        { type: updateUserTypeDto.type },
        { title: updateUserTypeDto.title },
      ],
    });

    if (userType && userType.uuid !== uuid) {
      throw new UnprocessableEntityException(
        'Запис з такими типом та/або назвою вже існує',
      );
    }
    await this.userTypeRepository.update(uuid, updateUserTypeDto);
    return new CustomApiResponse({ uuid: uuid }, 'Updated', HttpStatus.OK);
  }

  async delete(uuid: string) {
    if (!validate(uuid)) {
      throw new UnprocessableEntityException('Invalid uuid');
    }

    const userType = await this.userTypeRepository.findOne({
      where: { uuid: uuid },
    });

    if (!userType) {
      throw new NotFoundException(`User with ${uuid} not found`);
    }

    await this.userTypeRepository.softDelete(uuid);
    return new CustomApiResponse({ uuid: uuid }, 'Deleted', HttpStatus.OK);
  }

  async findDeletedAll() {
    const userTypes = await this.userTypeRepository.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
      select: {
        uuid: true,
        type: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    const resp = userTypes.map((type) => ({
      ...type,
      deletedAt: type.deletedAt.toLocaleDateString('en-CA'),
    }));
    return new CustomApiResponse(resp, 'Success', HttpStatus.OK);
  }

  async restore(uuid: string) {
    if (!validate(uuid)) {
      throw new UnprocessableEntityException('Invalid uuid');
    }
    const userType = await this.userTypeRepository.findOne({
      withDeleted: true,
      where: { uuid: uuid },
    });
    if (!userType) {
      throw new NotFoundException(`User Type with ${uuid} not found`);
    }
    await this.userTypeRepository.restore(uuid);
    return new CustomApiResponse({ uuid: uuid }, 'Restored', HttpStatus.OK);
  }

  async findByRole({ role, role_title }) {
    const where: FindOptionsWhere<UserRole> = {};
    if (role) {
      where['role'] = role;
    }
    if (role_title) {
      where['title'] = role_title;
    }
    if (Object.keys(where).length === 0) {
      return await this.userTypeRepository.find();
    }

    const data = await this.userRoleRepository.findOne({
      where,
    });

    try {
      return await this.userTypeRepository.find({
        where: {
          uuid: data.type_uuid,
        },
      });
    } catch (err: any) {
      throw new NotFoundException();
    }
  }

  async findByType({ type, type_title }) {
    const where: FindOptionsWhere<UserType> = {};
    if (type) {
      where['type'] = type;
    }
    if (type_title) {
      where['title'] = type_title;
    }
    if (Object.keys(where).length === 0) {
      return await this.userTypeRepository.find();
    }
    try {
      const data = await this.userTypeRepository.findOne({
        where,
      });
      if (data) {
        return data;
      } else {
        throw new NotFoundException(
          `Type with ${where.type}/${where.title} not found`,
        );
      }
    } catch (err: any) {
      throw new NotFoundException(
        `Type with User with ${where.type}/${where.title} not found`,
      );
    }
  }
}
