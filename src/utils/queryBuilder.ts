/**
 * Query Builder Utilities
 * 
 * These utilities help build query parameters from filter objects
 * for easy backend API integration.
 */

import { BetFilters, AgentFilters, PlayerSummaryFilters } from '../types';

/**
 * Build query parameters from BetFilters
 * Removes undefined/null/empty string values and formats dates properly
 * Following bet practices: All filtering is done on the backend for performance
 */
export function buildBetQueryParams(filters: BetFilters): Record<string, string> {
  const params: Record<string, string> = {};

  // Pagination
  if (filters.page !== undefined && filters.page !== null) {
    params.page = filters.page.toString();
  }
  if (filters.limit !== undefined && filters.limit !== null) {
    params.limit = filters.limit.toString();
  }

  // Filters (only include if they have non-empty values)
  if (filters.userId && filters.userId.trim() !== '') {
    params.userId = filters.userId.trim();
  }
  if (filters.agentId && filters.agentId.trim() !== '') {
    params.agentId = filters.agentId.trim();
  }
  if (filters.platform && filters.platform.trim() !== '') {
    params.platform = filters.platform.trim();
  }
  if (filters.game && filters.game.trim() !== '') {
    params.game = filters.game.trim();
  }
  if (filters.status && filters.status.trim() !== '') {
    params.status = filters.status.trim();
  }
  if (filters.difficulty && filters.difficulty.trim() !== '') {
    params.difficulty = filters.difficulty.trim();
  }
  if (filters.currency && filters.currency.trim() !== '') {
    params.currency = filters.currency.trim();
  }
  
  // Date range (required by backend - should always be set by frontend)
  if (filters.fromDate) {
    params.fromDate = filters.fromDate;
  }
  if (filters.toDate) {
    params.toDate = filters.toDate;
  }

  return params;
}

/**
 * Build query parameters from AgentFilters
 */
export function buildAgentQueryParams(filters: AgentFilters): Record<string, string> {
  const params: Record<string, string> = {};

  // Pagination
  if (filters.page !== undefined && filters.page !== null) {
    params.page = filters.page.toString();
  }
  if (filters.limit !== undefined && filters.limit !== null) {
    params.limit = filters.limit.toString();
  }

  // Filters (only include if they have non-empty values)
  if (filters.agentId && filters.agentId.trim() !== '') {
    params.agentId = filters.agentId.trim();
  }
  if (filters.platform && filters.platform.trim() !== '') {
    params.platform = filters.platform.trim();
  }
  if (filters.game && filters.game.trim() !== '') {
    params.game = filters.game.trim();
  }
  
  // Date range (required by backend - should always be set by frontend)
  if (filters.fromDate) {
    params.fromDate = filters.fromDate;
  }
  if (filters.toDate) {
    params.toDate = filters.toDate;
  }

  return params;
}

/**
 * Build query parameters from PlayerSummaryFilters
 */
export function buildPlayerSummaryQueryParams(filters: PlayerSummaryFilters): Record<string, string> {
  const params: Record<string, string> = {};

  // Pagination
  if (filters.page !== undefined && filters.page !== null) {
    params.page = filters.page.toString();
  }
  if (filters.limit !== undefined && filters.limit !== null) {
    params.limit = filters.limit.toString();
  }

  // Filters (only include if they have non-empty values)
  if (filters.playerId && filters.playerId.trim() !== '') {
    params.playerId = filters.playerId.trim();
  }
  if (filters.platform && filters.platform.trim() !== '') {
    params.platform = filters.platform.trim();
  }
  if (filters.game && filters.game.trim() !== '') {
    params.game = filters.game.trim();
  }
  if (filters.agentId && filters.agentId.trim() !== '') {
    params.agentId = filters.agentId.trim();
  }
  
  // Date range (required by backend - should always be set by frontend)
  if (filters.fromDate) {
    params.fromDate = filters.fromDate;
  }
  if (filters.toDate) {
    params.toDate = filters.toDate;
  }

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

