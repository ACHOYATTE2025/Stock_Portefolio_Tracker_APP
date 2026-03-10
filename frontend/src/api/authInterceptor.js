import api from "./axiosClient";
import { refreshToken, logout } from "../services/authService";

// Refresh token automatique si 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        logout();
        window.location.href = "/"; // redirect login
      }
    }

    return Promise.reject(error);
  }
);