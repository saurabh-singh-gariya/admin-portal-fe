import { Calendar, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTodayRange, getThisWeekRange, getThisMonthRange, getThisYearRange, formatDateForInput } from '../../utils/dateFilters';
import { BetFilters } from '../../types';

interface DateFilterButtonsProps {
  filters: BetFilters;
  onFilterChange: (filters: BetFilters) => void;
}

// Helper to check if current filters match a specific date range
const isDateRangeMatch = (filters: BetFilters, range: { fromDate: string; toDate: string }): boolean => {
  if (!filters.fromDate || !filters.toDate) return false;
  
  const filterFrom = new Date(filters.fromDate).setHours(0, 0, 0, 0);
  const filterTo = new Date(filters.toDate).setHours(23, 59, 59, 999);
  const rangeFrom = new Date(range.fromDate).setHours(0, 0, 0, 0);
  const rangeTo = new Date(range.toDate).setHours(23, 59, 59, 999);
  
  return filterFrom === rangeFrom && filterTo === rangeTo;
};

export default function DateFilterButtons({ filters, onFilterChange }: DateFilterButtonsProps) {
  const quickFilters = [
    { label: 'Today', getRange: getTodayRange },
    { label: 'This Week', getRange: getThisWeekRange },
    { label: 'This Month', getRange: getThisMonthRange },
    { label: 'This Year', getRange: getThisYearRange },
  ];

  // Check which quick filter is currently active
  const getActiveQuickFilter = () => {
    for (const filter of quickFilters) {
      if (isDateRangeMatch(filters, filter.getRange())) {
        return filter.label;
      }
    }
    return null;
  };

  const activeQuickFilter = getActiveQuickFilter();

  const handleQuickFilter = (getRange: () => { fromDate: string; toDate: string }) => {
    const range = getRange();
    onFilterChange({
      ...filters,
      fromDate: range.fromDate,
      toDate: range.toDate,
      page: 1,
    });
  };

  const handleCustomDateChange = (type: 'fromDate' | 'toDate', value: string) => {
    if (!value) {
      const newFilters = { ...filters };
      delete newFilters[type];
      onFilterChange({ ...newFilters, page: 1 });
      return;
    }

    const date = new Date(value);
    if (type === 'fromDate') {
      date.setHours(0, 0, 0, 0);
    } else {
      date.setHours(23, 59, 59, 999);
    }

    onFilterChange({
      ...filters,
      [type]: date.toISOString(),
      page: 1,
    });
  };

  const clearDateFilters = () => {
    const newFilters = { ...filters };
    delete newFilters.fromDate;
    delete newFilters.toDate;
    onFilterChange({ ...newFilters, page: 1 });
  };

  const hasDateFilter = !!(filters.fromDate || filters.toDate);

  return (
    <div className="space-y-2">
      {/* Quick Filter Buttons - Inline Compact */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-medium text-gray-600">Quick:</span>
        {quickFilters.map((filter) => {
          const isActive = activeQuickFilter === filter.label;
          return (
            <button
              key={filter.label}
              type="button"
              onClick={() => handleQuickFilter(filter.getRange)}
              className={`px-2 py-0.5 text-xs font-medium rounded transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
        {hasDateFilter && (
          <button
            type="button"
            onClick={clearDateFilters}
            className="px-1.5 py-0.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-all flex items-center gap-0.5"
          >
            <X size={10} />
            Clear
          </button>
        )}
      </div>

      {/* Custom Date Range - Inline Compact */}
      <div className="flex items-center gap-1.5">
        <Calendar className="text-gray-400 flex-shrink-0" size={12} />
        <div className="flex gap-1.5">
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">From</label>
            <input
              type="date"
              value={filters.fromDate ? formatDateForInput(filters.fromDate) : ''}
              onChange={(e) => handleCustomDateChange('fromDate', e.target.value)}
              max={filters.toDate ? formatDateForInput(filters.toDate) : undefined}
              className="w-32 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">To</label>
            <input
              type="date"
              value={filters.toDate ? formatDateForInput(filters.toDate) : ''}
              onChange={(e) => handleCustomDateChange('toDate', e.target.value)}
              min={filters.fromDate ? formatDateForInput(filters.fromDate) : undefined}
              className="w-32 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

