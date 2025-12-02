import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  IsNumber,
  Max,
} from 'class-validator';
import { ErrorCode } from 'src/common/decorators/error-code.decorator';
import { PRODUCTO_ERROR_CODES } from '../constants/error-codes';
import { TIENDA_ERROR_CODES } from 'src/tienda/constants/error-codes';
import { ERROR_CODES } from 'src/common/constants/error-codes';
import { categoria_enum, condicion_enum } from 'generated/prisma';

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

export class CreateProductoDto {
  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'id_tienda es requerido' })
  @IsInt({ message: 'id_tienda debe ser un número entero' })
  @IsPositive({ message: 'id_tienda debe ser al menos 1' })
  @ErrorCode(TIENDA_ERROR_CODES.ID_TIENDA_INVALIDO)
  id_tienda: number;

  @IsDefined({ message: 'Nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 carácteres' })
  @Transform(({ value }) => value?.trim())
  @ErrorCode(ERROR_CODES.NOMBRE_INVALIDO)
  nombre: string;

  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'Stock es requerido' })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @IsPositive({ message: 'El stock debe ser al menos 1' })
  @ErrorCode(PRODUCTO_ERROR_CODES.STOCK_INVALIDO)
  stock: number;

  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'Costo es requerido' })
  @IsInt({ message: 'El costo debe ser un número entero' })
  @IsPositive({ message: 'El costo debe ser al menos 1' })
  @ErrorCode(PRODUCTO_ERROR_CODES.PRECIO_INVALIDO)
  costo: number;

  @IsOptional()
  @Transform(({ value }) => value?.trim().toUpperCase())
  @IsEnum(condicion_enum, {
    message: `La condicion debe ser una de las siguientes opciones: [${Object.values(condicion_enum).join(', ')}]`,
  })
  @ErrorCode(ERROR_CODES.NOMBRE_INVALIDO)
  condicion?: condicion_enum = condicion_enum.NUEVO;

  @IsOptional()
  @IsString({ message: 'La marca debe ser un string' })
  @Length(3, 50, { message: 'La marca debe tener entre 3 y 50 carácteres' })
  @Transform(({ value }) => value?.trim())
  @ErrorCode(ERROR_CODES.NOMBRE_INVALIDO)
  marca?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim().toUpperCase())
  @IsEnum(categoria_enum, {
    message: `La categoria debe ser una de las siguientes opciones: [${Object.values(categoria_enum).join(', ')}]`,
  })
  @ErrorCode(ERROR_CODES.NOMBRE_INVALIDO)
  categoria?: categoria_enum = categoria_enum.GENERAL;

  @IsOptional()
  @IsString({ message: 'La descripcion debe ser un string' })
  @Length(3, 1000, {
    message: 'La descripcion debe tener entre 3 y 1000 carácteres',
  })
  @Transform(({ value }) => value?.trim())
  @ErrorCode(ERROR_CODES.NOMBRE_INVALIDO)
  descripcion?: string;

  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'Peso es requerido' })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    { message: 'El peso debe ser un número con máximo 1 decimal' },
  )
  @IsPositive({ message: 'El peso debe ser mayor a 0' })
  @Max(999.9, { message: 'El peso no puede ser mayor a 999.9' })
  @ErrorCode(ERROR_CODES.NUMERO_INVALIDO)
  peso: number;

  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'Alto es requerido' })
  @IsInt({ message: 'El alto debe ser un número entero' })
  @IsPositive({ message: 'El alto debe ser mayor a 0' })
  @ErrorCode(ERROR_CODES.NUMERO_INVALIDO)
  alto: number;

  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'Largo es requerido' })
  @IsInt({ message: 'El largo debe ser un número entero' })
  @IsPositive({ message: 'El largo debe ser mayor a 0' })
  @ErrorCode(ERROR_CODES.NUMERO_INVALIDO)
  largo: number;

  @Transform(({ value }) => toNumber(value))
  @IsDefined({ message: 'Ancho es requerido' })
  @IsInt({ message: 'El ancho debe ser un número entero' })
  @IsPositive({ message: 'El ancho debe ser mayor a 0' })
  @ErrorCode(ERROR_CODES.NUMERO_INVALIDO)
  ancho: number;
}
