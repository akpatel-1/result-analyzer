import { axiosClient } from '../../lib/axios.instance';

export const adminApi = {
  login: (data) => axiosClient.post('/admin/login', data),
  logout: () => axiosClient.get('/admin/logout'),
};
