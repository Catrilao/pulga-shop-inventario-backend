import { Injectable } from '@nestjs/common';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TiendaService {
  constructor(private prisma: PrismaService) {}

  async create(createTiendaDto: CreateTiendaDto, id_vendedor: number) {
    const tienda = await this.prisma.tienda.create({
      data: {
        ...createTiendaDto,
        id_vendedor,
      },
    });

    return {
      ...tienda,
      id_vendedor: tienda.id_vendedor.toString(),
    };
  }
}
