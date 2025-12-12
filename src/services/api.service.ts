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

import axios, { AxiosInstance, AxiosError } from 'axios';
import { BetFilters, UserFilters, AgentFilters, PlayerSummaryFilters } from '../types';
import { buildBetQueryParams, buildAgentQueryParams, buildPlayerSummaryQueryParams } from '../utils/queryBuilder';

// Set this from environment variables
const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || 'http://localhost:3000';
const ADMIN_API_PREFIX = '/admin/api/v1';

class ApiService {
  private client: AxiosInstance;
  private authClient: AxiosInstance; // Separate client for auth endpoints (no token needed)

  constructor() {
    // Main API client (requires auth token)
    this.client = axios.create({
      baseURL: `${API_BASE_URL}${ADMIN_API_PREFIX}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Auth client (no token needed for login/refresh)
    this.authClient = axios.create({
      baseURL: `${API_BASE_URL}${ADMIN_API_PREFIX}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        // Get token from localStorage (set by authStore)
        const authData = localStorage.getItem('admin-auth-storage');
        if (authData) {
          try {
            const parsed = JSON.parse(authData);
            const token = parsed.state?.accessToken;
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => {
        // Standardize response format
        // Backend returns: { status: '0000', data: {...} }
        return response;
      },
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - clear auth and redirect to login
          localStorage.removeItem('admin-auth-storage');
          window.location.href = '/';
        } else if (error.response?.status === 403) {
          // Forbidden - user doesn't have permission
          // Keep user logged in but show error
        }
        return Promise.reject(error);
      }
    );

    // Auth client response interceptor
    this.authClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Handle auth-specific errors
        return Promise.reject(error);
      }
    );
  }

  // ==================== Authentication ====================
  
  async login(username: string, password: string) {
    const response = await this.authClient.post('/auth/login', { username, password });
    return response.data;
  }

  async logout() {
    const response = await this.client.post('/auth/logout');
    return response.data;
  }

  async refreshToken(refreshToken: string) {
    const response = await this.authClient.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  async getCurrentAdmin() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // ==================== Bets ====================
  
  async getBets(filters?: BetFilters) {
    const params = buildBetQueryParams(filters || {});
    const response = await this.client.get('/bets', { params });
    return response.data;
  }

  async getBetTotals(filters?: BetFilters) {
    const params = buildBetQueryParams(filters || {});
    const response = await this.client.get('/bets/totals', { params });
    return response.data;
  }

  async getBet(betId: string) {
    const response = await this.client.get(`/bets/${betId}`);
    return response.data;
  }

  async getBetFilterOptions() {
    const response = await this.client.get('/bets/filter-options');
    return response.data;
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
    const params = buildAgentQueryParams(filters || {});
    const response = await this.client.get('/agents', { params });
    return response.data;
  }

  async getAgentTotals(filters?: AgentFilters) {
    const params = buildAgentQueryParams(filters || {});
    const response = await this.client.get('/agents/totals', { params });
    return response.data;
  }

  async getAgentFilterOptions() {
    const response = await this.client.get('/agents/filter-options');
    return response.data;
  }

  // Agent Management APIs (for agent list page)
  async getAllAgents() {
    const response = await this.client.get('/agents/list');
    return response.data;
  }

  async getAgent(agentId: string) {
    const response = await this.client.get(`/agents/list/${agentId}`);
    return response.data;
  }

  async createAgent(data: any) {
    const response = await this.client.post('/agents/list', data);
    return response.data;
  }

  async updateAgent(agentId: string, data: any) {
    const response = await this.client.patch(`/agents/list/${agentId}`, data);
    return response.data;
  }

  async deleteAgent(agentId: string) {
    const response = await this.client.delete(`/agents/list/${agentId}`);
    return response.data;
  }

  // Games API
  async getActiveGames() {
    // Use the public API endpoint for games
    const response = await axios.get(`${API_BASE_URL}/api/games`);
    return response.data;
  }

  // ==================== Player Summary ====================
  
  async getPlayerSummary(filters?: PlayerSummaryFilters) {
    const params = buildPlayerSummaryQueryParams(filters || {});
    const response = await this.client.get('/player-summary', { params });
    return response.data;
  }

  async getPlayerSummaryTotals(filters?: PlayerSummaryFilters) {
    const params = buildPlayerSummaryQueryParams(filters || {});
    const response = await this.client.get('/player-summary/totals', { params });
    return response.data;
  }

  async getPlayerSummaryFilterOptions() {
    const response = await this.client.get('/player-summary/filter-options');
    return response.data;
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

