import multer from 'multer';

import { ApiError } from '../../../utils/api.error.js';
import { UPLOAD_ERRORS } from './upload.error.js';

const storage = multer.memoryStorage();

export const middleware = {
  uploadJSON: multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'application/json') {
        return cb(new ApiError(UPLOAD_ERRORS.FILE_TYPE_MISMATCH), false);
      }
      cb(null, true);
    },
  }),

  parseJSONfiles: (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next(new ApiError(UPLOAD_ERRORS.NO_FILES_UPLOADED));
    }

    let parsedData = [];

    for (const file of req.files) {
      try {
        const json = JSON.parse(file.buffer.toString('utf-8'));
        if (Array.isArray(json)) {
          parsedData.push(...json);
        } else {
          parsedData.push(json);
        }
      } catch (err) {
        return next(
          new ApiError({
            statusCode: 400,
            message: `Invalid JSON syntax in file: ${file.originalname}`,
            code: 'INVALID_JSON_SYNTAX',
          })
        );
      }
    }

    req.parsedJSON = parsedData;
    next();
  },
};
