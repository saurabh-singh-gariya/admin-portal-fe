import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerSummaryStore } from '../store/playerSummaryStore';
import { Search, Calendar, Eye, Filter, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Pagination from '../components/Common/Pagination';
import { formatCurrency } from '../utils/formatters';
import { getLastTwoMonthsRange, getTodayRange, getThisWeekRange, getThisMonthRange, getLastMonthRange, formatDateForInput } from '../utils/dateFilters';
import { PlayerSummaryFilters } from '../types';

export default function PlayerSummaryPage() {
  const { players, pagination, filters, totals, isLoading, fetchPlayers } = usePlayerSummaryStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  
  // Initialize with last 2 months as default
  const getDefaultFilters = (): PlayerSummaryFilters => {
    const twoMonthsRange = getLastTwoMonthsRange();
    return {
      fromDate: twoMonthsRange.fromDate,
      toDate: twoMonthsRange.toDate,
    };
  };
  
  const [localFilters, setLocalFilters] = useState<PlayerSummaryFilters>(() => {
    // Check if agentId is in URL params (from Agents page navigation)
    const urlParams = new URLSearchParams(window.location.search);
    const agentIdFromUrl = urlParams.get('agentId');
    
    const defaultFilters = filters.fromDate && filters.toDate ? filters : getDefaultFilters();
    if (agentIdFromUrl) {
      return { ...defaultFilters, agentId: agentIdFromUrl };
    }
    return defaultFilters;
  });

  useEffect(() => {
    // Check if agentId is in URL params (from navigation)
    const urlParams = new URLSearchParams(window.location.search);
    const agentIdFromUrl = urlParams.get('agentId');
    
    const initialFilters = filters.fromDate && filters.toDate ? filters : getDefaultFilters();
    if (!filters.fromDate || !filters.toDate) {
      setLocalFilters(initialFilters);
    }
    
    // If agentId is in URL, add it to filters
    if (agentIdFromUrl) {
      const filtersWithAgentId = { ...initialFilters, agentId: agentIdFromUrl };
      setLocalFilters(filtersWithAgentId);
      fetchPlayers(filtersWithAgentId);
    } else {
      fetchPlayers(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter changes (update local state only, don't call API)
  const handleFilterChange = (key: keyof PlayerSummaryFilters, value: string) => {
    setLocalFilters({ ...localFilters, [key]: value || undefined });
  };

  // Handle date range changes (update local state only)
  const handleDateRangeChange = (fromDate?: string, toDate?: string) => {
    setLocalFilters({ ...localFilters, fromDate, toDate });
  };

  // Apply filters - called when Submit button is clicked
  const handleApplyFilters = () => {
    const filtersToApply = { ...localFilters, page: 1 };
    fetchPlayers(filtersToApply);
  };

  // Reset filters to defaults
  const handleResetFilters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const agentIdFromUrl = urlParams.get('agentId');
    const defaultFilters = getDefaultFilters();
    const resetFilters = agentIdFromUrl 
      ? { ...defaultFilters, agentId: agentIdFromUrl }
      : defaultFilters;
    setLocalFilters(resetFilters);
    setSearch('');
    fetchPlayers(resetFilters);
  };

  // Handle page change (preserves current filters)
  const handlePageChange = (page: number) => {
    fetchPlayers({ ...localFilters, page });
  };

  const handleViewPlayerBets = (playerId: string) => {
    navigate(`/bets?userId=${playerId}`);
  };

  // Helper to check if current filters match a specific date range
  const isDateRangeMatch = (filters: PlayerSummaryFilters, range: { fromDate: string; toDate: string }): boolean => {
    if (!filters.fromDate || !filters.toDate) return false;
    const filterFrom = new Date(filters.fromDate).setHours(0, 0, 0, 0);
    const filterTo = new Date(filters.toDate).setHours(23, 59, 59, 999);
    const rangeFrom = new Date(range.fromDate).setHours(0, 0, 0, 0);
    const rangeTo = new Date(range.toDate).setHours(23, 59, 59, 999);
    return filterFrom === rangeFrom && filterTo === rangeTo;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mt-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Player Summary</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">View player statistics per platform-game combination</p>
      </div>

      {/* Summary Cards */}
      {totals && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
          >
            <p className="text-xs text-gray-500 mb-0.5">Total Players</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">{totals.totalPlayers.toLocaleString()}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
          >
            <p className="text-xs text-gray-500 mb-0.5">Total Bet Count</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">{totals.totalBetCount.toLocaleString()}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
          >
            <p className="text-xs text-gray-500 mb-0.5">Total Bet Amount</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {formatCurrency(totals.totalBetAmount, 'INR')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
          >
            <p className="text-xs text-gray-500 mb-0.5">Player Win/Loss</p>
            <p className={`text-lg sm:text-xl font-bold ${parseFloat(totals.totalPlayerWinLoss) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(totals.totalPlayerWinLoss, 'INR')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
          >
            <p className="text-xs text-gray-500 mb-0.5">Total Win/Loss</p>
            <p className={`text-lg sm:text-xl font-bold ${parseFloat(totals.totalWinLoss) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(totals.totalWinLoss, 'INR')}
            </p>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="flex flex-row gap-4 items-start">
          {/* Section 1: Date Filters (Left) */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {/* Calendar */}
            <div className="flex items-center gap-2 w-full justify-between">
              <Calendar className="text-gray-400 flex-shrink-0" size={16} />
              <input
                type="date"
                id="filter-from-date"
                name="filter-from-date"
                value={localFilters.fromDate ? formatDateForInput(localFilters.fromDate) : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value).setHours(0,0,0,0) : null;
                  handleDateRangeChange(date ? new Date(date).toISOString() : undefined, localFilters.toDate);
                }}
                min={formatDateForInput(getLastTwoMonthsRange().fromDate)}
                max={formatDateForInput(new Date().toISOString())}
                className="w-32 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <span className="text-xs text-gray-500">→</span>
              <input
                type="date"
                id="filter-to-date"
                name="filter-to-date"
                value={localFilters.toDate ? formatDateForInput(localFilters.toDate) : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value).setHours(23,59,59,999) : null;
                  handleDateRangeChange(localFilters.fromDate, date ? new Date(date).toISOString() : undefined);
                }}
                min={formatDateForInput(getLastTwoMonthsRange().fromDate)}
                max={formatDateForInput(new Date().toISOString())}
                className="w-32 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Quick:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handleDateRangeChange(getTodayRange().fromDate, getTodayRange().toDate)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    isDateRangeMatch(localFilters, getTodayRange()) 
                      ? 'bg-primary-500 text-white shadow-sm' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => handleDateRangeChange(getThisWeekRange().fromDate, getThisWeekRange().toDate)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    isDateRangeMatch(localFilters, getThisWeekRange()) 
                      ? 'bg-primary-500 text-white shadow-sm' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => handleDateRangeChange(getThisMonthRange().fromDate, getThisMonthRange().toDate)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    isDateRangeMatch(localFilters, getThisMonthRange()) 
                      ? 'bg-primary-500 text-white shadow-sm' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => handleDateRangeChange(getLastMonthRange().fromDate, getLastMonthRange().toDate)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    isDateRangeMatch(localFilters, getLastMonthRange()) 
                      ? 'bg-primary-500 text-white shadow-sm' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Last Month
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Search Items (Middle) */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                id="search-player-id"
                name="search-player-id"
                value={localFilters.playerId || search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleFilterChange('playerId', e.target.value);
                }}
                placeholder="Player ID..."
                className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyFilters();
                  }
                }}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                id="filter-agent-id"
                name="filter-agent-id"
                value={localFilters.agentId || ''}
                onChange={(e) => handleFilterChange('agentId', e.target.value)}
                placeholder="Agent ID"
                className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Section 3: Dropdowns (Right) */}
          <div className="grid grid-cols-2 gap-2 flex-1 min-w-0">
            <select
              id="filter-platform"
              name="filter-platform"
              value={localFilters.platform || ''}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
              className="min-w-0 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Platform</option>
              <option value="SPADE">SPADE</option>
              <option value="EVOLUTION">EVOLUTION</option>
              <option value="PRAGMATIC">PRAGMATIC</option>
            </select>
            <select
              id="filter-game"
              name="filter-game"
              value={localFilters.game || ''}
              onChange={(e) => handleFilterChange('game', e.target.value)}
              className="min-w-0 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Game</option>
              <option value="ChickenRoad">ChickenRoad</option>
              <option value="LuckyWheel">LuckyWheel</option>
              <option value="DiceGame">DiceGame</option>
            </select>
          </div>
        </div>

        {/* Submit and Reset Buttons */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors shadow-sm"
          >
            <Filter size={16} />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Players Table */}
      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Player ID</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Platform</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Game</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bet Count</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Bet Amount</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Player Win/Loss</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden xl:table-cell">Total Win/Loss</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {players.map((player) => (
                    <motion.tr
                      key={`${player.playerId}-${player.platform}-${player.game}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {player.playerId}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        {player.platform}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        {player.game}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {player.betCount.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900 hidden md:table-cell">
                        {formatCurrency(player.betAmount, 'INR')}
                      </td>
                      <td className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold hidden lg:table-cell ${
                        parseFloat(player.playerWinLoss) >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {formatCurrency(player.playerWinLoss, 'INR')}
                      </td>
                      <td className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold hidden xl:table-cell ${
                        parseFloat(player.totalWinLoss) >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {formatCurrency(player.totalWinLoss, 'INR')}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm">
                        <button
                          onClick={() => handleViewPlayerBets(player.playerId)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          title="View Player Bets"
                        >
                          <Eye size={16} />
                          <span className="hidden sm:inline">View Bets</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
}

