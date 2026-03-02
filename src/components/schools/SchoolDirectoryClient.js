'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import SchoolFilterSidebar from './SchoolFilterSidebar';
import SchoolGrid from './SchoolGrid';
import CompareBar, { MAX_COMPARE } from './CompareBar';

export default function SchoolDirectoryClient({
  schools,
  totalCount,
  totalPages,
  currentPage,
  countries,
  lockedFilters = {},
}) {
  const [compareList, setCompareList] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Search input
  const currentSearch = searchParams.get('q') || '';

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const q = formData.get('q')?.toString().trim() || '';
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set('q', q);
    } else {
      params.delete('q');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  // Compare management
  const handleCompare = useCallback((school) => {
    setCompareList(prev => {
      const exists = prev.some(s => s.id === school.id);
      if (exists) {
        return prev.filter(s => s.id !== school.id);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, school];
    });
  }, []);

  const handleRemoveCompare = useCallback((school) => {
    setCompareList(prev => prev.filter(s => s.id !== school.id));
  }, []);

  return (
    <>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            name="q"
            defaultValue={currentSearch}
            placeholder="Search by school name, country, or city..."
            className="w-full px-6 py-4 text-lg border-2 border-stone-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all pr-14"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center hover:bg-orange-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Sidebar + Grid layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        <SchoolFilterSidebar
          countries={countries}
          lockedFilters={lockedFilters}
        />

        <SchoolGrid
          schools={schools}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={currentPage}
          compareList={compareList}
          onCompare={handleCompare}
        />
      </div>

      {/* Floating compare bar */}
      <CompareBar
        schools={compareList}
        onRemove={handleRemoveCompare}
      />
    </>
  );
}
