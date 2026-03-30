import { profileService } from './profile.services.js';

export async function profileController(req, res) {
  const profile = await profileService(req.studentId);
  res.status(200).json({ success: true, message: 'success', profile });
}
