import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/is-public.decorator';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { GetTiendaDto } from './dto/get-tienda.dto';

@Controller('tiendas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}

  @Post()
  @Roles('vendedor')
  async create(
    @Body() createTiendaDto: CreateTiendaDto,
    @CurrentUser('id') id_vendedor: number,
  ) {
    return await this.tiendaService.create(createTiendaDto, id_vendedor);
  }

  @Get(':id_tienda')
  @HttpCode(HttpStatus.OK)
  @Public()
  async findOne(@Param('id_tienda') id_tienda: number) {
    return this.tiendaService.findOne(Number(id_tienda));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('vendedor')
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @CurrentUser('id') id_vendedor: number,
  ): Promise<PageDto<GetTiendaDto>> {
    return this.tiendaService.findAll(pageOptionsDto, id_vendedor);
  }
}
