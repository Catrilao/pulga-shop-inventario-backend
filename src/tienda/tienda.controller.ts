import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('tiendas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}

  @Post()
  @Roles('vendedor')
  create(
    @Body() createTiendaDto: CreateTiendaDto,
    @CurrentUser('id') id_vendedor: number,
  ) {
    return this.tiendaService.create(createTiendaDto, id_vendedor);
  }
}
