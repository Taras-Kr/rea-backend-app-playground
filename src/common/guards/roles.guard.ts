import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    console.log('requiredRoles', requiredRoles);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException(
        'Запит тільки для авторизованих користувачів',
      );
    }

    const access_token = authHeader.split(' ')[1];
    console.log('access_token', access_token);

    try {
      console.log('JWT_SECRET:', process.env.JWT_SECRET);
      console.log('access_token:', access_token);
      console.log(
        'JWT_ACCESS_SECRET:',
        this.configService.get<string>('JWT_ACCESS_SECRET'),
      );
      const decoded = this.jwtService.verify(access_token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      console.log('decoded', decoded);
      if (!requiredRoles.includes(decoded.role)) {
        throw new ForbiddenException('Недостатньо прав для виконання');
      }
      return true;
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      throw new ForbiddenException('Недостатньо прав для виконання');
    }
  }
}
