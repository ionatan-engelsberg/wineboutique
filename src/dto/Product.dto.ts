import { IsBoolean, IsOptional } from 'class-validator';

export class GetProductsFilters {
  @IsOptional()
  @IsBoolean()
  outlined?: boolean;
}
