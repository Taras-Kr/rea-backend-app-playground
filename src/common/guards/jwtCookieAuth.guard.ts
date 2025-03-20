import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.access_token;
    console.log('TOKEN', token);
    if (!token) {
      console.log('TOKEN', false);
      // throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      console.log('JWT verified', payload);
      request['user'] = payload;
    } catch {
      // throw new UnauthorizedException();
    }
    return true;
  }
}
