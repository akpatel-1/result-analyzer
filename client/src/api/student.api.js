import { studentClient } from '../lib/axios.instance';

export const studentApi = {
  requestOtp: (data) => studentClient.post('/students/otp', data),
  verifyOtp: (data) => studentClient.post('/students/otp/verify', data),
  logout: () => studentClient.post('/students/auth/logout'),
};
