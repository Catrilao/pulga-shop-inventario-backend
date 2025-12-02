import { GetTiendaDto } from '../dto/get-tienda.dto';

export function serializeTienda(tienda: {
  id_tienda: number;
  id_vendedor: string;
  nombre: string;
  id_ciudad: number;
  direccion: string;
  descripcion: string;
  telefono: string;
  fecha_creacion: Date;
  online: boolean;
}): GetTiendaDto {
  return {
    ...tienda,
    fecha_creacion: tienda.fecha_creacion.toISOString(),
  };
}
