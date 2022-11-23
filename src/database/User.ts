import { Schema, model } from 'mongoose';
import { User } from '../interfaces';
import { UserRole } from '../types/User.types';

export const UserSchema = new Schema<User>(
  {
    firstName: {
      type: String,
      required: [true, 'User first name is required'],
      minlength: 3,
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'User last name is required'],
      minlength: 3,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    birthdate: {
      type: Date,
      required: [true, 'User birthdate is required']
    },
    phoneNumber: {
      type: Number
    },
    password: {
      type: String,
      required: [true, 'User password is required'],
      minlength: 8,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordTokenExpirationDate: {
      type: Date,
      default: null
    },
    role: {
      type: Number,
      enum: {
        values: Object.values(UserRole),
        message: `User role must be one of the following: ${Object.values(UserRole)}`
      },
      default: UserRole.USER
    }
  },
  { timestamps: true, versionKey: false }
);

export const UserModel = model<User>('User', UserSchema);
