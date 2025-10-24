import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_CODES } from 'src/common/constants/error-codes';

@Injectable()
export class ProductoService {
  constructor(private prisma: PrismaService) {}

  async create(createProductoDto: CreateProductoDto) {
    if (createProductoDto.stock <= 0) {
      throw new BadRequestException({
        message: 'El stock inicial debe ser mayor a 0',
        error: ERROR_CODES.STOCK_INVALIDO,
      });
    }

    if (
      createProductoDto.precio <= 0 ||
      !Number.isInteger(createProductoDto.precio)
    ) {
      throw new BadRequestException({
        message: 'El precio debe ser un número entero mayor a 0',
        error: ERROR_CODES.PRECIO_INVALIDO,
      });
    }

    const { disponible, id_tienda, ...losDemas } = createProductoDto;

    const tiendaExiste = await this.prisma.tienda.findUnique({
      where: { id_tienda },
    });
    if (!tiendaExiste) {
      throw new NotFoundException({
        message: 'La tienda no existe',
        error: ERROR_CODES.TIENDA_NO_EXISTE,
      });
    }

    return await this.prisma.producto.create({
      data: {
        sku: uuidv4(),
        ...losDemas,
        disponible: disponible ?? true,
        tienda: { connect: { id_tienda } },
      },
    });
  }
}
