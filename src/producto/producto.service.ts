import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { TIENDA_ERROR_CODES } from 'src/tienda/constants/error-codes';
import { GetProductoDto } from './dto/get-producto.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { QueryProductoDto } from './dto/query-producto.dto';
import { ERROR_CODES } from 'src/common/constants/error-codes';
import { Prisma } from 'generated/prisma';
import { PRODUCTO_ERROR_CODES } from './constants/error-codes';
import { generateSKU } from './utils/generate-sku';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserRoles } from 'src/common/interfaces/user.roles.interface';

@Injectable()
export class ProductoService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    createProductoDto: CreateProductoDto,
    file?: Express.Multer.File,
  ) {
    const { id_tienda, ...losDemas } = createProductoDto;

    const tiendaExiste = await this.prisma.tienda.findUnique({
      where: { id_tienda: Number(createProductoDto.id_tienda) }, 
    });
    if (!tiendaExiste) {
      throw new NotFoundException({
        message: 'La tienda no existe',
        error: TIENDA_ERROR_CODES.TIENDA_NO_EXISTE,
      });
    }

    const sku = generateSKU(
      createProductoDto.id_tienda,
      createProductoDto.nombre,
      createProductoDto.marca,
      createProductoDto.categoria,
      createProductoDto.condicion,
    );

    const productoExiste = await this.prisma.producto.findUnique({
      where: { sku },
    });
    if (productoExiste) {
      throw new ConflictException({
        message: `Producto con SKU: '${sku}' ya existe`,
        error: PRODUCTO_ERROR_CODES.PRODUCTO_YA_EXISTE,
      });
    }

    let foto_referencia: string | undefined = null;
    if (file) {
      foto_referencia = await this.cloudinary.uploadImage(file);
    }

    return await this.prisma.producto.create({
      data: {
        sku,
        tienda: { connect: { id_tienda } },
        ...losDemas,
        ...(foto_referencia && { foto_referencia }),
      },
    });
  }

  async findOne(sku: string): Promise<GetProductoDto> {
    try {
      const producto = await this.prisma.producto.findUnique({
        where: {
          sku,
          activo: true,
        },
      });

      if (!producto) {
        throw new NotFoundException({
          message: `Producto con SKU '${sku}' no encontrado`,
          code: ERROR_CODES.NO_ENCONTRADO,
        });
      }

      return producto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: `Error al consultar el producto con SKU '${sku}'`,
        error: ERROR_CODES.ERROR_INTERNO,
      });
    }
  }

  async findAll(
    id_vendedor: string,
    queryDto: QueryProductoDto,
    roles: UserRoles,
  ): Promise<PageDto<GetProductoDto>> {
    if (
      queryDto.costo_max &&
      queryDto.costo_min &&
      queryDto.costo_max < queryDto.costo_min
    ) {
      throw new BadRequestException({
        message: 'El costo mínimo no puede ser mayor que el costo máximo',
        error: PRODUCTO_ERROR_CODES.PRECIO_INVALIDO,
      });
    }

    const where: Prisma.ProductoWhereInput = {
      ...(queryDto.activo === 'true' || queryDto.activo === undefined
        ? { activo: true }
        : queryDto.activo === 'false'
          ? { activo: false }
          : {}),
      ...(roles.esAdministrador ? {} : { tienda: { id_vendedor } }),
      ...(queryDto.id_tienda && { id_tienda: queryDto.id_tienda }),
      ...(queryDto.costo_min || queryDto.costo_max
        ? {
            costo: {
              ...(queryDto.costo_min && { gte: queryDto.costo_min }),
              ...(queryDto.costo_max && { lte: queryDto.costo_max }),
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
          orderBy: { fecha_creacion: queryDto.order },
        }),
        this.prisma.producto.count({ where }),
      ]);

      const pageMetaDto = new PageMetaDto({
        pageOptionsDto: queryDto,
        itemCount: counter,
      });

      return new PageDto(productos, pageMetaDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: 'Error al consultar los productos',
        error: ERROR_CODES.ERROR_INTERNO,
      });
    }
  }

  async update(
    id_vendedor: string,
    sku: string,
    updateProductoDto: UpdateProductoDto,
  ) {
    const producto = await this.prisma.producto.findUnique({
      where: {
        sku,
        activo: true,
      },
      include: { tienda: true },
    });
    if (!producto) {
      throw new NotFoundException({
        message: `El producto con SKU ${sku} no existe`,
        error: ERROR_CODES.NO_ENCONTRADO,
      });
    }

    if (producto.tienda.id_vendedor !== id_vendedor) {
      throw new BadRequestException({
        message: 'No tienes permisos para actualizar este producto',
        error: ERROR_CODES.NO_AUTORIZADO,
      });
    }

    if (updateProductoDto.stock !== undefined && updateProductoDto.stock < 0) {
      throw new BadRequestException({
        message: 'El stock no puede ser negativo',
        error: PRODUCTO_ERROR_CODES.STOCK_INVALIDO,
      });
    }

    if (updateProductoDto.costo !== undefined && updateProductoDto.costo < 0) {
      throw new BadRequestException({
        message: 'El precio no puede ser negativo',
        error: PRODUCTO_ERROR_CODES.PRECIO_INVALIDO,
      });
    }

    const updatedProducto = await this.prisma.producto.update({
      where: {
        sku,
        activo: true,
      },
      data: updateProductoDto,
    });

    return updatedProducto;
  }

  async delete(id_vendedor: string, sku: string): Promise<void> {
    const producto = await this.prisma.producto.findUnique({
      where: { sku, activo: true },
      include: { tienda: true },
    });

    if (!producto) {
      throw new NotFoundException({
        message: `El producto con SKU ${sku} no existe`,
        error: ERROR_CODES.NO_ENCONTRADO,
      });
    }

    if (producto.tienda.id_vendedor !== id_vendedor) {
      throw new BadRequestException({
        message: 'No tienes permisos para eliminar este producto',
        error: ERROR_CODES.NO_AUTORIZADO,
      });
    }

    try {
      await this.prisma.producto.update({
        where: { sku },
        data: { activo: false },
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error al eliminar producto',
        error: ERROR_CODES.ERROR_INTERNO,
      });
    }
  }
}