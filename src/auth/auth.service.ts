import {
  HttpStatus,
  Injectable,
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
import { ApiResponse } from '../common/dto/api-response.dto';
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

  async login(data: AuthDto, response: Response) {
    const res_user = await this.userService.findOneByEmail(data.email);
    const tokens = await this.getTokens(res_user);

    const expiresAccessToken: Date = new Date(
      new Date().getTime() +
        parseInt(this.configService.get<string>('JWT_ACCESS_EXPIRESIN')),
    );

    response.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      expires: expiresAccessToken,
      path: '/',
    });

    const expiresRefreshToken: Date = new Date(
      new Date().getTime() +
        parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRESIN')),
    );
    //How and where correct store refresh token
    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      expires: expiresRefreshToken,
      path: '/',
    });

    delete res_user.password;
    return new ApiResponse(res_user, 'Logged in', HttpStatus.OK);
  }

  logout(userUUID: string, @Res() response: Response) {
    response.clearCookie('refresh_token');
    response.clearCookie('access_token');

    return new ApiResponse({ uuid: userUUID }, 'Logged out', HttpStatus.OK);
  }

  async refreshTokens(userUuid: string) {
    const user = await this.userService.findOne(userUuid);
    if (!user) {
      throw new UnauthorizedException('Access denied');
    }

    return await this.getTokens(user);
  }

  async getTokens(user: User) {
    console.log('*************User from get Token*************');
    console.log('User from get Token', user);
    console.log('*******************');

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
    console.log('***********Request*************');
    console.log('Request', request);
    console.log('************************');

    const user = request.user;
    console.log('**********User from Request*********');
    console.log('Profile:', user);
    console.log('**********************');
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
