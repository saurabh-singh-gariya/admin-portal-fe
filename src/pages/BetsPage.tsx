import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBetStore } from '../store/betStore';
import { useAuthStore } from '../store/authStore';
import { Search, Eye, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Pagination from '../components/Common/Pagination';
import { formatDate, formatCurrency } from '../utils/formatters';
import { getThisWeekRange, getTodayRange, getThisMonthRange, getThisYearRange, formatDateForInput } from '../utils/dateFilters';
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
  
  // Initialize with "This Week" as default
  const getDefaultFilters = (): BetFilters => {
    const thisWeekRange = getThisWeekRange();
    return {
      fromDate: thisWeekRange.fromDate,
      toDate: thisWeekRange.toDate,
    };
  };
  
  const [localFilters, setLocalFilters] = useState<BetFilters>(() => {
    // If filters are already set (from store), use them, otherwise use default
    return filters.fromDate && filters.toDate ? filters : getDefaultFilters();
  });

  useEffect(() => {
    // On initial load, fetch with default "This Week" filter if no filters are set
    const initialFilters = filters.fromDate && filters.toDate ? filters : getDefaultFilters();
    if (!filters.fromDate || !filters.toDate) {
      setLocalFilters(initialFilters);
    }
    fetchBets(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key: keyof BetFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value, page: 1 };
    setLocalFilters(newFilters);
    fetchBets(newFilters);
  };

  const handleDateFilterChange = (newFilters: BetFilters) => {
    setLocalFilters(newFilters);
    fetchBets(newFilters);
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bet History</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">View and analyze all bets</p>
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

      {/* Filters - Always Open, Ultra Compact */}
      <div className="bg-white rounded-lg border border-gray-200 p-2.5 sm:p-3">
        <div className="flex flex-col gap-3">
          {/* Search - Full Width on Mobile */}
          <div className="w-full relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              id="search-user-id"
              name="search-user-id"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="User ID..."
              className="w-full pl-9 pr-3 py-2.5 sm:py-2 text-sm sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* All Filters - Responsive Layout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            {/* Date Quick Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs sm:text-xs font-medium text-gray-600 whitespace-nowrap">Quick:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handleDateFilterChange({ ...localFilters, ...getTodayRange(), page: 1 })}
                  className={`px-3 py-2 sm:px-2.5 sm:py-1 text-sm sm:text-xs font-medium rounded transition-colors whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                    isDateRangeMatch(localFilters, getTodayRange()) ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => handleDateFilterChange({ ...localFilters, ...getThisWeekRange(), page: 1 })}
                  className={`px-3 py-2 sm:px-2.5 sm:py-1 text-sm sm:text-xs font-medium rounded transition-colors whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                    isDateRangeMatch(localFilters, getThisWeekRange()) ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => handleDateFilterChange({ ...localFilters, ...getThisMonthRange(), page: 1 })}
                  className={`px-3 py-2 sm:px-2.5 sm:py-1 text-sm sm:text-xs font-medium rounded transition-colors whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                    isDateRangeMatch(localFilters, getThisMonthRange()) ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => handleDateFilterChange({ ...localFilters, ...getThisYearRange(), page: 1 })}
                  className={`px-3 py-2 sm:px-2.5 sm:py-1 text-sm sm:text-xs font-medium rounded transition-colors whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                    isDateRangeMatch(localFilters, getThisYearRange()) ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  This Year
                </button>
              </div>
            </div>

            {/* Date Range Inputs */}
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-400 flex-shrink-0" size={16} />
              <input
                type="date"
                id="filter-from-date"
                name="filter-from-date"
                value={localFilters.fromDate ? formatDateForInput(localFilters.fromDate) : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value).setHours(0,0,0,0) : null;
                  handleDateFilterChange({ ...localFilters, fromDate: date ? new Date(date).toISOString() : undefined, page: 1 });
                }}
                className="flex-1 sm:w-32 px-2.5 py-2 sm:py-1 text-sm sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[44px] sm:min-h-0"
              />
              <span className="text-sm sm:text-xs text-gray-400">→</span>
              <input
                type="date"
                id="filter-to-date"
                name="filter-to-date"
                value={localFilters.toDate ? formatDateForInput(localFilters.toDate) : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value).setHours(23,59,59,999) : null;
                  handleDateFilterChange({ ...localFilters, toDate: date ? new Date(date).toISOString() : undefined, page: 1 });
                }}
                className="flex-1 sm:w-32 px-2.5 py-2 sm:py-1 text-sm sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[44px] sm:min-h-0"
              />
            </div>

            {/* Other Filters - Stack on Mobile */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2 sm:ml-auto">
              {admin?.role === 'SUPER_ADMIN' && (
                <input
                  type="text"
                  id="filter-agent-id"
                  name="filter-agent-id"
                  value={localFilters.agentId || ''}
                  onChange={(e) => handleFilterChange('agentId', e.target.value)}
                  placeholder="Agent ID"
                  className="flex-1 sm:w-32 px-2.5 py-2 sm:py-1 text-sm sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[44px] sm:min-h-0"
                />
              )}
              <select
                id="filter-status"
                name="filter-status"
                value={localFilters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="flex-1 sm:w-28 px-2.5 py-2 sm:py-1 text-sm sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[44px] sm:min-h-0"
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
                className="flex-1 sm:w-32 px-2.5 py-2 sm:py-1 text-sm sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[44px] sm:min-h-0"
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
                className="flex-1 sm:w-24 px-2.5 py-2 sm:py-1 text-sm sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[44px] sm:min-h-0"
              >
                <option value="">Currency</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>
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
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">User ID</th>
                    {admin?.role === 'SUPER_ADMIN' && (
                      <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Operator ID</th>
                    )}
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
                          {bet.operatorId}
                        </td>
                      )}
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

