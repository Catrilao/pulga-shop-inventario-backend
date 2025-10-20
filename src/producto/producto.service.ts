import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductoService {
  constructor(private prisma: PrismaService) {}

  async create(createProductoDto: CreateProductoDto) {
    if (createProductoDto.stock <= 0) {
      throw new Error('El stock inicial debe ser mayor a 0');
    }

    if (
      createProductoDto.precio <= 0 ||
      !Number.isInteger(createProductoDto.precio)
    ) {
      throw new Error('El precio debe ser un número entero mayor a 0');
    }

    const { disponible, id_tienda, ...losDemas } = createProductoDto;

    const tiendaExiste = await this.prisma.tienda.findUnique({
      where: { id_tienda },
    });
    if (!tiendaExiste) {
      throw new Error('La tienda no existe');
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
