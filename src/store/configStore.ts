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

// Dummy configs
const dummyConfigs: GameConfig[] = [
  {
    id: 1,
    key: 'jwt.secret',
    value: '***hidden***',
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    key: 'game.betLimit.max',
    value: '10000',
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    key: 'game.betLimit.min',
    value: '10',
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    key: 'game.difficulty.multiplier.easy',
    value: '1.2',
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    key: 'game.difficulty.multiplier.medium',
    value: '1.5',
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    key: 'game.difficulty.multiplier.hard',
    value: '2.0',
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    key: 'game.difficulty.multiplier.daredevil',
    value: '3.0',
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const useConfigStore = create<ConfigState>((set, get) => ({
  configs: [],
  selectedConfig: null,
  isLoading: false,
  error: null,

  fetchConfigs: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set({
      configs: dummyConfigs,
      isLoading: false,
    });
  },

  fetchConfig: async (key: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const config = dummyConfigs.find(c => c.key === key);
    set({ selectedConfig: config || null, isLoading: false });
  },

  createConfig: async (key: string, value: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newConfig: GameConfig = {
      id: dummyConfigs.length + 1,
      key,
      value,
      updatedAt: new Date().toISOString(),
    };
    
    dummyConfigs.push(newConfig);
    set({ isLoading: false });
    await get().fetchConfigs();
  },

  updateConfig: async (key: string, value: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = dummyConfigs.findIndex(c => c.key === key);
    if (index !== -1) {
      dummyConfigs[index] = {
        ...dummyConfigs[index],
        value,
        updatedAt: new Date().toISOString(),
      };
    }
    
    set({ isLoading: false });
    await get().fetchConfigs();
  },

  deleteConfig: async (key: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = dummyConfigs.findIndex(c => c.key === key);
    if (index !== -1) {
      dummyConfigs.splice(index, 1);
    }
    
    set({ isLoading: false });
    await get().fetchConfigs();
  },
}));

