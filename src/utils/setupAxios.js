import axios from "axios";

// 401이 발생해서 refresh 진행 중일 때 들어온 요청들을 쌓아두는 큐
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

export function setupAxiosInterceptors() {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 401이 아니거나, 이미 재시도한 요청이거나, refresh/login 엔드포인트 자체면 그냥 reject
      if (
        error.response?.status !== 401 ||
        originalRequest._retry ||
        originalRequest.url?.includes("/api/token/refresh") ||
        originalRequest.url?.includes("/api/user/login")
      ) {
        return Promise.reject(error);
      }

      // 이미 refresh 진행 중이면 큐에 넣고 완료되면 재시도
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axios(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post("/api/token/refresh", {}, { withCredentials: true });
        processQueue(null);
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}
