import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { ErrorCode } from 'src/common/decorators/error-code.decorator';
import { PRODUCTO_ERROR_CODES } from '../constants/error-codes';
import { TIENDA_ERROR_CODES } from 'src/tienda/constants/error-codes';

const toNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') {
    const str = value.trim();
    if (str === '') return undefined;
    const num = Number(str);
    return Number.isFinite(num) ? num : undefined;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const toBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  const v = String(value).trim().toLowerCase();
  if (v === '0' || v === 'false') return false;
  if (v === '1' || v === 'true') return true;
  return undefined;
};

export class CreateProductoDto {
  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'Stock es requerido' })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @IsPositive({ message: 'El stock debe ser al menos 1' })
  @ErrorCode(PRODUCTO_ERROR_CODES.STOCK_INVALIDO)
  stock: number;

  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'id_tienda es requerido' })
  @IsInt({ message: 'id_tienda debe ser un número entero' })
  @IsPositive({ message: 'id_tienda debe ser al menos 1' })
  @ErrorCode(TIENDA_ERROR_CODES.ID_TIENDA_INVALIDO)
  id_tienda: number;

  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'Precio es requerido' })
  @IsInt({ message: 'El precio debe ser un número entero' })
  @IsPositive({ message: 'El precio debe ser al menos 1' })
  @ErrorCode(PRODUCTO_ERROR_CODES.PRECIO_INVALIDO)
  precio: number;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean({ message: 'disponible debe ser booleano' })
  @IsOptional()
  @ErrorCode(PRODUCTO_ERROR_CODES.DISPONIBILIDAD_INVALIDA)
  disponible?: boolean;
}
