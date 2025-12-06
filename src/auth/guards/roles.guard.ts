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
import { ERROR_CODES } from 'src/common/constants/error-codes';
import { UserRoles } from 'src/common/interfaces/user.roles.interface';

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

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const esVendedor = await this.verifyVendedor(user.id, token);
    const esAdministrador = await this.verifyAdministrador(user.id, token);

    const userRoles: UserRoles = {
      esVendedor,
      esAdministrador,
    };
    request.userRoles = userRoles;

    if (!roles) {
      if (!esVendedor && !esAdministrador) {
        throw new UnauthorizedException(
          'El usuario no tiene los permisos suficientes',
        );
      }
      return true;
    }

    if (roles.includes('vendedor') && esVendedor) {
      return true;
    }
    if (roles.includes('administrador') && esAdministrador) {
      return true;
    }

    throw new UnauthorizedException({
      message: 'El usuario no tiene el rol requerido',
      code: ERROR_CODES.NO_AUTORIZADO,
    });
  }

  private async verifyAdministrador(
    id_usuario: number,
    token: string,
  ): Promise<boolean> {
    const redisClient = this.redisService.getClient();
    const cacheKey = `administrador:${id_usuario}`;

    const cached = await redisClient.get(cacheKey);
    if (cached !== null) {
      return cached === 'true';
    }

    if (process.env.NODE_ENV === 'development') {
      this.logger.log(
        `Simulando respuesta del servicio de autenticación para el usuario con ID: '${id_usuario}'`,
      );

      const esAdministrador = true;
      await redisClient.set(cacheKey, esAdministrador.toString(), 'EX', 3600);
      return esAdministrador;
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get(`${process.env.SERVICIO_AUTH_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      const roles: string[] = response.data.roles;
      const esAdministrador = Array.isArray(roles) && roles.includes('admin');

      await redisClient.set(cacheKey, esAdministrador.toString(), 'EX', 3600);

      return esAdministrador;
    } catch (error) {
      this.logger.error(
        `Error al verificar el rol del usuario con ID ${id_usuario}: ${error.message}`,
      );
      throw new UnauthorizedException('Error al verificar el rol del usuario');
    }
  }

  private async verifyVendedor(
    id_usuario: number,
    token: string,
  ): Promise<boolean> {
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
        this.httpService.get(`${process.env.SERVICIO_AUTH_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      const roles: string[] = response.data.roles;
      const esVendedor = Array.isArray(roles) && roles.includes('vendedor');

      await redisClient.set(cacheKey, esVendedor.toString(), 'EX', 3600);

      return esVendedor;
    } catch (error) {
      this.logger.error(
        `Error al verificar el rol del usuario con ID ${id_usuario}: ${error.message}`,
      );
      throw new UnauthorizedException('Error al verificar el rol del usuario');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
