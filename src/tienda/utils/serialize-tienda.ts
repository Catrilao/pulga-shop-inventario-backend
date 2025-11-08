import { GetTiendaDto } from '../dto/get-tienda.dto';

export function serializeTienda(tienda: {
  id_tienda: number;
  id_vendedor: bigint;
  nombre: string;
  direccion: string;
  descripcion: string;
  telefono: string;
  fecha_creacion: Date;
}): GetTiendaDto {
  return {
    ...tienda,
    id_vendedor: Number(tienda.id_vendedor),
    fecha_creacion: tienda.fecha_creacion.toISOString(),
  };
}
