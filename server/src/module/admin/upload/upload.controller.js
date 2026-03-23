import { service } from './upload.services.js';

export const controller = {
  async handleProfileUpload(req, res) {
    const failed = await service.processProfileUpload(req.data);

    res.status(201).json({
      success: true,
      message: 'File upload completed',
      failedCount: failed.length,
      failed,
    });
  },
};
