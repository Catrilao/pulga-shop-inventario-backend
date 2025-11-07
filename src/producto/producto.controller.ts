import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProductoService } from './producto.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateProductoDto } from './dto/create-producto.dto';

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @Roles('vendedor')
  async create(@Body() createProductoDto: CreateProductoDto) {
    return await this.productoService.create(createProductoDto);
  }
}
