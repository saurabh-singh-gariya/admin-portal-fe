/**
 * Date filter utilities for bet filtering
 * These functions generate date ranges for quick filter buttons
 */

export interface DateRange {
  fromDate: string; // ISO string
  toDate: string;   // ISO string
}

/**
 * Get date range for "Today"
 */
export function getTodayRange(): DateRange {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  
  return {
    fromDate: today.toISOString(),
    toDate: endOfToday.toISOString(),
  };
}

/**
 * Get date range for "This Week" (Monday to Sunday)
 */
export function getThisWeekRange(): DateRange {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
  
  const startOfWeek = new Date(today.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return {
    fromDate: startOfWeek.toISOString(),
    toDate: endOfWeek.toISOString(),
  };
}

/**
 * Get date range for "This Month"
 */
export function getThisMonthRange(): DateRange {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  
  return {
    fromDate: startOfMonth.toISOString(),
    toDate: endOfMonth.toISOString(),
  };
}

/**
 * Get date range for "Last Month"
 */
export function getLastMonthRange(): DateRange {
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  lastMonth.setHours(0, 0, 0, 0);
  
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  endOfLastMonth.setHours(23, 59, 59, 999);
  
  return {
    fromDate: lastMonth.toISOString(),
    toDate: endOfLastMonth.toISOString(),
  };
}

/**
 * Get date range for "This Year"
 */
export function getThisYearRange(): DateRange {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  endOfYear.setHours(23, 59, 59, 999);
  
  return {
    fromDate: startOfYear.toISOString(),
    toDate: endOfYear.toISOString(),
  };
}

/**
 * Get date range for "Last 2 Months" (default for Player Bets page)
 * Returns data from 2 months ago to today
 */
export function getLastTwoMonthsRange(): DateRange {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(today.getMonth() - 2);
  twoMonthsAgo.setDate(1); // First day of the month
  twoMonthsAgo.setHours(0, 0, 0, 0);
  
  return {
    fromDate: twoMonthsAgo.toISOString(),
    toDate: today.toISOString(),
  };
}

/**
 * Format date for input[type="date"] (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert date input string to ISO string (start of day)
 */
export function dateInputToISO(dateString: string): string {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

/**
 * Convert date input string to ISO string (end of day)
 */
export function dateInputToISOEnd(dateString: string): string {
  const date = new Date(dateString);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
}

