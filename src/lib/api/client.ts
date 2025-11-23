// import axios, { AxiosError } from 'axios';

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor - Add JWT token if available
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - Handle token refresh and errors
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as any;

//     // If 401 and we haven't tried to refresh yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem('refresh_token');
        
//         if (!refreshToken) {
//           // No refresh token, clear storage and redirect to login
//           localStorage.removeItem('access_token');
//           localStorage.removeItem('refresh_token');
//           window.location.href = '/login';
//           return Promise.reject(error);
//         }

//         // Try to refresh the token
//         const response = await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
//           { refresh_token: refreshToken }
//         );

//         const { access_token } = response.data;
//         localStorage.setItem('access_token', access_token);

//         // Retry the original request with new token
//         originalRequest.headers.Authorization = `Bearer ${access_token}`;
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         // Refresh failed, clear storage and redirect
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default apiClient;

import axios, { AxiosError, type AxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------- REQUEST INTERCEPTOR --------
// Add JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("of_token"); // <<< YOUR TOKEN KEY
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------- RESPONSE INTERCEPTOR --------
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If token expired (401) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clean session completely (you don’t have refresh token logic)
      localStorage.removeItem("of_token");
      window.location.href = "/login";

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

