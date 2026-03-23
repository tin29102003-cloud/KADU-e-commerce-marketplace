import axios from "axios";

// lấy token từ localStorage
const getToken = () => localStorage.getItem("access_token");

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // host backend
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor: tự động thêm token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor: refresh token nếu 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // gọi API refresh token
        const refreshToken = localStorage.getItem("refresh_token");
        const res = await axios.post(
          "http://localhost:5000/api/refresh-token",
          { refreshToken }
        );
        const { access_token } = res.data;
        localStorage.setItem("access_token", access_token);
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Refresh token failed", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
