import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';

const toBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  const v = String(value).trim().toLowerCase();
  if (v === '0' || v === 'false') return false;
  if (v === '1' || v === 'true') return true;
  return undefined;
};

export class QueryProductoDto extends PageOptionsDto {
  @IsOptional()
  @IsEnum(['true', 'false', 'all'])
  activo?: 'true' | 'false' | 'all';

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id_tienda?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  costo_min?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  costo_max?: number;
}
