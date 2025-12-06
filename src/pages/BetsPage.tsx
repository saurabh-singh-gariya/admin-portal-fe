import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBetStore } from '../store/betStore';
import { useAuthStore } from '../store/authStore';
import { Search, Eye, TrendingUp, Calendar, Filter, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Pagination from '../components/Common/Pagination';
import { formatDate, formatCurrency } from '../utils/formatters';
import { getLastTwoMonthsRange, getTodayRange, getThisWeekRange, getThisMonthRange, getLastMonthRange, formatDateForInput } from '../utils/dateFilters';
import { BetFilters, BetStatus, Difficulty } from '../types';

// Helper to check if current filters match a specific date range
const isDateRangeMatch = (filters: BetFilters, range: { fromDate: string; toDate: string }): boolean => {
  if (!filters.fromDate || !filters.toDate) return false;
  const filterFrom = new Date(filters.fromDate).setHours(0, 0, 0, 0);
  const filterTo = new Date(filters.toDate).setHours(23, 59, 59, 999);
  const rangeFrom = new Date(range.fromDate).setHours(0, 0, 0, 0);
  const rangeTo = new Date(range.toDate).setHours(23, 59, 59, 999);
  return filterFrom === rangeFrom && filterTo === rangeTo;
};

export default function BetsPage() {
  const { bets, pagination, filters, summary, isLoading, fetchBets } = useBetStore();
  const { admin } = useAuthStore();
  const [search, setSearch] = useState('');
  
  // Initialize with "Last 2 Months" as default (as per design doc)
  const getDefaultFilters = (): BetFilters => {
    const twoMonthsRange = getLastTwoMonthsRange();
    return {
      fromDate: twoMonthsRange.fromDate,
      toDate: twoMonthsRange.toDate,
    };
  };
  
  const [localFilters, setLocalFilters] = useState<BetFilters>(() => {
    // If filters are already set (from store), use them, otherwise use default
    return filters.fromDate && filters.toDate ? filters : getDefaultFilters();
  });

  useEffect(() => {
    // On initial load, fetch with default "Last 2 Months" filter if no filters are set
    // If userId is in URL params (from Player Summary navigation), use it
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('userId');
    
    const initialFilters = filters.fromDate && filters.toDate ? filters : getDefaultFilters();
    if (!filters.fromDate || !filters.toDate) {
      setLocalFilters(initialFilters);
    }
    
    // If userId is in URL, add it to filters
    if (userIdFromUrl && !filters.userId) {
      const filtersWithUserId = { ...initialFilters, userId: userIdFromUrl };
      setLocalFilters(filtersWithUserId);
      setSearch(userIdFromUrl);
      fetchBets(filtersWithUserId);
    } else {
      fetchBets(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter changes (update local state only, don't call API)
  const handleFilterChange = (key: keyof BetFilters, value: string) => {
    setLocalFilters({ ...localFilters, [key]: value || undefined });
  };

  // Handle date range changes (update local state only)
  const handleDateRangeChange = (fromDate?: string, toDate?: string) => {
    setLocalFilters({ ...localFilters, fromDate, toDate });
  };

  // Apply filters - called when Submit button is clicked
  const handleApplyFilters = () => {
    const filtersToApply = { ...localFilters, page: 1 };
    fetchBets(filtersToApply);
  };

  // Reset filters to defaults
  const handleResetFilters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('userId');
    const defaultFilters = getDefaultFilters();
    const resetFilters = userIdFromUrl 
      ? { ...defaultFilters, userId: userIdFromUrl }
      : defaultFilters;
    setLocalFilters(resetFilters);
    setSearch(userIdFromUrl || '');
    fetchBets(resetFilters);
  };

  // Handle page change (preserves current filters)
  const handlePageChange = (page: number) => {
    fetchBets({ ...localFilters, page });
  };

  const getStatusBadge = (status: BetStatus) => {
    const styles = {
      [BetStatus.WON]: 'badge-success',
      [BetStatus.LOST]: 'badge-danger',
      [BetStatus.PENDING]: 'badge-warning',
      [BetStatus.CANCELLED]: 'badge-info',
    };
    return <span className={`badge ${styles[status]}`}>{status}</span>;
  };

  const getDifficultyBadge = (difficulty: Difficulty) => {
    const colors = {
      [Difficulty.EASY]: 'bg-green-100 text-green-800',
      [Difficulty.MEDIUM]: 'bg-blue-100 text-blue-800',
      [Difficulty.HARD]: 'bg-yellow-100 text-yellow-800',
      [Difficulty.DAREDEVIL]: 'bg-red-100 text-red-800',
    };
    return <span className={`badge ${colors[difficulty]}`}>{difficulty}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mt-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Player Bets</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">View and analyze all bets (last 2 months)</p>
      </div>

      {/* Summary Cards - Compact Design */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
          >
            <p className="text-xs text-gray-500 mb-0.5">Total Bets</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">{summary.totalBets}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
          >
            <p className="text-xs text-gray-500 mb-0.5">Total Bet Amount</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {formatCurrency(summary.totalBetAmount, 'INR')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
          >
            <p className="text-xs text-gray-500 mb-0.5">Total Win Amount</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {formatCurrency(summary.totalWinAmount, 'INR')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <TrendingUp className="text-green-600" size={14} />
              <p className="text-xs text-gray-600">Net Revenue</p>
            </div>
            <p className="text-lg sm:text-xl font-bold text-green-700">
              {formatCurrency(summary.netRevenue, 'INR')}
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
                id="search-user-id"
                name="search-user-id"
                value={localFilters.userId || search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleFilterChange('userId', e.target.value);
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
            {admin?.role === 'SUPER_ADMIN' && (
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
            )}
          </div>

          {/* Section 3: Dropdowns (Right) */}
          <div className="grid grid-cols-3 gap-2 flex-1 min-w-0">
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
            <select
              id="filter-status"
              name="filter-status"
              value={localFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="min-w-0 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Status</option>
              {Object.values(BetStatus).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              id="filter-difficulty"
              name="filter-difficulty"
              value={localFilters.difficulty || ''}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="min-w-0 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Difficulty</option>
              {Object.values(Difficulty).map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
            <select
              id="filter-currency"
              name="filter-currency"
              value={localFilters.currency || ''}
              onChange={(e) => handleFilterChange('currency', e.target.value)}
              className="min-w-0 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Currency</option>
              <option value="INR">INR</option>
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

      {/* Bets Table */}
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
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bet ID</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Player ID</th>
                    {admin?.role === 'SUPER_ADMIN' && (
                      <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Operator ID</th>
                    )}
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Platform</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Game</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Win Amount</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Difficulty</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Date</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bets.map((bet) => (
                    <motion.tr
                      key={bet.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        <div className="flex flex-col">
                          <span>{bet.id.slice(0, 12)}...</span>
                          <span className="text-xs text-gray-500 sm:hidden mt-1">{bet.userId}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                        {bet.userId}
                      </td>
                      {admin?.role === 'SUPER_ADMIN' && (
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                          {bet.operatorId || bet.agentId}
                        </td>
                      )}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        {bet.platform || '-'}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        {bet.game || '-'}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                        {formatCurrency(bet.betAmount, bet.currency)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-green-600 hidden lg:table-cell">
                        {bet.winAmount ? formatCurrency(bet.winAmount, bet.currency) : '-'}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm hidden md:table-cell">
                        {getDifficultyBadge(bet.difficulty)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {getStatusBadge(bet.status)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        {formatDate(bet.betPlacedAt)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm">
                        <Link
                          to={`/bets/${bet.id}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 min-h-[44px] sm:min-h-0 justify-end"
                        >
                          <Eye size={16} />
                          <span className="hidden sm:inline">View</span>
                        </Link>
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

