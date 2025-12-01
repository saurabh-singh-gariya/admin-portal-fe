export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  AGENT = 'AGENT',
}

export enum BetStatus {
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST',
  CANCELLED = 'CANCELLED',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
 DAREDEVIL = 'DAREDEVIL',
}

export interface Admin {
  id: string;
  username: string;
  role: AdminRole;
  agentId?: string;
  email?: string;
  fullName?: string;
}

export interface User {
  userId: string;
  agentId: string;
  username?: string;
  currency: string;
  betLimit: string;
  language?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bet {
  id: string;
  externalPlatformTxId?: string;
  userId: string;
  agentId: string;
  operatorId?: string;
  roundId?: string;
  difficulty: Difficulty;
  betAmount: string;
  winAmount?: string;
  currency: string;
  status: BetStatus;
  betPlacedAt: string;
  settledAt?: string;
}

export interface Agent {
  agentId: string;
  cert?: string;
  agentIPaddress: string;
  callbackURL: string;
  isWhitelisted: boolean;
  createdAt: string;
  updatedAt: string;
  statistics?: {
    userCount: number;
    totalBets: number;
    totalBetVolume: string;
  };
}

export interface GameConfig {
  id: number;
  key: string;
  value: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserFilters {
  agentId?: string;
  currency?: string;
  search?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
}

export interface BetFilters {
  userId?: string;
  agentId?: string;
  status?: BetStatus;
  difficulty?: Difficulty;
  currency?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalAgents: number;
  activeUsers: number;
  totalBets: number;
  totalBetVolume: string;
  totalWinAmount: string;
  netRevenue: string;
  recentActivity?: any[];
}

