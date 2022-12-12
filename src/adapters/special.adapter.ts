import { Service } from 'typedi';

import { SpecialService } from '../services/special.service';

import { CreateTestSpecialsDTO, GetAllSpecialsOfACategoryDTO } from '../dto/Special.dto';

@Service({ transient: true })
export class SpecialAdapter {
  constructor(private readonly _specialService: SpecialService) {}

  async createTestOpportunities(dto: CreateTestSpecialsDTO) {
    await this._specialService.createTestSpecials(dto.category);
  }

  async getAllSpecialsOfACategory(dto: GetAllSpecialsOfACategoryDTO) {
    const { category } = dto;
    return this._specialService.getAllSpecialsOfACategory(category);
  }
}
