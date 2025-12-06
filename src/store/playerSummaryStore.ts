import { create } from 'zustand';
import { PlayerSummary, Pagination, PlayerSummaryFilters, PlayerSummaryTotals } from '../types';

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

// Generate dummy player summary data (separate rows per player-platform-game combination)
const generateDummyPlayerSummary = (): PlayerSummary[] => {
  const players = Array.from({ length: 100 }, (_, i) => `user${String(i + 1).padStart(3, '0')}`);
  const platforms = ['SPADE', 'EVOLUTION', 'PRAGMATIC'];
  const games = ['ChickenRoad', 'LuckyWheel', 'DiceGame'];
  
  const result: PlayerSummary[] = [];
  
  // Generate some combinations (not all players have all combinations)
  players.forEach((playerId, playerIndex) => {
    // Each player has 1-3 platform-game combinations
    const numCombinations = Math.floor(Math.random() * 3) + 1;
    const usedCombinations = new Set<string>();
    
    for (let i = 0; i < numCombinations; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const game = games[Math.floor(Math.random() * games.length)];
      const combinationKey = `${platform}-${game}`;
      
      if (usedCombinations.has(combinationKey)) continue;
      usedCombinations.add(combinationKey);
      
      const betAmount = (Math.random() * 50000 + 1000).toFixed(2);
      const winAmount = (parseFloat(betAmount) * (0.85 + Math.random() * 0.15)).toFixed(2);
      const playerWinLoss = (parseFloat(betAmount) - parseFloat(winAmount)).toFixed(2);
      
      result.push({
        playerId,
        platform,
        game,
        betCount: Math.floor(Math.random() * 500 + 10),
        betAmount,
        playerWinLoss, // Positive = company profit, negative = players won more
        totalWinLoss: playerWinLoss, // Same as playerWinLoss (adjustments not applied at player level)
      });
    }
  });
  
  return result;
};

const dummyPlayerSummary = generateDummyPlayerSummary();

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
    
    // TODO: Backend Integration
    // Replace this dummy implementation with:
    // try {
    //   // Fetch players data
    //   const playersResponse = await apiService.getPlayerSummary(filters);
    //   // Fetch totals (calculated from ALL filtered records, not just current page)
    //   const totalsResponse = await apiService.getPlayerSummaryTotals(filters);
    //   
    //   if (playersResponse.status === '0000' && totalsResponse.status === '0000') {
    //     set({
    //       players: playersResponse.data.players,
    //       pagination: playersResponse.data.pagination,
    //       totals: totalsResponse.data, // Totals from separate endpoint
    //       filters: filters || {},
    //       isLoading: false,
    //     });
    //   } else {
    //     throw new Error(playersResponse.message || 'Failed to fetch players');
    //   }
    // } catch (error: any) {
    //   set({ error: error.message || 'Failed to fetch players', isLoading: false });
    // }
    
    // Dummy implementation - remove when backend is ready
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...dummyPlayerSummary];
    
    // Apply filters
    if (filters) {
      if (filters.playerId) {
        filtered = filtered.filter(p => p.playerId.toLowerCase().includes(filters.playerId!.toLowerCase()));
      }
      if (filters.platform) {
        filtered = filtered.filter(p => p.platform === filters.platform);
      }
      if (filters.game) {
        filtered = filtered.filter(p => p.game === filters.game);
      }
      if (filters.agentId) {
        // In real implementation, this would filter by agentId
        // For now, we'll just pass through
      }
      // Date filtering would be applied here if needed
    }
    
    const page = filters?.page || get().pagination.page || 1;
    const limit = 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    // Calculate totals from ALL filtered records (not just current page)
    const uniquePlayers = new Set(filtered.map(p => p.playerId));
    const totalBetCount = filtered.reduce((sum, p) => sum + p.betCount, 0);
    const totalBetAmount = filtered.reduce((sum, p) => sum + parseFloat(p.betAmount), 0).toFixed(2);
    const totalPlayerWinLoss = filtered.reduce((sum, p) => sum + parseFloat(p.playerWinLoss), 0).toFixed(2);
    
    set({
      players: filtered.slice(start, end),
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
      filters: filters || {},
      totals: {
        totalPlayers: uniquePlayers.size,
        totalBetCount,
        totalBetAmount,
        totalPlayerWinLoss,
        totalWinLoss: totalPlayerWinLoss,
      },
      isLoading: false,
    });
  },

  fetchTotals: async (filters?: PlayerSummaryFilters) => {
    // TODO: Backend Integration
    // This can be a separate API call if needed, or totals can be included in fetchPlayers response
    // For now, totals are fetched together with players in fetchPlayers
    await get().fetchPlayers(filters);
  },
}));

