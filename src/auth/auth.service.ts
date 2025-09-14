import {
  HttpStatus,
  Injectable,
  Logger,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { CustomApiResponse } from '../common/dto/api-response.dto';
import { ProfileResponse } from '../common/dto/profile-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger('AuthService');

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    if (!(await argon2.verify(user.password, pass))) {
      throw new UnauthorizedException('Invalid email or password!');
    }
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: User) {
    const tokens = await this.getTokens(user);
    const hashedRefreshToken = await argon2.hash(tokens.refresh_token);
    await this.userRepository.update(user.uuid, {
      hashed_refresh_token: hashedRefreshToken,
    });

    const {
      password: _,
      hashed_refresh_token: __,
      ...userWithoutSecrets
    } = user;

    return {
      user: userWithoutSecrets,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  }

  async logout(userUUID: string) {
    await this.userRepository.update(userUUID, {
      hashed_refresh_token: null,
    });
    return true;
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: {
          uuid: payload.sub,
        },
        relations: ['type', 'role'],
      });
      if (!user || !user.hashed_refresh_token) {
        this.logger.error('Access denied');
        throw new UnauthorizedException('Access denied');
      }

      const isMatch = await argon2.verify(
        user.hashed_refresh_token,
        refreshToken,
      );
      if (!isMatch) {
        this.logger.error('Access denied');
        throw new UnauthorizedException('Access denied');
      }
      const tokens = await this.getTokens(user);
      const hashedRefreshToken = await argon2.hash(tokens.refresh_token);
      await this.userRepository.update(user.uuid, {
        hashed_refresh_token: hashedRefreshToken,
      });
      return tokens;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getTokens(user: User) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.uuid,
          name: user.name,
          surname: user.surname,
          email: user.email,
          type: user.type.type,
          role: user.role.role,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn:
            this.configService.get<string>('JWT_ACCESS_EXPIRESIN') + 'ms',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.uuid,
          name: user.name,
          surname: user.surname,
          email: user.email,
          type: user.type.type,
          role: user.role.role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn:
            this.configService.get<string>('JWT_REFRESH_EXPIRESIN') + 'ms',
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async profile(@Req() request: Request) {
    const user = request.user;
    let access_token = request.headers.authorization;
    if (access_token) {
      access_token = access_token.replace('Bearer ', '');
    }

    if (!user) {
      return new ProfileResponse(
        user,
        false,
        'Unauthenticated',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user) {
      const res = await this.userRepository.findOne({
        where: { uuid: user['sub'] },
        select:['uuid', 'name', 'surname', 'email', 'role','type'],
        relations: ['type', 'role'],
      });
      const profile = {
        ...res,
        role: res.role.role,
        type: res.type.type,
      };
      return new ProfileResponse(profile, true, 'Authenticated', HttpStatus.OK);
    }
  }
}
