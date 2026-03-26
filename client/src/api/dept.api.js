import { axiosClient } from '../lib/axios.instance';

export const deptApi = {
  login: (data) => axiosClient.post('/dept/login', data),
  logout: () => axiosClient.get('/dept/logout'),
  me: () => axiosClient.get('/dept/me'),
};
