import { success } from 'zod';

export const controller = {
  async handleProfileUpload(req, res) {
    res
      .status(200)
      .json({ success: true, message: 'Files uploaded successfully' });
  },
};
