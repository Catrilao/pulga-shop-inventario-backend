import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../decorators/current-user.decorator';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from '../decorators/is-public.decorator';
import { ERROR_CODES } from 'src/common/constants/error-codes';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException({
        message: 'Token no encontrado',
        error: ERROR_CODES.NO_AUTORIZADO,
      });
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      request.user = {
        id: payload.sub || payload.id,
        email: payload.email,
        role: payload.role,
      } as UserPayload;

      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Sesión no iniciada',
        error: ERROR_CODES.NO_AUTORIZADO,
      });
    }
  }
}
