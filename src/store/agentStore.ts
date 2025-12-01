import { create } from 'zustand';
import { Agent, Pagination } from '../types';

interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
  
  fetchAgents: () => Promise<void>;
  fetchAgent: (agentId: string) => Promise<void>;
  createAgent: (data: Partial<Agent>) => Promise<void>;
  updateAgent: (agentId: string, data: Partial<Agent>) => Promise<void>;
  deleteAgent: (agentId: string) => Promise<void>;
}

// Dummy agents
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
  isLoading: false,
  error: null,

  fetchAgents: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set({
      agents: dummyAgents,
      pagination: {
        page: 1,
        limit: 20,
        total: dummyAgents.length,
        totalPages: 1,
      },
      isLoading: false,
    });
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

