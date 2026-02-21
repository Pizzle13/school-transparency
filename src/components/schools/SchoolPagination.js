'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export default function SchoolPagination({ currentPage, totalPages, totalCount }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = useCallback((page) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  }, [router, pathname, searchParams]);

  if (totalPages <= 1) return null;

  // Build page number array with ellipsis
  const pages = buildPageNumbers(currentPage, totalPages);

  const perPage = 24;
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <p className="text-sm text-stone-500">
        Showing {from}–{to} of {totalCount.toLocaleString()} schools
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        {/* Previous */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-2 text-sm font-bold border-2 border-stone-200 rounded-lg hover:border-stone-900 disabled:opacity-30 disabled:hover:border-stone-200 transition-colors"
        >
          Prev
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-stone-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`w-10 h-10 text-sm font-bold rounded-lg border-2 transition-all duration-200
                ${p === currentPage
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'border-stone-200 hover:border-stone-900'
                }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-2 text-sm font-bold border-2 border-stone-200 rounded-lg hover:border-stone-900 disabled:opacity-30 disabled:hover:border-stone-200 transition-colors"
        >
          Next
        </button>
      </nav>
    </div>
  );
}

function buildPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }

  // Show pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  // Always show last page
  pages.push(total);

  return pages;
}
