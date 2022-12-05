import { ObjectId } from '../types/ObjectId';

export interface Newsletter {
  _id?: ObjectId;

  emails: string[];
}
