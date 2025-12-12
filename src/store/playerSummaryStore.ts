import { create } from 'zustand';
import { PlayerSummary, Pagination, PlayerSummaryFilters, PlayerSummaryTotals } from '../types';
import apiService from '../services/api.service';

interface PlayerSummaryState {
  players: PlayerSummary[];
  pagination: Pagination;
  filters: PlayerSummaryFilters;
  totals: PlayerSummaryTotals | null;
  isLoading: boolean;
  error: string | null;
  
  fetchPlayers: (filters?: PlayerSummaryFilters) => Promise<void>;
  fetchTotals: (filters?: PlayerSummaryFilters) => Promise<void>;
}

export const usePlayerSummaryStore = create<PlayerSummaryState>((set, get) => ({
  players: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  totals: null,
  isLoading: false,
  error: null,

  fetchPlayers: async (filters?: PlayerSummaryFilters) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch players and totals in parallel
      const [playersResponse, totalsResponse] = await Promise.all([
        apiService.getPlayerSummary(filters),
        apiService.getPlayerSummaryTotals(filters).catch(() => null), // Don't fail if totals fail
      ]);

      if (playersResponse.status === '0000') {
        set({
          players: playersResponse.data.players || [],
          pagination: playersResponse.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
          filters: filters || {},
          isLoading: false,
          error: null,
        });

        // Update totals if available
        if (totalsResponse && totalsResponse.status === '0000') {
          set({
            totals: totalsResponse.data,
          });
        }
      } else {
        set({
          isLoading: false,
          error: playersResponse.message || 'Failed to fetch players',
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch players',
      });
    }
  },

  fetchTotals: async (filters?: PlayerSummaryFilters) => {
    try {
      const response = await apiService.getPlayerSummaryTotals(filters);
      if (response.status === '0000') {
        set({
          totals: response.data,
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch player summary totals:', error);
      // Don't set error state for totals - it's not critical
    }
  },
}));

