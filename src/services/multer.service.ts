import multer from 'multer';
import path from 'path';
import { Service } from 'typedi';

import { IncorrectFormatError } from '../errors/base.error';
import { MulterFile } from '../dto/Multer.dto';
import { MULTER_AVAILABLE_FILETYPES, MULTER_MAX_FILE_SIZE_IN_MEGABYTES } from '../constants/Multer';
import { ErrorCodes } from '../constants/ErrorMessages';

@Service({ transient: true })
export class MulterService {
  constructor() {}

  private static storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/../../uploads`);
    },
    filename: (req, file, cb) => {
      const filename = file.originalname.split(' ').join('_');
      cb(null, filename);
    }
  });

  static checkType(mimetype: string): void {
    if (!MULTER_AVAILABLE_FILETYPES.includes(mimetype)) {
      const errorDescription = 'Incorrect file mimetype';

      throw new IncorrectFormatError(errorDescription, [
        {
          type: mimetype,
          allowedTypes: MULTER_AVAILABLE_FILETYPES,
          code: ErrorCodes.INVALID_MIMETYPE
        }
      ]);
    }
  }

  static checkMaxSize(file: MulterFile) {
    const { size } = file;

    const fileMegaBytes = size / (1024 * 1024);

    if (fileMegaBytes > MULTER_MAX_FILE_SIZE_IN_MEGABYTES) {
      throw new IncorrectFormatError(`File size exceeded limits`, [
        {
          filesize: file.size,
          maxFileSize: MULTER_MAX_FILE_SIZE_IN_MEGABYTES,
          code: ErrorCodes.MAX_SIZE_EXCEEDED
        }
      ]);
    }
  }

  static multerUploadOptions = () =>
    multer({
      storage: MulterService.storage,
      fileFilter: (_req, file, cb) => {
        try {
          MulterService.checkType(file.mimetype);
          MulterService.checkMaxSize(file);
        } catch (error: any) {
          return cb(error, false);
        }

        return cb(null, true);
      }
    });
}
