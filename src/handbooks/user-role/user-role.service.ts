import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { UserRole } from './entities/user-role.entity';
import { validate as validateUUID } from 'uuid';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async create(createUserRoleDto: CreateUserRoleDto) {
    const existingUserRole = await this.userRoleRepository.findOne({
      where: [
        { title: createUserRoleDto.title },
        { role: createUserRoleDto.role },
      ],
    });
    if (existingUserRole) {
      throw new UnprocessableEntityException(
        'Запис з такою роллю та/або назвою вже існує',
      );
    }
    try {
      return this.userRoleRepository.save(createUserRoleDto);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return this.userRoleRepository.find();
  }

  async findOne(uuid: string) {
    if (!validateUUID(uuid)) {
      throw new UnprocessableEntityException('Incorrect UUID');
    }
    const userRole = await this.userRoleRepository.findOne({
      where: {
        uuid: uuid,
      },
      relations: ['type'],
      select: [
        'uuid',
        'role',
        'title',
        'type_uuid',
        'type',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!userRole) {
      throw new NotFoundException(`User with ${uuid} not found`);
    }
    return {
      uuid: userRole.uuid,
      role: userRole.role,
      title: userRole.title,
      type_uuid: userRole.type_uuid,
      type: userRole.type.type,
      type_title: userRole.type.title,
      createdAt: userRole.createdAt,
      updatedAt: userRole.updatedAt,
    };
  }

  async update(uuid: string, updateUserRoleDto: UpdateUserRoleDto) {
    if (!validateUUID(uuid)) {
      throw new UnprocessableEntityException('Incorrect UUID');
    }
    const existingUserRoles = await this.userRoleRepository.findOne({
      where: [
        { role: updateUserRoleDto.role },
        { title: updateUserRoleDto.title },
      ],
    });
    if (existingUserRoles && existingUserRoles.uuid !== uuid) {
      throw new UnprocessableEntityException(
        'Запис з такою роллю та/або назвою вже існує',
      );
    }
    await this.userRoleRepository.update(uuid, updateUserRoleDto);
    return { uuid };
  }

  async softDelete(uuid: string) {
    if (!validateUUID(uuid)) {
      throw new UnprocessableEntityException('Incorrect UUID');
    }
    const existingUserRole = await this.userRoleRepository.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (!existingUserRole) {
      throw new NotFoundException(`User role with ${uuid} not found`);
    }
    await this.userRoleRepository.softDelete(uuid);
    return { uuid: uuid };
  }

  async findDeletedAll() {
    const roles = await this.userRoleRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
      },
      relations: ['type'],
      select: [
        'uuid',
        'role',
        'title',
        'type_uuid',
        'type',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ],
    });

    return roles.map((role) => ({
      ...role,
      type_title: role.type.title,
      type: role.type.type,
      deletedAt: role.deletedAt.toLocaleDateString('en-CA'),
    }));
  }

  async restore(uuid: string) {
    if (!validateUUID(uuid)) {
      throw new UnprocessableEntityException('Incorrect UUID');
    }
    const existingUserRole = await this.userRoleRepository.findOne({
      withDeleted: true,
      where: { uuid: uuid },
    });
    if (!existingUserRole) {
      throw new NotFoundException(`User Role with ${uuid} not found`);
    }
    await this.userRoleRepository.restore(uuid);
    return { uuid: uuid };
  }

  async findByType({ typeUuid, type_name, type_title }) {
    const where: FindOptionsWhere<UserRole> = {};
    if (typeUuid) {
      where.type_uuid = typeUuid;
    }
    where.type = {};
    if (type_name) {
      where.type = { ...where.type, type: type_name };
    }
    if (type_title) {
      where.type = { ...where.type, title: type_title };
    }

    const roles = await this.userRoleRepository.find({
      where,
      relations: ['type'],
      select: [
        'uuid',
        'role',
        'title',
        'type_uuid',
        'type',
        'createdAt',
        'updatedAt',
      ],
    });

    // return roles;
    // console.log(roles);
    return roles.map((role) => ({
      ...role,
      type_title: role.type.title,
      type: role.type.type,
    }));
  }
}
