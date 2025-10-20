import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateProductoDto {
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  id_tienda: number;

  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @IsBoolean()
  @IsOptional()
  disponible: boolean;
}
