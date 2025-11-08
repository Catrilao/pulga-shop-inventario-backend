import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { v4 as uuidv4 } from 'uuid';
import { TIENDA_ERROR_CODES } from 'src/tienda/constants/error-codes';
import { GetProductoDto } from './dto/get-producto.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { QueryProductoDto } from './dto/query-producto.dto';
import { ERROR_CODES } from 'src/common/constants/error-codes';
import { Prisma } from 'generated/prisma';
import { PRODUCTO_ERROR_CODES } from './constants/error-codes';

@Injectable()
export class ProductoService {
  constructor(private prisma: PrismaService) {}

  async create(createProductoDto: CreateProductoDto) {
    const { disponible, id_tienda, ...losDemas } = createProductoDto;

    const tiendaExiste = await this.prisma.tienda.findUnique({
      where: { id_tienda },
    });
    if (!tiendaExiste) {
      throw new NotFoundException({
        message: 'La tienda no existe',
        error: TIENDA_ERROR_CODES.TIENDA_NO_EXISTE,
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

  async findOne(
    sku: string
  ): Promise<GetProductoDto> {
    try {
      const producto = await this.prisma.producto.findUnique({
        where: { sku }
      });

      if (!producto) {
        throw new NotFoundException({
          message: `Producto con SKU '${sku}' no encontrado`,
          code: ERROR_CODES.NO_ENCONTRADO,
        });
      }

      return producto;
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error al consultar el producto con SKU '${sku}'`,
        error: ERROR_CODES.ERROR_INTERNO,
      });
    }
  }

  async findAll(
    id_vendedor: number,
    queryDto: QueryProductoDto,
  ): Promise<PageDto<GetProductoDto>> {
    if (
      queryDto.precio_max &&
      queryDto.precio_min &&
      queryDto.precio_max < queryDto.precio_min
    ) {
      throw new BadRequestException(
        'El precio mínimo no puede ser mayor que el precio máximo',
      );
    }

    const where: Prisma.ProductoWhereInput = {
      tienda: { id_vendedor },
      ...(queryDto.disponible !== undefined && {
        disponible: queryDto.disponible,
      }),
      ...(queryDto.id_tienda && { id_tienda: queryDto.id_tienda }),
      ...(queryDto.precio_min || queryDto.precio_max
        ? {
            precio: {
              ...(queryDto.precio_min && { gte: queryDto.precio_min }),
              ...(queryDto.precio_max && { lte: queryDto.precio_max }),
            },
          }
        : {}),
    };

    try {
      const [productos, counter] = await Promise.all([
        this.prisma.producto.findMany({
          skip: queryDto.skip,
          take: queryDto.take,
          where,
          orderBy: { id_tienda: queryDto.order },
        }),
        this.prisma.producto.count({ where }),
      ]);

      if (productos.length) {
        throw new NotFoundException({
          message: 'No existen productos registrados',
          error: PRODUCTO_ERROR_CODES.INVENTARIO_VACIO,
        });
      }

      const pageMetaDto = new PageMetaDto({
        pageOptionsDto: queryDto,
        itemCount: counter,
      });

      return new PageDto(productos, pageMetaDto);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error al consultar los productos',
        error: ERROR_CODES.ERROR_INTERNO,
      });
    }
  }
}
