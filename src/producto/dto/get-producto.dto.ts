import { ApiProperty } from '@nestjs/swagger';
import { Categoria, Condicion } from 'generated/prisma';

export class GetProductoDto {
  @ApiProperty()
  id_producto: number;

  @ApiProperty()
  id_tienda: number;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  costo: number;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  condicion: Condicion;

  @ApiProperty()
  fecha_creacion: Date;

  @ApiProperty()
  marca: string;

  @ApiProperty()
  categoria: Categoria;

  @ApiProperty()
  descripcion: string;
}
