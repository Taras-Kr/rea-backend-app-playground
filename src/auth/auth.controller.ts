import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { JwtCookieAuthGuard } from '../common/guards/jwtCookieAuth.guard';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AccessTokenGuard)
  @UseGuards(JwtCookieAuthGuard)
  @Post('logout')
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.user || !request.user['sub']) {
      throw new UnauthorizedException('Користувач не автентифікований');
    }
    console.log('User:', request.user['sub']);
    const userUUID = request.user['sub'];
    return this.authService.logout(userUUID, response);
  }

  @UseGuards(AccessTokenGuard)
  // @UseGuards(JwtCookieAuthGuard)
  @Get('profile')
  profile(@Req() request: Request) {
    return this.authService.profile(request);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() request: Request) {
    return this.authService.refreshTokens(request.user['sub']);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() data: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(data, res);
  }
}
