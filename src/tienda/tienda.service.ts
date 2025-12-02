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
import { UserRoles } from 'src/common/interfaces/user.roles.interface';

@Injectable()
export class TiendaService {
  constructor(private prisma: PrismaService) {}

  async create(
    createTiendaDto: CreateTiendaDto,
    id_vendedor: string,
  ): Promise<GetTiendaDto> {
    const ciudadExiste = await this.prisma.ciudad.findUnique({
      where: { id_ciudad: createTiendaDto.id_ciudad },
    });
    if (!ciudadExiste) {
      throw new NotFoundException({
        message: `La ciudad con el ID: '${createTiendaDto.id_ciudad}' no existe`,
        error: TIENDA_ERROR_CODES.CIUDAD_NO_EXISTE,
      });
    }

    const exists = await this.prisma.tienda.findFirst({
      where: { nombre: createTiendaDto.nombre, activo: true },
    });
    if (exists) {
      throw new ConflictException({
        message: `Tienda con el nombre: "${createTiendaDto.nombre}" ya existe`,
        error: TIENDA_ERROR_CODES.TIENDA_YA_EXISTE,
      });
    }

    const tienda = await this.prisma.tienda.create({
      data: {
        ...createTiendaDto,
        id_vendedor,
      },
    });

    return serializeTienda(tienda);
  }

  async findOne(id_tienda: number): Promise<GetTiendaDto> {
    const tienda = await this.prisma.tienda.findUnique({
      where: { id_tienda, activo: true },
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
    id_vendedor: string,
    roles: UserRoles,
  ): Promise<PageDto<GetTiendaDto>> {
    const where = roles.esAdministrador
      ? { activo: true }
      : { id_vendedor, activo: true };

    const [tiendas, itemCount] = await Promise.all([
      this.prisma.tienda.findMany({
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        where,
        orderBy: { fecha_creacion: pageOptionsDto.order },
      }),
      this.prisma.tienda.count({ where }),
    ]);

    const tiendasDto: GetTiendaDto[] = tiendas.map((tienda) =>
      serializeTienda(tienda),
    );

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(tiendasDto, pageMetaDto);
  }
}
