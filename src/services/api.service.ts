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
import { BetFilters, UserFilters, AgentFilters, PlayerSummaryFilters } from '../types';
import { buildBetQueryParams, buildAgentQueryParams, buildPlayerSummaryQueryParams } from '../utils/queryBuilder';

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
      (response) => {
        // Standardize response format
        // Backend should return: { status: '0000', data: {...} }
        return response;
      },
      async (error) => {
        // TODO: Backend Integration - Error handling
        // if (error.response?.status === 401) {
        //   // Token expired - try to refresh
        //   // const refreshToken = useAuthStore.getState().refreshToken;
        //   // await apiService.refreshToken(refreshToken);
        //   // Retry original request
        // } else if (error.response?.status === 403) {
        //   // Unauthorized - redirect to login
        //   // window.location.href = '/';
        // }
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
  
  async getBets(filters?: BetFilters) {
    // TODO: Replace with actual API call when backend is ready
    // const params = buildBetQueryParams(filters || {});
    // const response = await this.client.get('/bets', { params });
    // return response.data;
    // Expected response: { status: '0000', data: { bets: [], pagination: {}, totals: {} } }
    throw new Error('Not implemented - backend integration needed');
  }

  async getBetTotals(filters?: BetFilters) {
    // TODO: Replace with actual API call when backend is ready
    // const params = buildBetQueryParams(filters || {});
    // const response = await this.client.get('/bets/totals', { params });
    // return response.data;
    // Expected response: { status: '0000', data: { totalBets, totalBetAmount, totalWinAmount, netRevenue } }
    throw new Error('Not implemented - backend integration needed');
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
  
  async getAgents(filters?: AgentFilters) {
    // TODO: Replace with actual API call when backend is ready
    // const params = buildAgentQueryParams(filters || {});
    // const response = await this.client.get('/agents', { params });
    // return response.data;
    // Expected response: { status: '0000', data: { agents: [], pagination: {}, totals: {} } }
    throw new Error('Not implemented - backend integration needed');
  }

  async getAgentTotals(filters?: AgentFilters) {
    // TODO: Replace with actual API call when backend is ready
    // const params = buildAgentQueryParams(filters || {});
    // const response = await this.client.get('/agents/totals', { params });
    // return response.data;
    // Expected response: { status: '0000', data: { totalBetCount, totalBetAmount, totalWinLoss, totalMarginPercent, companyTotalWinLoss } }
    throw new Error('Not implemented - backend integration needed');
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

  // ==================== Player Summary ====================
  
  async getPlayerSummary(filters?: PlayerSummaryFilters) {
    // TODO: Replace with actual API call when backend is ready
    // const params = buildPlayerSummaryQueryParams(filters || {});
    // const response = await this.client.get('/player-summary', { params });
    // return response.data;
    // Expected response: { status: '0000', data: { players: [], pagination: {}, totals: {} } }
    throw new Error('Not implemented - backend integration needed');
  }

  async getPlayerSummaryTotals(filters?: PlayerSummaryFilters) {
    // TODO: Replace with actual API call when backend is ready
    // const params = buildPlayerSummaryQueryParams(filters || {});
    // const response = await this.client.get('/player-summary/totals', { params });
    // return response.data;
    // Expected response: { status: '0000', data: { totalPlayers, totalBetCount, totalBetAmount, totalPlayerWinLoss, totalWinLoss } }
    throw new Error('Not implemented - backend integration needed');
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
  
  // Note: Query parameter building is now handled by utility functions in utils/queryBuilder.ts
  // This keeps the API service clean and makes it easier to test and maintain
}

export const apiService = new ApiService();
export default apiService;

