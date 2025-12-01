import { format, parseISO } from 'date-fns';

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
  } catch {
    return dateString;
  }
}

export function formatCurrency(amount: string | number, currency: string = 'INR'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(numAmount);
}

export function formatNumber(num: number | string): string {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  return new Intl.NumberFormat('en-US').format(number);
}

