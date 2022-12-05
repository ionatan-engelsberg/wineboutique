import { Service } from 'typedi';
import mongoose, { Model } from 'mongoose';

import { DatabaseErrorMessages } from '../constants/ErrorMessages';
import { DatabaseError, NotFoundError } from '../errors/base.error';
import { handleMongoError } from '../errors/handleMongoError';

import { replaceIds } from '../utils/replaceIds';
import { ObjectId } from '../types/ObjectId';
import { logErrors } from '../utils/logger';
import { FindManyOptions } from '../types/Repository.types';

@Service({ transient: true })
export class BaseRepository<T> {
  protected readonly BaseModel: Model<T>;

  protected readonly modelName: string;

  constructor(mongooseModel: Model<T>) {
    this.BaseModel = mongooseModel;
    this.modelName = this.BaseModel.modelName;
  }

  async findById(objectId: ObjectId, fields?: string): Promise<T> {
    let obj: T | null;
    try {
      obj = (await this.BaseModel.findById(objectId).select(fields).lean()) as T;
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

  async findMany(params: Object, options?: FindManyOptions): Promise<T[]> {
    let objs: T[] | null;
    try {
      objs = (await this.BaseModel.find(params)
        .sort(options?.sort)
        .skip(options?.offset as number)
        .limit(options?.limit as number)
        .lean()) as T[];
    } catch (error) {
      console.log(`WARNING: There was an error while finding ${this.modelName}s`);
      logErrors(error);
      objs = [];
    }
    return objs.map((obj: T) => replaceIds(obj) as T);
  }

  async countDocuments(params: Object): Promise<number> {
    let count: number | undefined;
    try {
      count = await this.BaseModel.countDocuments(params);
    } catch (error) {
      console.log(`WARNING: There was an error while counting ${this.modelName}s`);
      logErrors(error);
      count = 0;
    }
    return count;
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

  async createSessionForTransaction() {
    return mongoose.startSession();
  }
}
