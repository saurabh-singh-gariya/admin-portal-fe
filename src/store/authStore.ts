import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Admin, AdminRole } from '../types';

interface AuthState {
  admin: Admin | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Dummy admin data
const dummyAdmins: Record<string, Admin> = {
  'superadmin': {
    id: '1',
    username: 'superadmin',
    role: AdminRole.SUPER_ADMIN,
    email: 'superadmin@example.com',
    fullName: 'Super Admin',
  },
  'agentadmin': {
    id: '2',
    username: 'agentadmin',
    role: AdminRole.AGENT,
    agentId: 'agent001',
    email: 'agent@example.com',
    fullName: 'Agent Admin',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dummy authentication - accept any password
        const admin = dummyAdmins[username.toLowerCase()] || dummyAdmins['superadmin'];
        const token = `dummy_token_${Date.now()}`;
        
        set({
          admin,
          accessToken: token,
          refreshToken: `refresh_${token}`,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          admin: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        // Check if token exists (dummy check)
        const state = useAuthStore.getState();
        if (state.accessToken) {
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);

