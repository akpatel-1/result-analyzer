import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

export const studentClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

studentClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (!original) {
      return Promise.reject(error);
    }

    if (original.url.includes('/student/auth/refresh')) {
      redirectToLogin(original.redirectPath);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => studentClient(original))
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await studentClient.post('/students/auth/refresh');

        processQueue(null);
        return studentClient(original);
      } catch {
        processQueue(error);
        if (!original.skipAuthRedirect) {
          redirectToLogin(original.redirectPath);
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

function redirectToLogin(redirectPath) {
  const redirect =
    redirectPath ||
    window.location.pathname + window.location.search + window.location.hash;

  window.location.replace(
    `/students/login?redirect=${encodeURIComponent(redirect)}`
  );
}
