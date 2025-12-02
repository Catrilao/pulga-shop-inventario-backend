import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { CurrentUserRoles } from 'src/auth/decorators/current-user-roles.decorator';
import { UserRoles } from 'src/common/interfaces/user.roles.interface';

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  @Roles('vendedor', 'administrador')
  async create(
    @Body() createProductoDto: CreateProductoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.productoService.create(createProductoDto, file);
  }

  @Get(':sku')
  @HttpCode(HttpStatus.OK)
  @Public()
  async findOne(@Param('sku') sku: string): Promise<GetProductoDto> {
    return this.productoService.findOne(String(sku));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('vendedor', 'administrador')
  async findAll(
    @CurrentUser('id') id_vendedor: string,
    @CurrentUserRoles() roles: UserRoles,
    @Query() queryProductoDto: QueryProductoDto,
  ): Promise<PageDto<GetProductoDto>> {
    return this.productoService.findAll(id_vendedor, queryProductoDto, roles);
  }

  @Patch(':sku')
  @Roles('vendedor', 'administrador')
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser('id') id_vendedor: string,
    @Param('sku') sku: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ): Promise<GetProductoDto> {
    return this.productoService.update(id_vendedor, sku, updateProductoDto);
  }

  @Delete(':sku')
  @Roles('vendedor', 'administrador')
  @HttpCode(HttpStatus.OK)
  async delete(
    @CurrentUser('id') id_vendedor: string,
    @Param('sku') sku: string,
  ): Promise<void> {
    await this.productoService.delete(id_vendedor, sku);
  }
}
