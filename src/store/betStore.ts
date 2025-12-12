import { create } from 'zustand';
import { Bet, Pagination, BetFilters } from '../types';
import apiService from '../services/api.service';

interface BetState {
  bets: Bet[];
  selectedBet: Bet | null;
  pagination: Pagination;
  filters: BetFilters;
  summary: {
    totalBets: number;
    totalBetAmount: string;
    totalWinAmount: string;
    netRevenue: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  
  fetchBets: (filters?: BetFilters) => Promise<void>;
  fetchBet: (betId: string) => Promise<void>;
  fetchStatistics: (filters?: BetFilters) => Promise<void>;
}

export const useBetStore = create<BetState>((set, get) => ({
  bets: [],
  selectedBet: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  summary: null,
  isLoading: false,
  error: null,

  fetchBets: async (filters?: BetFilters) => {
    set({ isLoading: true, error: null });
    
    try {
      // Fetch bets data
      const betsResponse = await apiService.getBets(filters);
      // Fetch totals (calculated from ALL filtered records, not just current page)
      const totalsResponse = await apiService.getBetTotals(filters);
      
      if (betsResponse.status === '0000' && totalsResponse.status === '0000') {
        set({
          bets: betsResponse.data.bets,
          pagination: betsResponse.data.pagination,
          summary: totalsResponse.data, // Totals from separate endpoint
          filters: filters || {},
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(betsResponse.message || 'Failed to fetch bets');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch bets';
      set({ 
        error: errorMessage, 
        isLoading: false,
        bets: [],
        summary: null,
    });
    }
  },

  fetchBet: async (betId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiService.getBet(betId);
      
      if (response.status === '0000') {
        set({ 
          selectedBet: response.data.bet, 
          isLoading: false 
        });
      } else {
        throw new Error(response.message || 'Failed to fetch bet');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch bet';
      set({ 
        error: errorMessage, 
        selectedBet: null,
        isLoading: false 
      });
    }
  },

  fetchStatistics: async (filters?: BetFilters) => {
    // Statistics are included in fetchBets response (totals)
    await get().fetchBets(filters);
  },
}));

