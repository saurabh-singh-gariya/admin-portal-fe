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
  platform?: string;
  game?: string; // Game name (e.g., "ChickenRoad", "LuckyWheel")
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
  platform?: string;
  game?: string; // Game name filter
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

// Agent with statistics (for Agents page)
export interface AgentWithStats {
  agentId: string;
  platform: string;
  game: string; // Game name (e.g., "ChickenRoad", "LuckyWheel")
  betCount: number;
  betAmount: string;
  winLoss: string; // Player Win/Loss (positive = company profit, negative = players won more)
  adjustment: string; // Always 0.00 (visible but read-only)
  totalWinLoss: string; // Win/Loss + Adjustment
  marginPercent: number; // Company earnings percentage: ((Bet Amount - Win Amount) / Bet Amount) * 100
  companyTotalWinLoss: string; // Bet Amount - Win Amount (positive = company profit)
  cert?: string;
  agentIPaddress?: string;
  callbackURL?: string;
  isWhitelisted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Player Summary (for Player Summary page)
export interface PlayerSummary {
  playerId: string;
  platform: string;
  game: string; // Game name/code
  betCount: number;
  betAmount: string;
  playerWinLoss: string; // Player Win/Loss (positive = company profit, negative = players won more)
  totalWinLoss: string; // Same as playerWinLoss (adjustments not applied at player level)
}

// Filters
export interface AgentFilters {
  agentId?: string;
  platform?: string;
  game?: string; // Game name filter
  fromDate?: string;
  toDate?: string;
  page?: number;
}

export interface PlayerSummaryFilters {
  playerId?: string;
  platform?: string;
  game?: string; // Game name filter
  agentId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
}

// Totals interfaces
export interface BetTotals {
  totalBets: number;
  totalBetAmount: string;
  totalWinAmount: string;
  netRevenue: string;
}

export interface AgentTotals {
  totalBetCount: number;
  totalBetAmount: string;
  totalWinLoss: string;
  totalMarginPercent: number;
  companyTotalWinLoss: string;
}

export interface PlayerSummaryTotals {
  totalPlayers: number; // Unique count of players
  totalBetCount: number;
  totalBetAmount: string;
  totalPlayerWinLoss: string;
  totalWinLoss: string;
}

