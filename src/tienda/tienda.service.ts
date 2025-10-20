import { Injectable } from '@nestjs/common';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TiendaService {
  constructor(private prisma: PrismaService) {}

  async create(createTiendaDto: CreateTiendaDto, id_vendedor: number) {
    return this.prisma.tienda.create({
      data: {
        ...createTiendaDto,
        id_vendedor,
      },
    });
  }
}
