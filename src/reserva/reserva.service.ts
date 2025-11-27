import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservaDto, ReservaItemDto } from './dto/create-reserva.dto';
import { RedisService } from 'src/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PRODUCTO_ERROR_CODES } from 'src/producto/constants/error-codes';

@Injectable()
export class ReservaService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  async create(createReservaDto: CreateReservaDto) {
    const tenMinutesInSeconds = 600;
    await this.redis.set(
      String(createReservaDto.id_orden),
      createReservaDto.items,
      tenMinutesInSeconds,
    );
  }

  async confirm(id: number) {
    const datosReserva = await this.redis.get<ReservaItemDto[]>(String(id));

    if (!datosReserva)
      throw new NotFoundException('La sesión de pago expiro o no existe');

    try {
      this.prisma.$transaction(async (tx) => {
        for (const item of datosReserva) {
          const result = await tx.producto.updateMany({
            where: {
              sku: item.sku,
              stock: { gte: item.cantidad_reservada },
            },
            data: {
              stock: { decrement: item.cantidad_reservada },
            },
          });

          if (result.count === 0) {
            throw new BadRequestException({
              message: `Stock insuficiente o producto no disponible: ${item.sku}`,
              error: PRODUCTO_ERROR_CODES.STOCK_INSUFICIENTE,
            });
          }
        }
      });
    } catch (error) {
      throw error;
    }

    await this.redis.del(String(id));
  }
}
