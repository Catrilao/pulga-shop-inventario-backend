import { ApiProperty } from '@nestjs/swagger';

export class GetTiendaDto {
  @ApiProperty({ example: 1 })
  id_tienda: number;

  @ApiProperty({ example: 123456789 })
  id_vendedor: number;

  @ApiProperty({ example: 'Tienda Ejemplo' })
  nombre: string;

  @ApiProperty({ example: 'Calle Falsa 123' })
  direccion: string;

  @ApiProperty({ example: 'Una tienda de ejemplo' })
  descripcion: string;

  @ApiProperty({ example: '9123456789' })
  telefono?: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2025-11-07T12:00:00Z',
  })
  fecha_creacion: string;
}
