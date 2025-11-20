import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from '../auth';
import apiClient from '../client';
import type { LoginCredentials, RegisterData } from '@/types/auth.types';

vi.mock('../client');

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('calls POST /auth/login with credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'production_manager',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
    });

    it('throws error on failed login', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      vi.mocked(apiClient.post).mockRejectedValue(new Error('Invalid credentials'));

      await expect(authApi.login(credentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('calls POST /auth/register with user data', async () => {
      const registerData: RegisterData = {
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        name: 'New User',
      };

      const mockResponse = {
        data: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          user: {
            id: '1',
            email: 'newuser@example.com',
            name: 'New User',
            role: 'production_manager',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.register(registerData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(result).toEqual(mockResponse.data);
    });

    it('throws error when email already exists', async () => {
      const registerData: RegisterData = {
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        name: 'Test User',
      };

      vi.mocked(apiClient.post).mockRejectedValue(new Error('Email already exists'));

      await expect(authApi.register(registerData)).rejects.toThrow('Email already exists');
    });
  });

  describe('logout', () => {
    it('calls POST /auth/logout', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: undefined });

      await authApi.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('handles logout errors gracefully', async () => {
      vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

      await expect(authApi.logout()).rejects.toThrow('Network error');
    });
  });

  describe('getCurrentUser', () => {
    it('calls GET /auth/me', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'production_manager' as const,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      };

      const mockResponse = { data: mockUser };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('refreshToken', () => {
    it('calls POST /auth/refresh with refresh token', async () => {
      const refreshToken = 'mock-refresh-token';
      const mockResponse = {
        data: {
          access_token: 'new-access-token',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.refreshToken(refreshToken);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refresh_token: refreshToken,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });
});
