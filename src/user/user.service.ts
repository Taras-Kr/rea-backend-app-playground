import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as uuidValidate } from 'uuid';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { UserRole } from '../handbooks/user-role/entities/user-role.entity';
import { UserType } from '../handbooks/user-type/entities/user-type.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new UnprocessableEntityException(
        `User with ${createUserDto.email} email already exists`,
      );
    }

    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new UnprocessableEntityException("Passwords don't match");
    }
    delete createUserDto.confirm_password;

    let userType: UserType | null = null;
    if (!createUserDto.type_uuid) {
      userType = await this.userTypeRepository.findOne({
        where: { title: 'Користувач' },
      });
    } else {
      userType = await this.userTypeRepository.findOne({
        where: { uuid: createUserDto.type_uuid },
      });
    }
    if (!userType) {
      throw new UnprocessableEntityException('Default user type not found');
    }

    let userRole: UserRole | null = null;
    if (!createUserDto.role_uuid) {
      userRole = await this.userRoleRepository.findOne({
        where: { title: 'Користувач' },
      });
    } else {
      userRole = await this.userRoleRepository.findOne({
        where: { uuid: createUserDto.role_uuid },
      });
    }
    if (!userRole) {
      throw new UnprocessableEntityException('Default user type not found');
    }

    const createdUser = this.userRepository.create({
      ...createUserDto,
      password: await argon2.hash(createUserDto.password),
      type: userType,
      role: userRole,
    });

    await this.userRepository.save(createdUser);
    console.log('Created', createdUser);
    delete createdUser.password;
    return createdUser;
  }

  async findAll() {
    const users = await this.userRepository.find({
      withDeleted: false,
      relations: ['type', 'role'],
      select: [
        'uuid',
        'name',
        'surname',
        'email',
        'type_uuid',
        'role_uuid',
        'createdAt',
        'updatedAt',
      ],
    });
    return users.map((user) => ({
      uuid: user.uuid,
      name: user.name,
      surname: user.surname,
      email: user.email,
      type_uuid: user.type_uuid,
      type_title: user.type.title,
      role_uuid: user.role_uuid,
      role_title: user.role.title,
    }));
  }

  async findOne(uuid: string) {
    if (!uuidValidate(uuid)) {
      throw new UnprocessableEntityException('Invalid uuid');
    }

    const user = await this.userRepository.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ${uuid} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: ['uuid', 'name', 'surname', 'email', 'password'],
      relations: ['type', 'role'],
    });

    console.log('User from findByEmail', user);

    if (!user) {
      //Change message something like "Unavailable credentials"
      throw new UnauthorizedException(`Email or password is incorrect`);
    }

    return user;
  }

  async delete(uuid: string) {
    if (!uuidValidate(uuid)) {
      throw new UnprocessableEntityException('Invalid uuid');
    }

    const user = await this.userRepository.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ${uuid} not found or user already deleted`,
      );
    }
    await this.userRepository.softDelete(uuid);
    return new ApiResponse(
      { uuid: uuid },
      'User deleted successfully',
      HttpStatus.OK,
    );
  }

  async findAllDeleted() {
    const users = await this.userRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
      },
      relations: ['type', 'role'],
      select: [
        'uuid',
        'name',
        'surname',
        'email',
        'type_uuid',
        'role_uuid',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ],
    });
    return users.map((user) => ({
      uuid: user.uuid,
      name: user.name,
      surname: user.surname,
      email: user.email,
      type_uuid: user.type_uuid,
      type_title: user.type.title,
      role_uuid: user.role_uuid,
      role_title: user.role.title,
      deletedAt: user.deletedAt.toLocaleDateString('en-CA'),
    }));
  }

  async restore(uuid: string) {
    if (!uuidValidate(uuid)) {
      throw new UnprocessableEntityException('Invalid uuid');
    }

    const user = await this.userRepository.findOne({
      withDeleted: true,
      where: {
        uuid: uuid,
      },
    });
    if (!user) {
      throw new NotFoundException('User with ${uuid} not found');
    }
    await this.userRepository.restore(uuid);
    return new ApiResponse({ uuid: uuid }, 'Restored', HttpStatus.OK);
    // return {
    //   uuid: uuid,
    //   message: 'Restored',
    //   statusCode: 200,
    // };
  }

  async update(uuid: string, updateUserDto: UpdateUserDto) {
    if (!uuidValidate(uuid)) {
      throw new UnprocessableEntityException('Invalid uuid');
    }

    const user = await this.userRepository.findOne({
      where: { uuid: uuid },
    });
    if (!user) {
      throw new NotFoundException('User with ${uuid} not found');
    }

    // if (updateUserDto.type === 'user' && updateUserDto.role !== 'user') {
    //   throw new UnprocessableEntityException(
    //     `User with type \'${updateUserDto.type}\' and \'${updateUserDto.role}\' role is not allowed`,
    //   );
    // }

    await this.userRepository.update(uuid, updateUserDto);
    return { uuid: uuid };
    // return {
    //   uuid: uuid,
    //   message: 'User updated successfully.',
    //   statusCode: 200,
    // };
  }
}
