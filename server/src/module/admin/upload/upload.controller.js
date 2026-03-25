import { service } from './upload.services.js';

export const controller = {
  async handleProfileUpload(req, res) {
    const status = await service.processProfileUpload(req.data);

    res.status(201).json({
      success: true,
      message: 'File upload completed',
      status,
    });
  },

  async createSubjectInfo(req, res) {
    const status = await service.uploadSubjectInfo(req.data);
    res.status(201).json({
      success: true,
      message: 'File upload completed',
      status,
    });
  },
};
