import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination as PaginationType } from '../../types';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function Pagination({ pagination, onPageChange, onLimitChange }: PaginationProps) {
  const { page, totalPages, limit, total } = pagination;

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(p => {
    return p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1);
  });

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="btn-secondary disabled:opacity-50 min-h-[44px] px-4"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="btn-secondary disabled:opacity-50 min-h-[44px] px-4"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{page}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
            {total !== undefined && (
              <> ({total} total)</>
            )}
          </p>
          {onLimitChange && (
            <div className="flex items-center gap-2">
              <label htmlFor="page-size" className="text-sm text-gray-700">
                Show:
              </label>
              <select
                id="page-size"
                value={limit || 20}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 min-h-[44px] min-w-[44px]"
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            {visiblePages.map((p, idx) => (
              <div key={p}>
                {idx > 0 && visiblePages[idx - 1] !== p - 1 && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                    ...
                  </span>
                )}
                <button
                  onClick={() => onPageChange(p)}
                  className={`relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 min-h-[44px] min-w-[44px] ${
                    p === page
                      ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                      : 'text-gray-900'
                  }`}
                  aria-label={`Go to page ${p}`}
                >
                  {p}
                </button>
              </div>
            ))}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 min-h-[44px] min-w-[44px]"
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

