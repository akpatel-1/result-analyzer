import { axiosClient } from '../lib/axios.instance';

export const adminApi = {
  login: (data) => axiosClient.post('/admin/login', data),
  logout: () => axiosClient.get('/admin/logout'),

  upload: (route, data) => axiosClient.post(`/admin/upload/${route}`, data),
};
