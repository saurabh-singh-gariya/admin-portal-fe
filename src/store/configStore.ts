import { create } from 'zustand';
import { GameConfig } from '../types';

interface ConfigState {
  configs: GameConfig[];
  selectedConfig: GameConfig | null;
  isLoading: boolean;
  error: string | null;
  
  fetchConfigs: () => Promise<void>;
  fetchConfig: (key: string) => Promise<void>;
  createConfig: (key: string, value: string) => Promise<void>;
  updateConfig: (key: string, value: string) => Promise<void>;
  deleteConfig: (key: string) => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  configs: [],
  selectedConfig: null,
  isLoading: false,
  error: null,

  fetchConfigs: async () => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      configs: [],
      isLoading: false,
      error: 'Config management API not implemented yet',
    });
  },

  fetchConfig: async (_key: string) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      selectedConfig: null, 
      isLoading: false,
      error: 'Config management API not implemented yet',
    });
  },

  createConfig: async (_key: string, _value: string) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      isLoading: false,
      error: 'Config management API not implemented yet',
    });
  },

  updateConfig: async (_key: string, _value: string) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      isLoading: false,
      error: 'Config management API not implemented yet',
    });
  },

  deleteConfig: async (_key: string) => {
    set({ isLoading: true, error: null });
    // API not implemented yet
    set({ 
      isLoading: false,
      error: 'Config management API not implemented yet',
    });
  },
}));

