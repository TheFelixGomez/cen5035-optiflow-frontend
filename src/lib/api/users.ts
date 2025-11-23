import apiClient from './client';

export interface User {
  id: string;
  username: string;
  role: string;
  disabled: boolean;
}

export interface UpdateUserData {
  role?: string;
  disabled?: boolean;
}

export const usersApi = {
  async getAll(): Promise<User[]> {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  async update(userId: string, data: UpdateUserData): Promise<User> {
    const { data: updated } = await apiClient.put<User>(`/users/${userId}`, data);
    return updated;
  },
};
