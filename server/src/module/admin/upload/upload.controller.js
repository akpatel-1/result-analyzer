import { service } from './upload.services.js';

export const controller = {
  async handleProfileUpload(req, res) {
    const status = await service.processProfileUpload(req.data);

    res.status(201).json({
      success: true,
      message: 'Profile upload completed',
      status,
    });
  },

  async createSubjectInfo(req, res) {
    const status = await service.uploadSubjects(req.data);
    res.status(201).json({
      success: true,
      message: 'Subject information upload completed',
      status,
    });
  },

  async createResults(req, res) {
    const status = await service.uploadResults(req.data);
    res.status(201).json({
      success: true,
      message: 'Results upload completed',
      status,
    });
  },
};
