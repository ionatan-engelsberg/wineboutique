import { Service } from 'typedi';
import { v2 as cloudinary } from 'cloudinary';

import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from '../config/config';
import { CloudinaryFolder } from '../types/Cloudinary.types';
import { logErrors } from '../utils/logger';

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const CLOUDINARY_UPLOAD_DIRECTORY = 'wineboutique';
const uploadsSource = `${__dirname}/../../uploads`;

@Service({ transient: true })
export class CloudinaryService {
  constructor() {}

  async uploadImage(filename: string, folder: CloudinaryFolder) {
    const localUploadDirectory = `${uploadsSource}/${filename}`;
    const cloudinaryFolder = `${CLOUDINARY_UPLOAD_DIRECTORY}/${folder}`;

    const upload = await cloudinary.uploader.upload(localUploadDirectory, {
      folder: cloudinaryFolder
    });

    const { url, public_id: imageId } = upload;
    return { url, imageId };
  }

  async deleteImage(imageId: string) {
    try {
      await cloudinary.uploader.destroy(imageId);
    } catch (error) {
      logErrors(error);
    }
  }
}
