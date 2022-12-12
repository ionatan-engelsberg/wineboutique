import { Service } from 'typedi';

import { BaseRepository } from './repository';

import { SpecialModel } from '../database/Special';
import { Special } from '../interfaces';

@Service({ transient: true })
export class SpecialRepository extends BaseRepository<Special> {
  constructor() {
    super(SpecialModel);
  }
}
