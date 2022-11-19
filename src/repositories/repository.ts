import { Service } from 'typedi';
import { Model } from 'mongoose';

import { DatabaseErrorMessages } from '../constants/ErrorMessages';
import { DatabaseError, NotFoundError } from '../errors/base.error';
import { handleMongoError } from '../errors/handleMongoError';

import { replaceIds } from '../utils/replaceIds';
import { ObjectId } from '../types/ObjectId';

@Service({ transient: true })
export class BaseRepository<T> {
  protected readonly BaseModel: Model<T>;

  protected readonly modelName: string;

  constructor(mongooseModel: Model<T>) {
    this.BaseModel = mongooseModel;
    this.modelName = this.BaseModel.modelName;
  }

  async findById(objectId: ObjectId): Promise<T> {
    let obj: T | null;
    try {
      obj = (await this.BaseModel.findById(objectId).lean()) as T;
    } catch (error) {
      handleMongoError(error);
      obj = null;
    }
    if (!obj) {
      throw new NotFoundError(`${this.modelName} with id ${objectId} does not exist`);
    }
    return replaceIds(obj) as T;
  }

  async findOne(params: Object): Promise<T> {
    let obj: T | null;
    try {
      obj = (await this.BaseModel.findOne(params).lean()) as T;
    } catch (error) {
      handleMongoError(error);
      obj = null;
    }
    if (!obj) {
      throw new NotFoundError(`${this.modelName} with provided properties does not exist`);
    }
    return replaceIds(obj) as T;
  }

  async findMany(params: Object, sort: any): Promise<T[]> {
    let objs: T[] | null;
    try {
      objs = (await this.BaseModel.find(params).sort(sort).lean()) as T[];
    } catch (error) {
      // Logger
      console.log(`WARNING: There was an error while finding ${this.modelName}s`);
      objs = [];
    }
    return objs.map((obj: T) => replaceIds(obj) as T);
  }

  async create(object: T): Promise<T> {
    const dbObj = new this.BaseModel(object);
    try {
      await dbObj.save();
    } catch (error: any) {
      handleMongoError(error);
      throw new DatabaseError(
        DatabaseErrorMessages.COULD_NOT_SAVE,
        error.message ?? `There was an error while creating the ${this.modelName}`
      );
    }

    return replaceIds(dbObj.toObject()) as T;
  }

  async deleteById(objectId: ObjectId): Promise<void> {
    try {
      await this.BaseModel.findByIdAndDelete(objectId);
    } catch (error: any) {
      handleMongoError(error);
      throw new DatabaseError(
        DatabaseErrorMessages.COULD_NOT_SAVE,
        error.message ?? `There was an error while deleting the ${this.modelName}`
      );
    }
  }

  async update(object: any): Promise<T> {
    const { _id: objectId, ...obj } = object;
    let dbObj: T;
    try {
      dbObj = await this.BaseModel.findByIdAndUpdate(objectId, obj, {
        new: true,
        runValidators: true
      }).lean();
    } catch (error: any) {
      handleMongoError(error);
      throw new DatabaseError(
        DatabaseErrorMessages.COULD_NOT_SAVE,
        error.message ?? `There was an error while updating the ${this.modelName}`
      );
    }
    if (!dbObj) {
      throw new DatabaseError(`${this.modelName} with id ${objectId} does not exist`);
    }
    return replaceIds(dbObj) as T;
  }
}
