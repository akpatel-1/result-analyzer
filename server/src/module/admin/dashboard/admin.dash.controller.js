import { service } from './admin.dash.services.js';

export const controller = {
  async getStudentResult(req, res) {
    const result = await service.fetchStudentResult(req.data);
    res.status(200).json({ success: true, result });
  },
};
