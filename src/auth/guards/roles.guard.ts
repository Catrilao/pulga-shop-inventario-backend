import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPayload } from '../decorators/current-user.decorator';
import { IS_PUBLIC } from '../decorators/is-public.decorator';
import { HttpService } from '@nestjs/axios';
import { RedisService } from 'src/redis/redis.service';
import { lastValueFrom } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private httpService: HttpService,
    private redisService: RedisService,
    private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<string>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user: UserPayload = request.user;

    if (!user.id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const esVendedor = await this.verifyVendedor(user.id);

    if (!roles) {
      if (!esVendedor) {
        throw new UnauthorizedException('El usuario no es un vendedor');
      }
      return true;
    }
  }

  private async verifyVendedor(id_usuario: number): Promise<boolean> {
    const redisClient = this.redisService.getClient();
    const cacheKey = `vendedor:${id_usuario}`;

    const cached = await redisClient.get(cacheKey);
    if (cached !== null) {
      return cached === 'true';
    }

    if (process.env.NODE_ENV === 'development') {
      this.logger.log(
        `Simulando respuesta del servicio de autenticación para el usuario con ID: '${id_usuario}'`,
      );

      const esVendedor = true;
      await redisClient.set(cacheKey, esVendedor.toString(), 'EX', 3600);
      return esVendedor;
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${process.env.SERVICIO_AUTH_URL}/auth/me`,
        ),
      );

      const esVendedor = response.data?.esVendedor || false;

      await redisClient.set(cacheKey, esVendedor.toString(), 'EX', 3600);

      return esVendedor;
    } catch (error) {
      this.logger.error(
        `Error al verificar el rol del usuario con ID ${id_usuario}: ${error.message}`,
      );
      throw new UnauthorizedException('Error al verificar el rol del usuario');
    }
  }
}
