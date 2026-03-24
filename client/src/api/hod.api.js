import { axiosClient } from '../lib/axios.instance';

export const hodApi = {
  login: (data) => axiosClient.post('/hod/login', data),
  logout: () => axiosClient.get('/hod/logout'),
  me: () => axiosClient.get('/hod/me'),
};
