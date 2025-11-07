import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TIENDA_ERROR_CODES } from './constants/error-codes';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { GetTiendaDto } from './dto/get-tienda.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { serializeTienda } from './utils/serialize-tienda';

@Injectable()
export class TiendaService {
  constructor(private prisma: PrismaService) {}

  async create(createTiendaDto: CreateTiendaDto, id_vendedor: number) {
    const exists = await this.prisma.tienda.findFirst({
      where: { nombre: createTiendaDto.nombre },
    });

    if (exists) {
      throw new ConflictException({
        message: `Vendedor ya tiene una tienda con el nombre: "${createTiendaDto.nombre}"`,
        error: TIENDA_ERROR_CODES.TIENDA_YA_EXISTE,
      });
    }

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

  async findOne(id_tienda: number) {
    const tienda = await this.prisma.tienda.findUnique({
      where: { id_tienda },
    });

    if (!tienda) {
      throw new NotFoundException({
        message: 'Tienda no existe',
        error: TIENDA_ERROR_CODES.TIENDA_NO_ENCONTRADA,
      });
    }

    return serializeTienda(tienda);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    id_vendedor: number
  ): Promise<PageDto<GetTiendaDto>> {
    const [tiendas, itemCount] = await Promise.all([
      this.prisma.tienda.findMany({
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        where: { id_vendedor },
        orderBy: { fecha_creacion: pageOptionsDto.order },
      }),
      this.prisma.tienda.count(),
    ]);

    const tiendasDto: GetTiendaDto[] = tiendas.map((tienda) => (serializeTienda(tienda)));

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(tiendasDto, pageMetaDto);
  }
}
