import { service } from './upload.services.js';

export const controller = {
  async handleProfileUpload(req, res) {
    const data = await service.processProfileUpload(req.data);

    res.status(201).json({
      success: true,
      message: 'File upload completed',
      data,
    });
  },
};
