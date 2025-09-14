import {
  Controller,
  Post,
  Res,
  Get,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { User } from '../user/entities/user.entity';
import { CustomApiResponse } from '../common/dto/api-response.dto';
import * as process from 'node:process';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userUUID = request.user['sub'];
    await this.authService.logout(userUUID);
    response.clearCookie('refresh_token');
    return new CustomApiResponse(
      { uuid: userUUID },
      'Вихід з системи успішний',
      HttpStatus.OK,
    );
  }

  @UseGuards(AccessTokenGuard)
  // @UseGuards(JwtCookieAuthGuard)
  @Get('profile')
  profile(@Req() request: Request) {
    return this.authService.profile(request);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    const tokens = await this.authService.refreshTokens(refreshToken);
    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: parseInt(process.env.JWT_REFRESH_EXPIRESIN),
    });
    return new CustomApiResponse(
      { access_token: tokens.access_token },
      'Tokens refreshed successfully',
      HttpStatus.OK,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = request.user as User;
    const result = await this.authService.login(user);

    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: parseInt(process.env.JWT_REFRESH_EXPIRESIN) * 1000,
    });

    return new CustomApiResponse(
      { ...result.user, access_token: result.accessToken },
      'Успішний вхід',
      HttpStatus.OK,
    );
  }
}
