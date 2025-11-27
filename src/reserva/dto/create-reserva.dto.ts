import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsPositive,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ErrorCode } from 'src/common/decorators/error-code.decorator';
import { RESERVA_ERROR_CODES } from '../constants/error-codes';
import { ERROR_CODES } from 'src/common/constants/error-codes';

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

export class ReservaItemDto {
  @IsDefined({ message: 'El SKU es requerido' })
  @IsString({ message: 'El SKU debe ser un string' })
  @Length(3, 50, { message: 'El SKU debe tener entre 3 y 50 caracteres' })
  @Transform(({ value }) => value?.trim())
  @ErrorCode(RESERVA_ERROR_CODES.SKU_INVALIDO)
  sku: string;

  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'La cantidad reservada es requerida' })
  @IsInt({ message: 'La cantidad reservada debe ser un número entero' })
  @IsPositive({ message: 'La cantidad reservada debe ser mayor a 0' })
  @ErrorCode(ERROR_CODES.NUMERO_INVALIDO)
  cantidad_reservada: number;
}

export class CreateReservaDto {
  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'El ID de la orden es requerido' })
  @IsInt({ message: 'El ID de la orden debe ser un numero entero' })
  @IsPositive({ message: 'El ID de la orden debe ser mayor a 0' })
  @ErrorCode(RESERVA_ERROR_CODES.ID_ORDEN_INVALIDA)
  id_orden: number;

  @IsDefined({ message: 'Los items son requeridos' })
  @IsArray({ message: 'Los items deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => ReservaItemDto)
  @ErrorCode(RESERVA_ERROR_CODES.ITEMS_INVALIDOS)
  items: ReservaItemDto[];
}
