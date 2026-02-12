'use client';

import { useState, useMemo, useDeferredValue } from 'react';
import CityCard from './CityCard';

export default function CitySearch({ cities }) {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // Memoize expensive filtering operation
  const filteredCities = useMemo(() => {
    if (!deferredSearchTerm) return cities;
    const term = deferredSearchTerm.toLowerCase();
    return cities.filter(city =>
      city.name.toLowerCase().includes(term) ||
      city.country.toLowerCase().includes(term)
    );
  }, [cities, deferredSearchTerm]);

  return (
    <>
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search cities or countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-white border-2 border-blue-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <svg className="absolute right-4 top-4 w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* City Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No cities found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </>
  );
}