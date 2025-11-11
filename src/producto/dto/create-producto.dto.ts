import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { ErrorCode } from 'src/common/decorators/error-code.decorator';
import { PRODUCTO_ERROR_CODES } from '../constants/error-codes';
import { TIENDA_ERROR_CODES } from 'src/tienda/constants/error-codes';
import { ERROR_CODES } from 'src/common/constants/error-codes';
import { Categoria, Condicion } from 'generated/prisma';

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
  @IsDefined({ message: 'Precio es requerido' })
  @IsInt({ message: 'El precio debe ser un número entero' })
  @IsPositive({ message: 'El precio debe ser al menos 1' })
  @ErrorCode(PRODUCTO_ERROR_CODES.PRECIO_INVALIDO)
  precio: number;

  @IsOptional()
  @Transform(({ value }) => value?.trim().toUpperCase())
  @IsEnum(Condicion, {
    message: `La condicion debe ser una de las siguientes opciones: [${Object.values(Condicion).join(', ')}]`,
  })
  @ErrorCode(ERROR_CODES.NOMBRE_INVALIDO)
  condicion?: Condicion = Condicion.NUEVO;

  @IsOptional()
  @IsString({ message: 'La marca debe ser un string' })
  @Length(3, 50, { message: 'La marca debe tener entre 3 y 50 carácteres' })
  @Transform(({ value }) => value?.trim())
  @ErrorCode(ERROR_CODES.NOMBRE_INVALIDO)
  marca?: string = 'Genérica';

  @IsOptional()
  @Transform(({ value }) => value?.trim().toUpperCase())
  @IsEnum(Categoria, {
    message: `La categoria debe ser una de las siguientes opciones: [${Object.values(Condicion).join(', ')}]`,
  })
  @ErrorCode(ERROR_CODES.NOMBRE_INVALIDO)
  categoria?: Categoria = Categoria.GENERAL;

  @IsOptional()
  @IsString({ message: 'La descripcion debe ser un string' })
  @Length(3, 1000, {
    message: 'La descripcion debe tener entre 3 y 1000 carácteres',
  })
  @Transform(({ value }) => value?.trim())
  @ErrorCode(ERROR_CODES.NOMBRE_INVALIDO)
  descripcion?: string = 'Sin descripcion';
}
