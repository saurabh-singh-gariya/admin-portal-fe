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

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { BetFilters, UserFilters } from '../types';

// TODO: Set this from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
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
  
  async login(username: string, password: string) {
    // TODO: Implement
    // return this.client.post('/auth/login', { username, password });
  }

  async logout() {
    // TODO: Implement
    // return this.client.post('/auth/logout');
  }

  async refreshToken(refreshToken: string) {
    // TODO: Implement
    // return this.client.post('/auth/refresh', { refreshToken });
  }

  // ==================== Bets ====================
  
  async getBets(filters?: BetFilters) {
    // TODO: Implement
    // const params = this.buildBetQueryParams(filters);
    // return this.client.get('/bets', { params });
    // Expected response: { status: '0000', data: { bets: [], pagination: {}, summary: {} } }
  }

  async getBet(betId: string) {
    // TODO: Implement
    // return this.client.get(`/bets/${betId}`);
  }

  // ==================== Users ====================
  
  async getUsers(filters?: UserFilters) {
    // TODO: Implement
    // const params = this.buildUserQueryParams(filters);
    // return this.client.get('/users', { params });
  }

  async getUser(userId: string, agentId: string) {
    // TODO: Implement
    // return this.client.get(`/users/${userId}/${agentId}`);
  }

  async createUser(data: any) {
    // TODO: Implement
    // return this.client.post('/users', data);
  }

  async updateUser(userId: string, agentId: string, data: any) {
    // TODO: Implement
    // return this.client.patch(`/users/${userId}/${agentId}`, data);
  }

  async deleteUser(userId: string, agentId: string) {
    // TODO: Implement
    // return this.client.delete(`/users/${userId}/${agentId}`);
  }

  // ==================== Agents ====================
  
  async getAgents() {
    // TODO: Implement
    // return this.client.get('/agents');
  }

  async getAgent(agentId: string) {
    // TODO: Implement
    // return this.client.get(`/agents/${agentId}`);
  }

  async createAgent(data: any) {
    // TODO: Implement
    // return this.client.post('/agents', data);
  }

  async updateAgent(agentId: string, data: any) {
    // TODO: Implement
    // return this.client.patch(`/agents/${agentId}`, data);
  }

  async deleteAgent(agentId: string) {
    // TODO: Implement
    // return this.client.delete(`/agents/${agentId}`);
  }

  // ==================== Config ====================
  
  async getConfigs() {
    // TODO: Implement
    // return this.client.get('/config');
  }

  async getConfig(key: string) {
    // TODO: Implement
    // return this.client.get(`/config/${key}`);
  }

  async createConfig(key: string, value: string) {
    // TODO: Implement
    // return this.client.post('/config', { key, value });
  }

  async updateConfig(key: string, value: string) {
    // TODO: Implement
    // return this.client.patch(`/config/${key}`, { value });
  }

  async deleteConfig(key: string) {
    // TODO: Implement
    // return this.client.delete(`/config/${key}`);
  }

  // ==================== Dashboard ====================
  
  async getDashboardStats() {
    // TODO: Implement
    // return this.client.get('/dashboard/overview');
  }

  // ==================== Helper Methods ====================
  
  private buildBetQueryParams(filters?: BetFilters): Record<string, any> {
    if (!filters) return {};
    
    const params: Record<string, any> = {};
    
    if (filters.page) params.page = filters.page;
    if (filters.userId) params.userId = filters.userId;
    if (filters.agentId) params.agentId = filters.agentId;
    if (filters.status) params.status = filters.status;
    if (filters.difficulty) params.difficulty = filters.difficulty;
    if (filters.currency) params.currency = filters.currency;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
    
    return params;
  }

  private buildUserQueryParams(filters?: UserFilters): Record<string, any> {
    if (!filters) return {};
    
    const params: Record<string, any> = {};
    
    if (filters.page) params.page = filters.page;
    if (filters.agentId) params.agentId = filters.agentId;
    if (filters.currency) params.currency = filters.currency;
    if (filters.search) params.search = filters.search;
    if (filters.createdFrom) params.createdFrom = filters.createdFrom;
    if (filters.createdTo) params.createdTo = filters.createdTo;
    
    return params;
  }
}

export const apiService = new ApiService();
export default apiService;

