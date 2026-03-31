import { service } from './result.services.js';

export const controller = {
  async handleRecentResult(req, res) {
    const result = await service.processRecentResult(req.studentId);
    res.status(200).json({ success: true, result });
  },

  async handleSemesterResult(req, res) {
    const result = await service.processSemesterResult(
      req.studentId,
      req.data.sem
    );
    res.status(200).json({ success: true, result });
  },
};
