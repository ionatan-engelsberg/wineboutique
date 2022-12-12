import { IsEnum } from 'class-validator';
import { SpecialCategory } from '../types/Special.types';

export class CreateTestSpecialsDTO {
  @IsEnum(SpecialCategory)
  category!: SpecialCategory;
}

export class GetAllSpecialsOfACategoryDTO {
  @IsEnum(SpecialCategory)
  category!: SpecialCategory;
}
