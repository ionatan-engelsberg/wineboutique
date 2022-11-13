import { Types } from 'mongoose';
import { transform, isObject } from 'lodash';

const { ObjectId } = Types;

export const replaceIds = (obj) =>
  transform(obj, (acc: any, value, key, _target) => {
    if (value instanceof ObjectId) {
      acc[key] = value ? value.toString() : '';
    } else if (value instanceof Date) {
      acc[key] = value;
    } else {
      acc[key] = isObject(value) ? replaceIds(value) : value;
    }
  });
