import { create } from 'zustand';
import { Bet, Pagination, BetFilters, BetStatus, Difficulty } from '../types';

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

// Generate dummy bets
const generateDummyBets = (count: number): Bet[] => {
  const users = Array.from({ length: 50 }, (_, i) => `user${String(i + 1).padStart(3, '0')}`);
  const agents = ['agent001', 'agent002', 'agent003'];
  const currencies = ['INR'];
  const difficulties: Difficulty[] = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD, Difficulty.DAREDEVIL];
  const statuses: BetStatus[] = [BetStatus.WON, BetStatus.LOST, BetStatus.PENDING];
  
  // Generate bets with dates spread across different time periods
  // Some today, some this week, some this month, some this year
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;
  const oneMonth = 30 * oneDay;
  const oneYear = 365 * oneDay;
  
  return Array.from({ length: count }, (_, i) => {
    const betAmount = (Math.random() * 1000 + 10).toFixed(2);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const winAmount = status === BetStatus.WON 
      ? (parseFloat(betAmount) * (1.2 + Math.random() * 0.8)).toFixed(2)
      : undefined;
    
    // Distribute dates: 20% today, 30% this week, 30% this month, 20% this year
    let dateOffset;
    const rand = Math.random();
    if (rand < 0.2) {
      // Today
      dateOffset = Math.random() * oneDay;
    } else if (rand < 0.5) {
      // This week
      dateOffset = Math.random() * oneWeek;
    } else if (rand < 0.8) {
      // This month
      dateOffset = Math.random() * oneMonth;
    } else {
      // This year
      dateOffset = Math.random() * oneYear;
    }
    
    const betPlacedAt = new Date(now - dateOffset);
    const settledAt = status !== BetStatus.PENDING 
      ? new Date(betPlacedAt.getTime() + Math.random() * 5 * 60 * 1000) // Settled within 5 minutes
      : undefined;
    
    return {
      id: `bet_${Date.now()}_${i}`,
      externalPlatformTxId: `tx_${Math.random().toString(36).substr(2, 9)}`,
      userId: users[Math.floor(Math.random() * users.length)],
      agentId: agents[Math.floor(Math.random() * agents.length)],
      roundId: `round_${i}`,
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      betAmount,
      winAmount,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      status,
      betPlacedAt: betPlacedAt.toISOString(),
      settledAt: settledAt?.toISOString(),
    };
  });
};

const dummyBets = generateDummyBets(500);

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
    
    // TODO: Replace with actual API call when backend is ready
    // Example API integration:
    // try {
    //   const response = await apiService.getBets(filters);
    //   set({
    //     bets: response.data.bets,
    //     pagination: response.data.pagination,
    //     summary: response.data.summary, // Summary should be calculated on backend based on filters
    //     filters: filters || {},
    //     isLoading: false,
    //   });
    // } catch (error) {
    //   set({ error: error.message, isLoading: false });
    // }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...dummyBets];
    
    // Apply filters - This logic will be replaced by backend filtering when API is integrated
    if (filters) {
      if (filters.userId) {
        filtered = filtered.filter(b => b.userId === filters.userId);
      }
      if (filters.agentId) {
        filtered = filtered.filter(b => b.agentId === filters.agentId);
      }
      if (filters.status) {
        filtered = filtered.filter(b => b.status === filters.status);
      }
      if (filters.difficulty) {
        filtered = filtered.filter(b => b.difficulty === filters.difficulty);
      }
      if (filters.currency) {
        filtered = filtered.filter(b => b.currency === filters.currency);
      }
      
      // Date range filtering
      if (filters.fromDate) {
        const fromDate = new Date(filters.fromDate);
        filtered = filtered.filter(b => {
          const betDate = new Date(b.betPlacedAt);
          return betDate >= fromDate;
        });
      }
      if (filters.toDate) {
        const toDate = new Date(filters.toDate);
        toDate.setHours(23, 59, 59, 999); // Include entire end date
        filtered = filtered.filter(b => {
          const betDate = new Date(b.betPlacedAt);
          return betDate <= toDate;
        });
      }
    }
    
    const page = filters?.page || get().pagination.page || 1;
    const limit = 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    // Calculate summary from ALL filtered bets (not just current page)
    // This ensures summary cards show correct totals for the applied filters
    // When API is integrated, backend should calculate summary based on filters
    const totalBetAmount = filtered.reduce((sum, b) => sum + parseFloat(b.betAmount), 0).toFixed(2);
    const totalWinAmount = filtered
      .filter(b => b.winAmount)
      .reduce((sum, b) => sum + parseFloat(b.winAmount || '0'), 0)
      .toFixed(2);
    const netRevenue = (parseFloat(totalBetAmount) - parseFloat(totalWinAmount)).toFixed(2);
    
    set({
      bets: filtered.slice(start, end), // Only show current page in table
      pagination: {
        page,
        limit,
        total: filtered.length, // Total count of filtered bets
        totalPages: Math.ceil(filtered.length / limit),
      },
      filters: filters || {},
      summary: {
        totalBets: filtered.length, // Total bets matching filters
        totalBetAmount, // Total volume of filtered bets
        totalWinAmount, // Total wins of filtered bets
        netRevenue, // Net revenue of filtered bets
      },
      isLoading: false,
    });
  },

  fetchBet: async (betId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const bet = dummyBets.find(b => b.id === betId);
    set({ selectedBet: bet || null, isLoading: false });
  },

  fetchStatistics: async (filters?: BetFilters) => {
    await get().fetchBets(filters);
  },
}));

