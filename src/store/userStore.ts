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

  fetchUsers: async (_filters?: UserFilters) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({
      users: [], 
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      isLoading: false,
      error: 'User management API not implemented yet',
    });
  },

  fetchUser: async (_userId: string, _agentId: string) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      selectedUser: null, 
      isLoading: false,
      error: 'User management API not implemented yet',
    });
  },

  createUser: async (_data: Partial<User>) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      isLoading: false,
      error: 'User management API not implemented yet',
    });
  },

  updateUser: async (_userId: string, _agentId: string, _data: Partial<User>) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      isLoading: false,
      error: 'User management API not implemented yet',
    });
  },

  deleteUser: async (_userId: string, _agentId: string) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      isLoading: false,
      error: 'User management API not implemented yet',
    });
  },
}));

