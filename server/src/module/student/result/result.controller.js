import { service } from './result.services.js';

export const controller = {
  async hadleRecentResult(req, res) {
    const result = await service.processRecentResult(req.studentId);
    res.status(200).json({ success: true, result });
  },
};
