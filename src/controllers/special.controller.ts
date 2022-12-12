import { Service } from 'typedi';
import { Get, HttpCode, JsonController, Post, QueryParams } from 'routing-controllers';

import { HttpStatusCode } from '../constants/HttpStatusCodes';

import { SpecialAdapter } from '../adapters/special.adapter';
import { CreateTestSpecialsDTO, GetAllSpecialsOfACategoryDTO } from '../dto/Special.dto';

@JsonController('/specials')
@Service({ transient: true })
export class SpecialController {
  constructor(private readonly _specialAdapter: SpecialAdapter) {}

  @HttpCode(HttpStatusCode.CREATED)
  @Post('/test')
  async createTestOpportunities(@QueryParams() dto: CreateTestSpecialsDTO) {
    await this._specialAdapter.createTestOpportunities(dto);
  }

  @Get()
  async getAllSpecialsOfACategory(
    @QueryParams({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    dto: GetAllSpecialsOfACategoryDTO
  ) {
    return this._specialAdapter.getAllSpecialsOfACategory(dto);
  }
}
