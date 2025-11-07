import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ErrorCode } from 'src/common/decorators/error-code.decorator';
import { TIENDA_ERROR_CODES } from '../constants/error-codes';

const trim = (value: unknown) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateTiendaDto {
  @Transform(({ value }) => trim(value))
  @IsNotEmpty({ message: 'nombre es requerido' })
  @IsString({ message: 'nombre debe ser texto' })
  @MaxLength(100, { message: 'nombre no puede superar los 100 caracteres' })
  @ErrorCode(TIENDA_ERROR_CODES.NOMBRE_INVALIDO)
  nombre: string;

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
  @IsOptional()
  @IsString({ message: 'telefono debe ser texto' })
  @ErrorCode(TIENDA_ERROR_CODES.TELEFONO_INVALIDO)
  telefono?: string;
}
