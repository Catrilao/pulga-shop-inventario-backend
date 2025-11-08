import { ApiProperty } from '@nestjs/swagger';

export class GetProductoDto {
  @ApiProperty()
  sku: string;

  @ApiProperty()
  id_tienda: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  precio: number;

  @ApiProperty()
  disponible: boolean;
}
