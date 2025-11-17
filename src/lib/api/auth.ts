// import apiClient from './client';
// import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/auth.types';

// export const authApi = {
//   login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
//     const response = await apiClient.post('/auth/login', credentials);
//     return response.data;
//   },

//   register: async (data: RegisterData): Promise<AuthResponse> => {
//     const response = await apiClient.post('/auth/register', data);
//     return response.data;
//   },

//   logout: async (): Promise<void> => {
//     await apiClient.post('/auth/logout');
//   },

//   getCurrentUser: async (): Promise<User> => {
//     const response = await apiClient.get('/auth/me');
//     return response.data;
//   },

//   refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
//     const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
//     return response.data;
//   },
// };


import api from "@/lib/axios";

export type TokenResponse = { access_token: string; token_type: string };
export type User = { id?: string; username: string; disabled?: boolean };

export async function login(username: string, password: string): Promise<TokenResponse> {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);
  return (await api.post("/auth/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })).data;
}

export async function registerUser(username: string, password: string): Promise<User> {
  return (await api.post("/users/", { username, password })).data;
}

export async function getCurrentUser(): Promise<User> {
  return (await api.get("/users/me")).data;
}
