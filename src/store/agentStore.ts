import { create } from 'zustand';
import { Agent, AgentWithStats, Pagination, AgentFilters, AgentTotals } from '../types';

interface AgentState {
  agents: AgentWithStats[];
  selectedAgent: Agent | null;
  pagination: Pagination;
  filters: AgentFilters;
  totals: AgentTotals | null;
  isLoading: boolean;
  error: string | null;
  
  fetchAgents: (filters?: AgentFilters) => Promise<void>;
  fetchAgent: (agentId: string) => Promise<void>;
  fetchAgentTotals: (filters?: AgentFilters) => Promise<void>;
  createAgent: (data: Partial<Agent>) => Promise<void>;
  updateAgent: (agentId: string, data: Partial<Agent>) => Promise<void>;
  deleteAgent: (agentId: string) => Promise<void>;
}

// Dummy agents with stats (separate rows per agent-platform-game combination)
const generateDummyAgentsWithStats = (): AgentWithStats[] => {
  const agents = ['agent001', 'agent002', 'agent003'];
  const platforms = ['SPADE', 'EVOLUTION', 'PRAGMATIC'];
  const games = ['ChickenRoad', 'LuckyWheel', 'DiceGame'];
  
  const result: AgentWithStats[] = [];
  
  agents.forEach(agentId => {
    platforms.forEach(platform => {
      games.forEach(game => {
        const betAmount = (Math.random() * 100000 + 10000).toFixed(2);
        const winAmount = (parseFloat(betAmount) * (0.85 + Math.random() * 0.1)).toFixed(2);
        const winLoss = (parseFloat(betAmount) - parseFloat(winAmount)).toFixed(2);
        const marginPercent = ((parseFloat(betAmount) - parseFloat(winAmount)) / parseFloat(betAmount)) * 100;
        const companyTotalWinLoss = (parseFloat(betAmount) - parseFloat(winAmount)).toFixed(2);
        
        result.push({
          agentId,
          platform,
          game,
          betCount: Math.floor(Math.random() * 1000 + 100),
          betAmount,
          winLoss, // Positive = company profit, negative = players won more
          adjustment: '0.00',
          totalWinLoss: winLoss,
          marginPercent: parseFloat(marginPercent.toFixed(2)),
          companyTotalWinLoss,
          agentIPaddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          callbackURL: `https://${agentId}.example.com/callback`,
          isWhitelisted: Math.random() > 0.3,
          createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    });
  });
  
  return result;
};

const dummyAgentsWithStats = generateDummyAgentsWithStats();

// Keep old dummy agents for agent details/edit
const dummyAgents: Agent[] = [
  {
    agentId: 'agent001',
    agentIPaddress: '192.168.1.100',
    callbackURL: 'https://agent1.example.com/callback',
    isWhitelisted: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    statistics: {
      userCount: 50,
      totalBets: 1500,
      totalBetVolume: '150000.00',
    },
  },
  {
    agentId: 'agent002',
    agentIPaddress: '192.168.1.101',
    callbackURL: 'https://agent2.example.com/callback',
    isWhitelisted: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    statistics: {
      userCount: 35,
      totalBets: 1200,
      totalBetVolume: '120000.00',
    },
  },
  {
    agentId: 'agent003',
    agentIPaddress: '192.168.1.102',
    callbackURL: 'https://agent3.example.com/callback',
    isWhitelisted: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    statistics: {
      userCount: 25,
      totalBets: 800,
      totalBetVolume: '80000.00',
    },
  },
];

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  selectedAgent: null,
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

  fetchAgents: async (filters?: AgentFilters) => {
    set({ isLoading: true, error: null });
    
    // TODO: Backend Integration
    // Replace this dummy implementation with:
    // try {
    //   // Fetch agents data
    //   const agentsResponse = await apiService.getAgents(filters);
    //   // Fetch totals (calculated from ALL filtered records, not just current page)
    //   const totalsResponse = await apiService.getAgentTotals(filters);
    //   
    //   if (agentsResponse.status === '0000' && totalsResponse.status === '0000') {
    //     set({
    //       agents: agentsResponse.data.agents,
    //       pagination: agentsResponse.data.pagination,
    //       totals: totalsResponse.data, // Totals from separate endpoint
    //       filters: filters || {},
    //       isLoading: false,
    //     });
    //   } else {
    //     throw new Error(agentsResponse.message || 'Failed to fetch agents');
    //   }
    // } catch (error: any) {
    //   set({ error: error.message || 'Failed to fetch agents', isLoading: false });
    // }
    
    // Dummy implementation - remove when backend is ready
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...dummyAgentsWithStats];
    
    // Apply filters
    if (filters) {
      if (filters.agentId) {
        filtered = filtered.filter(a => a.agentId.toLowerCase().includes(filters.agentId!.toLowerCase()));
      }
      if (filters.platform) {
        filtered = filtered.filter(a => a.platform === filters.platform);
      }
      if (filters.game) {
        filtered = filtered.filter(a => a.game === filters.game);
      }
      // Date filtering would be applied here if needed
    }
    
    const page = filters?.page || get().pagination.page || 1;
    const limit = 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    // Calculate totals from ALL filtered records (not just current page)
    const totalBetCount = filtered.reduce((sum, a) => sum + a.betCount, 0);
    const totalBetAmount = filtered.reduce((sum, a) => sum + parseFloat(a.betAmount), 0).toFixed(2);
    const totalWinLoss = filtered.reduce((sum, a) => sum + parseFloat(a.winLoss), 0).toFixed(2);
    const totalCompanyWinLoss = filtered.reduce((sum, a) => sum + parseFloat(a.companyTotalWinLoss), 0).toFixed(2);
    const totalMarginPercent = totalBetAmount !== '0.00' 
      ? ((parseFloat(totalBetAmount) - (parseFloat(totalBetAmount) - parseFloat(totalCompanyWinLoss))) / parseFloat(totalBetAmount)) * 100
      : 0;
    
    set({
      agents: filtered.slice(start, end),
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
      filters: filters || {},
      totals: {
        totalBetCount,
        totalBetAmount,
        totalWinLoss,
        totalMarginPercent: parseFloat(totalMarginPercent.toFixed(2)),
        companyTotalWinLoss: totalCompanyWinLoss,
      },
      isLoading: false,
    });
  },

  fetchAgentTotals: async (filters?: AgentFilters) => {
    // TODO: Backend Integration
    // This can be a separate API call if needed, or totals can be included in fetchAgents response
    // For now, totals are fetched together with agents in fetchAgents
    await get().fetchAgents(filters);
  },

  fetchAgent: async (agentId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const agent = dummyAgents.find(a => a.agentId === agentId);
    set({ selectedAgent: agent || null, isLoading: false });
  },

  createAgent: async (data: Partial<Agent>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAgent: Agent = {
      agentId: data.agentId || `agent${Date.now()}`,
      agentIPaddress: data.agentIPaddress || '0.0.0.0',
      callbackURL: data.callbackURL || '',
      isWhitelisted: data.isWhitelisted ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statistics: {
        userCount: 0,
        totalBets: 0,
        totalBetVolume: '0.00',
      },
    };
    
    dummyAgents.push(newAgent);
    set({ isLoading: false });
    await get().fetchAgents();
  },

  updateAgent: async (agentId: string, data: Partial<Agent>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = dummyAgents.findIndex(a => a.agentId === agentId);
    if (index !== -1) {
      dummyAgents[index] = { ...dummyAgents[index], ...data, updatedAt: new Date().toISOString() };
    }
    
    set({ isLoading: false });
    await get().fetchAgents();
  },

  deleteAgent: async (agentId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = dummyAgents.findIndex(a => a.agentId === agentId);
    if (index !== -1) {
      dummyAgents.splice(index, 1);
    }
    
    set({ isLoading: false });
    await get().fetchAgents();
  },
}));

