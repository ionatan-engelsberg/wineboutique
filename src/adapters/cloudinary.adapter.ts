import { Service } from 'typedi';

import { DeleteImageDTO, UploadImageDTO } from '../dto/Cloudinary.dto';

import { CloudinaryService } from '../services/cloudinary.service';

@Service({ transient: true })
export class CloudinaryAdapter {
  constructor(private readonly _cloudinaryService: CloudinaryService) {}

  async uploadImage(dto: UploadImageDTO) {
    const { filename, folder } = dto;
    return this._cloudinaryService.uploadImage(filename, folder);
  }

  async deleteImage(dto: DeleteImageDTO) {
    const { imageId } = dto;
    return this._cloudinaryService.deleteImage(imageId);
  }
}
