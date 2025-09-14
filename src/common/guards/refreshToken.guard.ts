import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  private readonly logger = new Logger('RefreshTokenGuard');

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['refresh_token'];
    this.logger.log(`refresh token: ${token}`);
    if (!token) {
      this.logger.error('Refresh token not found');
      throw new UnauthorizedException('Refresh token is missing');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      request['user'] = payload;
    } catch (error) {
      this.logger.error(`Token verification failed: ${error}`);
      throw new UnauthorizedException(`Invalid or expired refresh token`);
    }
    return true;
  }
}
