import { IsEnum, IsString } from 'class-validator';
import { CloudinaryFolder } from '../types/Cloudinary.types';

export class UploadImageDTO {
  @IsString()
  filename!: string;

  @IsEnum(CloudinaryFolder)
  folder!: CloudinaryFolder;
}

export class DeleteImageDTO {
  @IsString()
  imageId!: string;
}
