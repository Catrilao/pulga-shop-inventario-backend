import { ApiProperty } from '@nestjs/swagger';
import { categoria_enum, condicion_enum } from 'generated/prisma';
import { Decimal } from 'generated/prisma/runtime/library';

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
  readonly condicion: condicion_enum;

  @ApiProperty()
  readonly fecha_creacion: Date;

  @ApiProperty()
  readonly marca: string;

  @ApiProperty()
  readonly categoria: categoria_enum;

  @ApiProperty()
  readonly descripcion: string;

  @ApiProperty()
  readonly foto_referencia: string;

  @ApiProperty()
  readonly peso: Decimal;

  @ApiProperty()
  readonly largo: number;

  @ApiProperty()
  readonly alto: number;

  @ApiProperty()
  readonly ancho: number;
}
