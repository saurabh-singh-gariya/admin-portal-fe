import { create } from 'zustand';
import { DashboardStats } from '../types';

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  
  fetchDashboardStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Dummy dashboard stats
    const stats: DashboardStats = {
      totalUsers: 150,
      totalAgents: 3,
      activeUsers: 95,
      totalBets: 5000,
      totalBetVolume: '500000.00',
      totalWinAmount: '450000.00',
      netRevenue: '50000.00',
      recentActivity: [
        { type: 'user_created', user: 'user001', time: new Date().toISOString() },
        { type: 'bet_placed', user: 'user002', amount: '100.00', time: new Date().toISOString() },
        { type: 'bet_won', user: 'user003', amount: '150.00', time: new Date().toISOString() },
      ],
    };
    
    set({ stats, isLoading: false });
  },
}));

