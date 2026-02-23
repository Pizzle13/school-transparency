'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

// IB programmes (stored in `programmes` text[] column)
const IB_PROGRAMMES = ['DP', 'MYP', 'PYP', 'CP'];
// Non-IB curricula (stored in `accreditations` text[] column)
const OTHER_CURRICULA = [
  { value: 'Cambridge', label: 'Cambridge' },
];
const SCHOOL_TYPES = ['PRIVATE', 'PUBLIC', 'STATE'];
const BOARDING_OPTIONS = [
  { value: 'NONE', label: 'Day school' },
  { value: 'YES', label: 'Boarding available' },
];
const GENDER_OPTIONS = [
  { value: 'COEDUCATIONAL', label: 'Co-educational' },
  { value: 'BOYS', label: 'Boys' },
  { value: 'GIRLS', label: 'Girls' },
];
const COUNSELLOR_OPTIONS = [
  { value: 'YES', label: 'Has counsellor' },
  { value: 'NO', label: 'No counsellor' },
];

export default function SchoolFilterSidebar({ countries = [], lockedFilters = {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentFilters = {
    country: lockedFilters.country || searchParams.get('country') || '',
    programme: lockedFilters.programme || searchParams.get('programme') || '',
    schoolType: searchParams.get('schoolType') || '',
    boarding: searchParams.get('boarding') || '',
    gender: searchParams.get('gender') || '',
    counsellor: searchParams.get('counsellor') || '',
  };

  const updateFilter = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters = Object.entries(currentFilters).some(
    ([key, val]) => val && !lockedFilters[key]
  );

  const filterContent = (
    <div className="space-y-6">
      {/* Country filter */}
      {!lockedFilters.country && countries.length > 0 && (
        <FilterSection title="Country">
          <select
            value={currentFilters.country}
            onChange={(e) => updateFilter('country', e.target.value)}
            className="w-full px-3 py-2 border-2 border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900 transition-colors"
          >
            <option value="">All countries</option>
            {countries.map(c => (
              <option key={c.name} value={c.name.toLowerCase().replace(/\s+/g, '-')}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
        </FilterSection>
      )}

      {/* Curriculum filter */}
      {!lockedFilters.programme && (
        <FilterSection title="Curriculum">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="programme"
                checked={!currentFilters.programme}
                onChange={() => updateFilter('programme', '')}
                className="w-4 h-4 border-stone-300 text-orange-600 focus:ring-orange-600"
              />
              <span className="text-sm text-stone-700 group-hover:text-stone-900">All curricula</span>
            </label>

            {/* IB programmes */}
            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 pt-1">IB</p>
            {IB_PROGRAMMES.map(p => (
              <label key={p} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="programme"
                  checked={currentFilters.programme === p}
                  onChange={() => updateFilter('programme', p)}
                  className="w-4 h-4 border-stone-300 text-orange-600 focus:ring-orange-600"
                />
                <span className="text-sm text-stone-700 group-hover:text-stone-900">{p}</span>
              </label>
            ))}

            {/* Other curricula */}
            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 pt-1">Other</p>
            {OTHER_CURRICULA.map(c => (
              <label key={c.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="programme"
                  checked={currentFilters.programme === c.value}
                  onChange={() => updateFilter('programme', c.value)}
                  className="w-4 h-4 border-stone-300 text-orange-600 focus:ring-orange-600"
                />
                <span className="text-sm text-stone-700 group-hover:text-stone-900">{c.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* School type filter */}
      <FilterSection title="School Type">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="schoolType"
              checked={!currentFilters.schoolType}
              onChange={() => updateFilter('schoolType', '')}
              className="w-4 h-4 border-stone-300 text-orange-600 focus:ring-orange-600"
            />
            <span className="text-sm text-stone-700 group-hover:text-stone-900">All types</span>
          </label>
          {SCHOOL_TYPES.map(t => (
            <label key={t} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="schoolType"
                checked={currentFilters.schoolType.toUpperCase() === t}
                onChange={() => updateFilter('schoolType', t)}
                className="w-4 h-4 border-stone-300 text-orange-600 focus:ring-orange-600"
              />
              <span className="text-sm text-stone-700 group-hover:text-stone-900">
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Boarding filter */}
      <FilterSection title="Boarding">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="boarding"
              checked={!currentFilters.boarding}
              onChange={() => updateFilter('boarding', '')}
              className="w-4 h-4 border-stone-300 text-orange-600 focus:ring-orange-600"
            />
            <span className="text-sm text-stone-700 group-hover:text-stone-900">Any</span>
          </label>
          {BOARDING_OPTIONS.map(b => (
            <label key={b.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="boarding"
                checked={currentFilters.boarding === b.value}
                onChange={() => updateFilter('boarding', b.value)}
                className="w-4 h-4 border-stone-300 text-orange-600 focus:ring-orange-600"
              />
              <span className="text-sm text-stone-700 group-hover:text-stone-900">{b.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Gender filter */}
      <FilterSection title="Gender">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="gender"
              checked={!currentFilters.gender}
              onChange={() => updateFilter('gender', '')}
              className="w-4 h-4 border-stone-300 text-orange-600 focus:ring-orange-600"
            />
            <span className="text-sm text-stone-700 group-hover:text-stone-900">Any</span>
          </label>
          {GENDER_OPTIONS.map(g => (
            <label key={g.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="gender"
                checked={currentFilters.gender.toUpperCase() === g.value}
                onChange={() => updateFilter('gender', g.value)}
                className="w-4 h-4 border-stone-300 text-orange-600 focus:ring-orange-600"
              />
              <span className="text-sm text-stone-700 group-hover:text-stone-900">{g.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* University Counsellor filter */}
      <FilterSection title="University Counsellor">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="counsellor"
              checked={!currentFilters.counsellor}
              onChange={() => updateFilter('counsellor', '')}
              className="w-4 h-4 border-stone-300 text-orange-600 focus:ring-orange-600"
            />
            <span className="text-sm text-stone-700 group-hover:text-stone-900">Any</span>
          </label>
          {COUNSELLOR_OPTIONS.map(c => (
            <label key={c.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="counsellor"
                checked={currentFilters.counsellor === c.value}
                onChange={() => updateFilter('counsellor', c.value)}
                className="w-4 h-4 border-stone-300 text-orange-600 focus:ring-orange-600"
              />
              <span className="text-sm text-stone-700 group-hover:text-stone-900">{c.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="w-full text-sm font-bold text-orange-600 hover:text-orange-700 py-2 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile: Filter button + drawer */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-stone-900 rounded-xl font-bold text-sm hover:bg-stone-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-stone-900">Filters</h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100"
              >
                x
              </button>
            </div>
            {filterContent}
            <button
              onClick={() => setMobileOpen(false)}
              className="mt-6 w-full py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors"
            >
              Show results
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">
            Filters
          </h3>
          {filterContent}
        </div>
      </aside>
    </>
  );
}

function FilterSection({ title, children }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-stone-900 mb-2">{title}</h4>
      {children}
    </div>
  );
}
