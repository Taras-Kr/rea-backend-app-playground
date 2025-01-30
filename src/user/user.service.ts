import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as uuidValidate } from 'uuid';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
    const createdUser = await this.userRepository.save({
      ...createUserDto,
      password: await argon2.hash(createUserDto.password),
    });
    delete createdUser.password;
    return {
      data: createdUser,
      message: 'User created successfully.',
      statusCode: 200,
    };
  }

  async findAll() {
    const users = await this.userRepository.find({
      where: {
        deletedAt: IsNull(),
      },
    });
    return {
      data: users,
      count: users.length,
      statusCode: 200,
    };
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
    return {
      data: user,
      statusCode: 200,
    };
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
    return {
      uuid: uuid,
      message: 'User deleted successfully.',
      statusCode: 200,
    };
  }

  async findAllDeleted() {
    const users = await this.userRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
      },
    });
    return {
      data: users,
      count: users.length,
      statusCode: 200,
    };
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
    return {
      uuid: uuid,
      message: 'Restored',
      statusCode: 200,
    };
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

    if (updateUserDto.type === 'user' && updateUserDto.roles !== 'user') {
      throw new UnprocessableEntityException(
        `User with type \'${updateUserDto.type}\' and \'${updateUserDto.roles}\' role is not allowed`,
      );
    }

    await this.userRepository.update(uuid, updateUserDto);
    return {
      uuid: uuid,
      message: 'User updated successfully.',
      statusCode: 200,
    };
  }
}
