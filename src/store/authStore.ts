import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Admin, AdminRole } from '../types';
import apiService from '../services/api.service';

interface AuthState {
  admin: Admin | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiService.login(username, password);
          
          if (response.status === '0000') {
            const adminData = response.admin;
            const admin: Admin = {
              id: adminData.id,
              username: adminData.username,
              role: adminData.role === 'SUPER_ADMIN' ? AdminRole.SUPER_ADMIN : AdminRole.AGENT,
              agentId: adminData.agentId || undefined,
            };
        
        set({
          admin,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
          isAuthenticated: true,
          isLoading: false,
              error: null,
        });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Invalid username or password';
          set({
            admin: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        try {
          // Call logout API if token exists
          const state = useAuthStore.getState();
          if (state.accessToken) {
            await apiService.logout();
          }
        } catch (error) {
          // Ignore logout errors - clear state anyway
        } finally {
        set({
          admin: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
            error: null,
        });
        }
      },

      checkAuth: async () => {
        const state = useAuthStore.getState();
        if (state.accessToken) {
          try {
            // Verify token is still valid by calling /me endpoint
            const response = await apiService.getCurrentAdmin();
            if (response.status === '0000') {
              const adminData = response.data;
              const admin: Admin = {
                id: adminData.id,
                username: adminData.username,
                role: adminData.role === 'SUPER_ADMIN' ? AdminRole.SUPER_ADMIN : AdminRole.AGENT,
                agentId: adminData.agentId || undefined,
              };
              set({ admin, isAuthenticated: true });
            } else {
              set({ isAuthenticated: false });
            }
          } catch (error) {
            // Token invalid - clear auth
            set({
              admin: null,
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
            });
          }
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);

