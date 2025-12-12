import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBetStore } from '../store/betStore';
import { useAuthStore } from '../store/authStore';
import { Search, Eye, TrendingUp, Calendar, Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Pagination from '../components/Common/Pagination';
import BetDetailsModal from '../components/Common/BetDetailsModal';
import { formatDate, formatCurrency } from '../utils/formatters';
import { getLastTwoMonthsRange, getTodayRange, getThisWeekRange, getThisMonthRange, getLastMonthRange, formatDateForInput } from '../utils/dateFilters';
import { BetFilters, BetStatus, Difficulty } from '../types';
import apiService from '../services/api.service';

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
  const { bets, pagination, filters, summary, isLoading, error, fetchBets } = useBetStore();
  const { admin } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter options from API
  const [filterOptions, setFilterOptions] = useState<{
    games: string[];
    currencies: string[];
    platforms: string[];
    agentIds?: string[];
  }>({
    games: [],
    currencies: [],
    platforms: [],
    agentIds: [],
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  
  // Mobile accordion state for filters
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Bet details modal state
  const [selectedBetId, setSelectedBetId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initialize with "Last 2 Months" as default (as per design doc)
  const getDefaultFilters = (): BetFilters => {
    const twoMonthsRange = getLastTwoMonthsRange();
    return {
      fromDate: twoMonthsRange.fromDate,
      toDate: twoMonthsRange.toDate,
      limit: 20, // Default records per page
      page: 1, // Default page
    };
  };
  
  const [localFilters, setLocalFilters] = useState<BetFilters>(() => {
    // If filters are already set (from store), use them, otherwise use default
    return filters.fromDate && filters.toDate ? filters : getDefaultFilters();
  });

  // Sync localFilters with store filters when they change (e.g., after applying filters)
  useEffect(() => {
    if (filters.fromDate && filters.toDate) {
      setLocalFilters(filters);
    }
  }, [filters]);

  // Fetch filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const response = await apiService.getBetFilterOptions();
        if (response.status === '0000') {
          setFilterOptions(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
        // Fallback to empty arrays - dropdowns will show fallback values
      } finally {
        setIsLoadingOptions(false);
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    // On initial load, fetch with default "Last 2 Months" filter if no filters are set
    // If userId is in URL params (from Player Summary navigation), use it
    const userIdFromUrl = searchParams.get('userId');
    
    const initialFilters = filters.fromDate && filters.toDate ? filters : getDefaultFilters();
    if (!filters.fromDate || !filters.toDate) {
      setLocalFilters(initialFilters);
    }
    
    // If userId is in URL, add it to filters
    if (userIdFromUrl && !filters.userId) {
      const filtersWithUserId = { ...initialFilters, userId: userIdFromUrl };
      setLocalFilters(filtersWithUserId);
      fetchBets(filtersWithUserId);
    } else {
      fetchBets(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter changes (update local state only, don't call API)
  const handleFilterChange = (key: keyof BetFilters, value: string) => {
    // Convert empty strings to undefined to properly clear filters
    const cleanValue = value && value.trim() !== '' ? value.trim() : undefined;
    setLocalFilters({ ...localFilters, [key]: cleanValue });
  };

  // Handle date range changes (update local state only)
  const handleDateRangeChange = (fromDate?: string, toDate?: string) => {
    setLocalFilters({ ...localFilters, fromDate, toDate });
  };

  // Apply filters - called when Submit button is clicked
  const handleApplyFilters = () => {
    // Validate date range
    if (localFilters.fromDate && localFilters.toDate) {
      const fromDate = new Date(localFilters.fromDate);
      const toDate = new Date(localFilters.toDate);
      if (fromDate > toDate) {
        alert('From date cannot be after To date. Please select a valid date range.');
        return;
      }
    }

    // Clean filters: remove empty strings and ensure required fields
    const cleanedFilters: BetFilters = {
      ...localFilters,
      page: 1,
      limit: localFilters.limit || 20, // Preserve limit or use default
      // Remove empty string values
      userId: localFilters.userId && localFilters.userId.trim() !== '' ? localFilters.userId.trim() : undefined,
      agentId: localFilters.agentId && localFilters.agentId.trim() !== '' ? localFilters.agentId.trim() : undefined,
      platform: localFilters.platform && localFilters.platform.trim() !== '' ? localFilters.platform.trim() : undefined,
      game: localFilters.game && localFilters.game.trim() !== '' ? localFilters.game.trim() : undefined,
      status: localFilters.status && localFilters.status.trim() !== '' ? (localFilters.status.trim() as BetStatus) : undefined,
      difficulty: localFilters.difficulty && localFilters.difficulty.trim() !== '' ? (localFilters.difficulty.trim() as Difficulty) : undefined,
      currency: localFilters.currency && localFilters.currency.trim() !== '' ? localFilters.currency.trim() : undefined,
      // Ensure date range is set (required by backend)
      fromDate: localFilters.fromDate || getLastTwoMonthsRange().fromDate,
      toDate: localFilters.toDate || getLastTwoMonthsRange().toDate,
    };
    fetchBets(cleanedFilters);
  };

  // Reset filters to defaults
  const handleResetFilters = () => {
    const defaultFilters = getDefaultFilters();
    
    // Remove userId from URL params when resetting
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('userId');
    setSearchParams(newSearchParams, { replace: true });
    
    setLocalFilters(defaultFilters);
    fetchBets(defaultFilters);
  };

  // Handle page change (preserves current filters)
  const handlePageChange = (page: number) => {
    // Ensure date range is set when changing pages
    const filtersToApply: BetFilters = {
      ...localFilters,
      page,
      limit: localFilters.limit || 20,
      fromDate: localFilters.fromDate || getLastTwoMonthsRange().fromDate,
      toDate: localFilters.toDate || getLastTwoMonthsRange().toDate,
    };
    fetchBets(filtersToApply);
  };

  // Handle limit change (records per page)
  const handleLimitChange = (limit: number) => {
    const filtersToApply: BetFilters = {
      ...localFilters,
      limit,
      page: 1, // Reset to first page when changing limit
      fromDate: localFilters.fromDate || getLastTwoMonthsRange().fromDate,
      toDate: localFilters.toDate || getLastTwoMonthsRange().toDate,
    };
    setLocalFilters(filtersToApply);
    fetchBets(filtersToApply);
  };

  const getStatusBadge = (status: string) => {
    // Handle both enum values and string values
    const statusKey = status as BetStatus;
    const styles: Record<string, string> = {
      [BetStatus.PLACED]: 'badge-warning',
      [BetStatus.PENDING_SETTLEMENT]: 'badge-warning',
      [BetStatus.WON]: 'badge-success',
      [BetStatus.LOST]: 'badge-danger',
      [BetStatus.CANCELLED]: 'badge-info',
      [BetStatus.REFUNDED]: 'badge-info',
      [BetStatus.SETTLEMENT_FAILED]: 'badge-warning',
    };
    
    const badgeClass = styles[statusKey] || styles[status] || 'badge-secondary';
    // Format status for display (replace underscores with spaces, capitalize)
    const displayStatus = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return <span className={`badge ${badgeClass}`}>{displayStatus}</span>;
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

  const handleViewBet = (betId: string) => {
    setSelectedBetId(betId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBetId(null);
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
      <div className="bg-gray-50 rounded-lg border border-gray-200">
        {/* Mobile: Accordion Header */}
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="md:hidden w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-600" />
            <span className="font-medium text-gray-900">Filters</span>
          </div>
          {isFiltersOpen ? (
            <ChevronUp size={20} className="text-gray-600" />
          ) : (
            <ChevronDown size={20} className="text-gray-600" />
          )}
        </button>

        {/* Filters Content - Hidden on mobile when collapsed, always visible on desktop */}
        <div className={`${isFiltersOpen ? 'block' : 'hidden'} md:block p-4`}>
          <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Section 1: Date Filters (Left) */}
          <div className="flex flex-col gap-2 w-full md:flex-shrink-0 md:w-auto">
            {/* Calendar */}
            <div className="flex items-center gap-2 w-full">
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
                className="flex-1 md:w-32 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="flex-1 md:w-32 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {/* Quick Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Quick:</span>
              <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
                <button
                  onClick={() => {
                    const range = getTodayRange();
                    handleDateRangeChange(range.fromDate, range.toDate);
                    // Auto-apply quick date filters
                    fetchBets({ ...localFilters, fromDate: range.fromDate, toDate: range.toDate, page: 1 });
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    isDateRangeMatch(localFilters, getTodayRange()) 
                      ? 'bg-primary-500 text-white shadow-sm' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    const range = getThisWeekRange();
                    handleDateRangeChange(range.fromDate, range.toDate);
                    // Auto-apply quick date filters
                    fetchBets({ ...localFilters, fromDate: range.fromDate, toDate: range.toDate, page: 1 });
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    isDateRangeMatch(localFilters, getThisWeekRange()) 
                      ? 'bg-primary-500 text-white shadow-sm' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => {
                    const range = getThisMonthRange();
                    handleDateRangeChange(range.fromDate, range.toDate);
                    // Auto-apply quick date filters
                    fetchBets({ ...localFilters, fromDate: range.fromDate, toDate: range.toDate, page: 1 });
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    isDateRangeMatch(localFilters, getThisMonthRange()) 
                      ? 'bg-primary-500 text-white shadow-sm' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => {
                    const range = getLastMonthRange();
                    handleDateRangeChange(range.fromDate, range.toDate);
                    // Auto-apply quick date filters
                    fetchBets({ ...localFilters, fromDate: range.fromDate, toDate: range.toDate, page: 1 });
                  }}
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
          <div className="flex flex-col gap-2 w-full md:flex-1 md:min-w-0">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                id="search-user-id"
                name="search-user-id"
                value={localFilters.userId || ''}
                onChange={(e) => {
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full md:flex-1 md:min-w-0">
            <select
              id="filter-platform"
              name="filter-platform"
              value={localFilters.platform || ''}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
              className="min-w-0 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoadingOptions}
            >
              <option value="">Platform</option>
              {filterOptions.platforms.length > 0 ? (
                filterOptions.platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))
              ) : (
                // Fallback to hardcoded values if API hasn't loaded yet
                <>
              <option value="SPADE">SPADE</option>
              <option value="EVOLUTION">EVOLUTION</option>
              <option value="PRAGMATIC">PRAGMATIC</option>
                </>
              )}
            </select>
            <select
              id="filter-game"
              name="filter-game"
              value={localFilters.game || ''}
              onChange={(e) => handleFilterChange('game', e.target.value)}
              className="min-w-0 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoadingOptions}
            >
              <option value="">Game</option>
              {filterOptions.games.length > 0 ? (
                filterOptions.games.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))
              ) : (
                // Fallback to hardcoded values if API hasn't loaded yet
                <>
              <option value="ChickenRoad">ChickenRoad</option>
              <option value="LuckyWheel">LuckyWheel</option>
              <option value="DiceGame">DiceGame</option>
                </>
              )}
            </select>
            <select
              id="filter-status"
              name="filter-status"
              value={localFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="min-w-0 px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Status</option>
              {Object.values(BetStatus).map((status) => {
                // Format status for display (replace underscores with spaces, capitalize)
                const displayStatus = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return (
                  <option key={status} value={status}>
                    {displayStatus}
                  </option>
                );
              })}
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
              disabled={isLoadingOptions}
            >
              <option value="">Currency</option>
              {filterOptions.currencies.length > 0 ? (
                filterOptions.currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))
              ) : (
                // Fallback to hardcoded values if API hasn't loaded yet
              <option value="INR">INR</option>
              )}
            </select>
          </div>
        </div>

        {/* Submit and Reset Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full md:w-auto mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors shadow-sm"
          >
            <Filter size={16} />
            Apply Filters
          </button>
        </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchBets(localFilters)}
              className="text-red-700 hover:text-red-900 underline text-sm"
            >
              Retry
            </button>
          </div>
        </motion.div>
      )}

      {/* Bets Table */}
      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg font-medium mb-2">Failed to load bets</p>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={() => fetchBets(localFilters)}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : bets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg font-medium mb-2">No bets found</p>
            <p className="text-sm">Try adjusting your filters or date range</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Bet ID</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Player ID</th>
                    {admin?.role === 'SUPER_ADMIN' && (
                      <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Operator ID</th>
                    )}
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Platform</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Game</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Amount</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Win Amount</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Difficulty</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Actions</th>
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
                        {bet.id.slice(0, 12)}...
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {bet.userId}
                      </td>
                      {admin?.role === 'SUPER_ADMIN' && (
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {bet.operatorId || bet.agentId}
                        </td>
                      )}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {bet.platform || '-'}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {bet.game || '-'}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                        {formatCurrency(bet.betAmount, bet.currency)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-green-600">
                        {bet.winAmount ? formatCurrency(bet.winAmount, bet.currency) : '-'}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {getDifficultyBadge(bet.difficulty)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {getStatusBadge(bet.status)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {formatDate(bet.betPlacedAt)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm">
                        <button
                          onClick={() => handleViewBet(bet.id)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 min-h-[44px] sm:min-h-0 justify-end"
                        >
                          <Eye size={16} />
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination 
              pagination={pagination} 
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </>
        )}
      </div>

      {/* Bet Details Modal */}
      <BetDetailsModal
        betId={selectedBetId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

