import { create } from 'zustand';
import { User, Pagination, UserFilters } from '../types';

interface UserState {
  users: User[];
  selectedUser: User | null;
  pagination: Pagination;
  filters: UserFilters;
  isLoading: boolean;
  error: string | null;
  
  fetchUsers: (filters?: UserFilters) => Promise<void>;
  fetchUser: (userId: string, agentId: string) => Promise<void>;
  createUser: (data: Partial<User>) => Promise<void>;
  updateUser: (userId: string, agentId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string, agentId: string) => Promise<void>;
}

// Generate dummy users
const generateDummyUsers = (count: number): User[] => {
  const agents = ['agent001', 'agent002', 'agent003'];
  const currencies = ['INR'];
  const languages = ['en', 'es', 'fr', 'de'];
  
  return Array.from({ length: count }, (_, i) => ({
    userId: `user${String(i + 1).padStart(3, '0')}`,
    agentId: agents[i % agents.length],
    username: `Player ${i + 1}`,
    currency: currencies[i % currencies.length],
    betLimit: String((Math.floor(Math.random() * 10) + 1) * 1000),
    language: languages[i % languages.length],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

const dummyUsers = generateDummyUsers(150);

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUser: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  isLoading: false,
  error: null,

  fetchUsers: async (filters?: UserFilters) => {
    set({ isLoading: true, error: null });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...dummyUsers];
    
    if (filters) {
      if (filters.agentId) {
        filtered = filtered.filter(u => u.agentId === filters.agentId);
      }
      if (filters.currency) {
        filtered = filtered.filter(u => u.currency === filters.currency);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(u => 
          u.userId.toLowerCase().includes(search) ||
          u.username?.toLowerCase().includes(search)
        );
      }
    }
    
    const page = filters?.page || get().pagination.page || 1;
    const limit = 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    set({
      users: filtered.slice(start, end),
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
      filters: filters || {},
      isLoading: false,
    });
  },

  fetchUser: async (userId: string, agentId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = dummyUsers.find(u => u.userId === userId && u.agentId === agentId);
    set({ selectedUser: user || null, isLoading: false });
  },

  createUser: async (data: Partial<User>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      userId: data.userId || `user${Date.now()}`,
      agentId: data.agentId || 'agent001',
      username: data.username,
      currency: data.currency || 'INR',
      betLimit: data.betLimit || '1000',
      language: data.language,
      avatar: data.avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dummyUsers.unshift(newUser);
    set({ isLoading: false });
    await get().fetchUsers(get().filters);
  },

  updateUser: async (userId: string, agentId: string, data: Partial<User>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = dummyUsers.findIndex(u => u.userId === userId && u.agentId === agentId);
    if (index !== -1) {
      dummyUsers[index] = { ...dummyUsers[index], ...data, updatedAt: new Date().toISOString() };
    }
    
    set({ isLoading: false });
    await get().fetchUsers(get().filters);
  },

  deleteUser: async (userId: string, agentId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = dummyUsers.findIndex(u => u.userId === userId && u.agentId === agentId);
    if (index !== -1) {
      dummyUsers.splice(index, 1);
    }
    
    set({ isLoading: false });
    await get().fetchUsers(get().filters);
  },
}));

