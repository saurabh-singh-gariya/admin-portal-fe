/**
 * Query Builder Utilities
 * 
 * These utilities help build query parameters from filter objects
 * for easy backend API integration.
 */

import { BetFilters, AgentFilters, PlayerSummaryFilters } from '../types';

/**
 * Build query parameters from BetFilters
 * Removes undefined/null values and formats dates properly
 */
export function buildBetQueryParams(filters: BetFilters): Record<string, string> {
  const params: Record<string, string> = {};

  if (filters.page) params.page = filters.page.toString();
  if (filters.userId) params.userId = filters.userId;
  if (filters.agentId) params.agentId = filters.agentId;
  if (filters.platform) params.platform = filters.platform;
  if (filters.game) params.game = filters.game;
  if (filters.status) params.status = filters.status;
  if (filters.difficulty) params.difficulty = filters.difficulty;
  if (filters.currency) params.currency = filters.currency;
  if (filters.fromDate) params.fromDate = filters.fromDate;
  if (filters.toDate) params.toDate = filters.toDate;

  return params;
}

/**
 * Build query parameters from AgentFilters
 */
export function buildAgentQueryParams(filters: AgentFilters): Record<string, string> {
  const params: Record<string, string> = {};

  if (filters.page) params.page = filters.page.toString();
  if (filters.agentId) params.agentId = filters.agentId;
  if (filters.platform) params.platform = filters.platform;
  if (filters.game) params.game = filters.game;
  if (filters.fromDate) params.fromDate = filters.fromDate;
  if (filters.toDate) params.toDate = filters.toDate;

  return params;
}

/**
 * Build query parameters from PlayerSummaryFilters
 */
export function buildPlayerSummaryQueryParams(filters: PlayerSummaryFilters): Record<string, string> {
  const params: Record<string, string> = {};

  if (filters.page) params.page = filters.page.toString();
  if (filters.playerId) params.playerId = filters.playerId;
  if (filters.platform) params.platform = filters.platform;
  if (filters.game) params.game = filters.game;
  if (filters.agentId) params.agentId = filters.agentId;
  if (filters.fromDate) params.fromDate = filters.fromDate;
  if (filters.toDate) params.toDate = filters.toDate;

  return params;
}

/**
 * Clean filter object - removes undefined, null, and empty string values
 * Useful for preparing filters before sending to API
 */
export function cleanFilters<T extends Record<string, any>>(filters: T): Partial<T> {
  const cleaned: Partial<T> = {};
  
  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key as keyof T] = value;
    }
  });
  
  return cleaned;
}

