import { studentClient } from '../lib/axios.instance';

export const studentApi = {
  requestOtp: (data) => studentClient.post('/students/otp', data),
  verifyOtp: (data) => studentClient.post('/students/otp/verify', data),
  logout: () => studentClient.post('/students/auth/logout'),
  me: () => studentClient.get('/students/me'),
  profile: () => studentClient.get('/students/profile'),
  latestResult: () => studentClient.get('/students/latest-result'),
};
