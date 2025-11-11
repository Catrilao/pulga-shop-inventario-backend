import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProductoService } from './producto.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateProductoDto } from './dto/create-producto.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PageDto } from 'src/common/dto/page.dto';
import { GetProductoDto } from './dto/get-producto.dto';
import { QueryProductoDto } from './dto/query-producto.dto';
import { Public } from 'src/auth/decorators/is-public.decorator';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @Roles('vendedor')
  async create(@Body() createProductoDto: CreateProductoDto) {
    return await this.productoService.create(createProductoDto);
  }

  @Get(':sku')
  @HttpCode(HttpStatus.OK)
  @Public()
  async findOne(@Param('sku') sku: string): Promise<GetProductoDto> {
    return this.productoService.findOne(String(sku));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('vendedor')
  async findAll(
    @CurrentUser('id') id_vendedor: number,
    @Query() queryProductoDto: QueryProductoDto,
  ): Promise<PageDto<GetProductoDto>> {
    return this.productoService.findAll(id_vendedor, queryProductoDto);
  }

  @Patch(':sku')
  @Roles('vendedor')
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser('id') id_vendedor: number,
    @Param('sku') sku: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ): Promise<GetProductoDto> {
    return this.productoService.update(id_vendedor, sku, updateProductoDto);
  }
}
