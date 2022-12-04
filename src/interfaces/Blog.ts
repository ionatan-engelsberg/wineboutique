import { ObjectId } from '../types/ObjectId';

export interface Blog {
  _id?: ObjectId;

  title: string;

  text: string;

  image?: string;

  dateCreated: Date;
}
