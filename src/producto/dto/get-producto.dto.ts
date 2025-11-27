import { ApiProperty } from '@nestjs/swagger';
import { Categoria, Condicion } from 'generated/prisma';

export class GetProductoDto {
  @ApiProperty()
  readonly id_producto: number;

  @ApiProperty()
  readonly id_tienda: number;

  @ApiProperty()
  readonly nombre: string;

  @ApiProperty()
  readonly stock: number;

  @ApiProperty()
  readonly costo: number;

  @ApiProperty()
  readonly sku: string;

  @ApiProperty()
  readonly condicion: Condicion;

  @ApiProperty()
  readonly fecha_creacion: Date;

  @ApiProperty()
  readonly marca: string;

  @ApiProperty()
  readonly categoria: Categoria;

  @ApiProperty()
  readonly descripcion: string;

  @ApiProperty()
  readonly foto_referencia: string;

  @ApiProperty()
  readonly peso: number;

  @ApiProperty()
  readonly largo: number;

  @ApiProperty()
  readonly alto: number;

  @ApiProperty()
  readonly ancho: number;
}
