import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { ErrorCode } from 'src/common/decorators/error-code.decorator';
import { TIENDA_ERROR_CODES } from '../constants/error-codes';
import { ERROR_CODES } from 'src/common/constants/error-codes';

const trim = (value: unknown) =>
  typeof value === 'string' ? value.trim() : value;

const toBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  const v = String(value).trim().toLowerCase();
  if (v === '0' || v === 'false') return false;
  if (v === '1' || v === 'true') return true;
  return undefined;
};

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

export class CreateTiendaDto {
  @Transform(({ value }) => trim(value))
  @IsNotEmpty({ message: 'nombre es requerido' })
  @IsString({ message: 'nombre debe ser texto' })
  @MaxLength(100, { message: 'nombre no puede superar los 100 caracteres' })
  @ErrorCode(TIENDA_ERROR_CODES.NOMBRE_INVALIDO)
  nombre: string;

  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'id_ciudad es requerido' })
  @IsInt({ message: 'id_ciudad debe ser un número entero' })
  @IsPositive({ message: 'id_ciudad debe ser mayor que 0' })
  @ErrorCode(TIENDA_ERROR_CODES.CIUDAD_INVALIDA)
  id_ciudad: number;

  @Transform(({ value }) => trim(value))
  @IsNotEmpty({ message: 'descripcion es requerido' })
  @IsString({ message: 'descripcion debe ser texto' })
  @MaxLength(200, {
    message: 'descripcion no puede superar los 200 caracteres',
  })
  @ErrorCode(TIENDA_ERROR_CODES.DESCRIPCION_INVALIDA)
  descripcion: string;

  @Transform(({ value }) => trim(value))
  @IsNotEmpty({ message: 'direccion es requerido' })
  @IsString({ message: 'direccion debe ser texto' })
  @ErrorCode(TIENDA_ERROR_CODES.DIRECCION_INVALIDA)
  direccion: string;

  @Transform(({ value }) => trim(value))
  @IsNotEmpty({ message: 'telefono es requerido' })
  @IsString({ message: 'telefono debe ser texto' })
  @ErrorCode(TIENDA_ERROR_CODES.TELEFONO_INVALIDO)
  telefono: string;

  @Transform(({ value }) => toBoolean(value))
  @IsDefined({ message: 'online es requerido' })
  @IsBoolean({ message: 'online debe ser booleano' })
  @ErrorCode(TIENDA_ERROR_CODES.ONLINE_INVALIDO)
  online: boolean;
}
