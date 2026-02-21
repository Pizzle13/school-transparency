'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import SchoolDirectoryCard from './SchoolDirectoryCard';
import SchoolPagination from './SchoolPagination';

export default function SchoolGrid({
  schools,
  totalCount,
  totalPages,
  currentPage,
  compareList = [],
  onCompare,
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentSort = searchParams.get('sort') || 'name';

  const updateSort = useCallback((sort) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === 'name') {
      params.delete('sort');
    } else {
      params.set('sort', sort);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  // Active filter pills from URL params
  const activeFilters = [];
  for (const [key, value] of searchParams.entries()) {
    if (['page', 'sort'].includes(key) || !value) continue;
    activeFilters.push({ key, value });
  }

  const removeFilter = useCallback((key) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  return (
    <div className="flex-1 min-w-0">
      {/* Header: count + sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-stone-600 font-medium">
          <span className="text-2xl font-black text-stone-900">
            {totalCount.toLocaleString()}
          </span>{' '}
          {totalCount === 1 ? 'school' : 'schools'} found
        </p>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">Sort:</span>
          <select
            value={currentSort}
            onChange={(e) => updateSort(e.target.value)}
            className="text-sm font-bold border-2 border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-stone-900 transition-colors"
          >
            <option value="name">A — Z</option>
            <option value="country">Country</option>
          </select>
        </div>
      </div>

      {/* Active filter pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(({ key, value }) => (
            <button
              key={key}
              onClick={() => removeFilter(key)}
              className="flex items-center gap-1 text-xs font-bold bg-stone-100 text-stone-700 px-3 py-1.5 rounded-full hover:bg-stone-200 transition-colors"
            >
              {key}: {value}
              <span className="ml-1 text-stone-400 hover:text-stone-900">x</span>
            </button>
          ))}
        </div>
      )}

      {/* School cards grid */}
      {schools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {schools.map((school) => (
            <SchoolDirectoryCard
              key={school.id}
              school={school}
              onCompare={onCompare}
              isComparing={compareList.some(s => s.id === school.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-2xl font-black text-stone-300 mb-2">No schools found</p>
          <p className="text-stone-400">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {/* Pagination */}
      <SchoolPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
      />
    </div>
  );
}
