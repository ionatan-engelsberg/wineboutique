import { IsBoolean, IsNumber, IsObject, IsOptional, Min } from 'class-validator';

export class GetProductsFilters {
  @IsNumber()
  @Min(1)
  offset!: number;

  @IsOptional()
  @IsBoolean()
  outlined?: boolean;
}

export class GetProductsDTO {
  @IsObject()
  filters!: GetProductsFilters;
}
