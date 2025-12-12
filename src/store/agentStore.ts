import { create } from 'zustand';
import { Agent, AgentWithStats, Pagination, AgentFilters, AgentTotals } from '../types';
import apiService from '../services/api.service';

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
    try {
      // Fetch agents and totals in parallel
      const [agentsResponse, totalsResponse] = await Promise.all([
        apiService.getAgents(filters),
        apiService.getAgentTotals(filters).catch(() => null), // Don't fail if totals fail
      ]);

      if (agentsResponse.status === '0000') {
        set({
          agents: agentsResponse.data.agents || [],
          pagination: agentsResponse.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
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
          error: agentsResponse.message || 'Failed to fetch agents',
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch agents',
      });
    }
  },

  fetchAgentTotals: async (filters?: AgentFilters) => {
    try {
      const response = await apiService.getAgentTotals(filters);
      if (response.status === '0000') {
        set({
          totals: response.data,
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch agent totals:', error);
      // Don't set error state for totals - it's not critical
    }
  },

  fetchAgent: async (_agentId: string) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      selectedAgent: null, 
      isLoading: false,
      error: 'Agent management API not implemented yet',
    });
  },

  createAgent: async (_data: Partial<Agent>) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      isLoading: false,
      error: 'Agent management API not implemented yet',
    });
  },

  updateAgent: async (_agentId: string, _data: Partial<Agent>) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      isLoading: false,
      error: 'Agent management API not implemented yet',
    });
  },

  deleteAgent: async (_agentId: string) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      isLoading: false,
      error: 'Agent management API not implemented yet',
    });
  },
}));

