/**
 * API Service for Admin Portal
 * 
 * This file is prepared for API integration.
 * Replace the dummy implementations with actual API calls when backend is ready.
 * 
 * Example structure:
 * - All API calls go through this service
 * - Request/response interceptors handle auth tokens
 * - Error handling is centralized
 * - Type-safe API responses
 */

import axios, { AxiosInstance } from 'axios';
import { BetFilters, UserFilters } from '../types';

// TODO: Set this from environment variables
const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || 'http://localhost:3000';
const ADMIN_API_PREFIX = '/admin/api/v1';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}${ADMIN_API_PREFIX}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        // TODO: Get token from auth store
        // const token = useAuthStore.getState().accessToken;
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // TODO: Handle 401 - refresh token
        // TODO: Handle 403 - unauthorized
        // TODO: Handle other errors
        return Promise.reject(error);
      }
    );
  }

  // ==================== Authentication ====================
  
  async login(_username: string, _password: string) {
    // TODO: Implement
    // return this.client.post('/auth/login', { username, password });
  }

  async logout() {
    // TODO: Implement
    // return this.client.post('/auth/logout');
  }

  async refreshToken(_refreshToken: string) {
    // TODO: Implement
    // return this.client.post('/auth/refresh', { refreshToken });
  }

  // ==================== Bets ====================
  
  async getBets(_filters?: BetFilters) {
    // TODO: Implement
    // const params = this.buildBetQueryParams(filters);
    // return this.client.get('/bets', { params });
    // Expected response: { status: '0000', data: { bets: [], pagination: {}, summary: {} } }
  }

  async getBet(_betId: string) {
    // TODO: Implement
    // return this.client.get(`/bets/${betId}`);
  }

  // ==================== Users ====================
  
  async getUsers(_filters?: UserFilters) {
    // TODO: Implement
    // const params = this.buildUserQueryParams(filters);
    // return this.client.get('/users', { params });
  }

  async getUser(_userId: string, _agentId: string) {
    // TODO: Implement
    // return this.client.get(`/users/${userId}/${agentId}`);
  }

  async createUser(_data: any) {
    // TODO: Implement
    // return this.client.post('/users', data);
  }

  async updateUser(_userId: string, _agentId: string, _data: any) {
    // TODO: Implement
    // return this.client.patch(`/users/${userId}/${agentId}`, data);
  }

  async deleteUser(_userId: string, _agentId: string) {
    // TODO: Implement
    // return this.client.delete(`/users/${userId}/${agentId}`);
  }

  // ==================== Agents ====================
  
  async getAgents() {
    // TODO: Implement
    // return this.client.get('/agents');
  }

  async getAgent(_agentId: string) {
    // TODO: Implement
    // return this.client.get(`/agents/${agentId}`);
  }

  async createAgent(_data: any) {
    // TODO: Implement
    // return this.client.post('/agents', data);
  }

  async updateAgent(_agentId: string, _data: any) {
    // TODO: Implement
    // return this.client.patch(`/agents/${agentId}`, data);
  }

  async deleteAgent(_agentId: string) {
    // TODO: Implement
    // return this.client.delete(`/agents/${agentId}`);
  }

  // ==================== Config ====================
  
  async getConfigs() {
    // TODO: Implement
    // return this.client.get('/config');
  }

  async getConfig(_key: string) {
    // TODO: Implement
    // return this.client.get(`/config/${key}`);
  }

  async createConfig(_key: string, _value: string) {
    // TODO: Implement
    // return this.client.post('/config', { key, value });
  }

  async updateConfig(_key: string, _value: string) {
    // TODO: Implement
    // return this.client.patch(`/config/${key}`, { value });
  }

  async deleteConfig(_key: string) {
    // TODO: Implement
    // return this.client.delete(`/config/${key}`);
  }

  // ==================== Dashboard ====================
  
  async getDashboardStats() {
    // TODO: Implement
    // return this.client.get('/dashboard/overview');
  }

  // ==================== Helper Methods ====================
  
  // These methods are prepared for future API integration
  // They will be used when API endpoints are implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private buildBetQueryParams(_filters?: BetFilters): Record<string, any> {
    // TODO: Implement when API is ready
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private buildUserQueryParams(_filters?: UserFilters): Record<string, any> {
    // TODO: Implement when API is ready
    return {};
  }
}

export const apiService = new ApiService();
export default apiService;

