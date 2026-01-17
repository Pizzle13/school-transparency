'use client';

import { useState } from 'react';
import SchoolCard from './SchoolCard';
import SchoolDetailModal from './SchoolDetailModal';

export default function SchoolSection({ schools, cityName }) {
  const [selectedSchool, setSelectedSchool] = useState(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header - Bold Retroverse Style */}
        <div className="mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              Schools Directory
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-6 text-stone-900">
            International Schools in {cityName}
          </h2>
          <p className="text-xl text-stone-600 mb-2">
            {schools.length} international schools • Reviews from community sources
          </p>
          <p className="text-sm text-stone-400">
            Data aggregated from teacher communities, public reviews, and school websites
          </p>
        </div>

        {/* School Grid - Clean Cards */}
        <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2">
            {schools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onClick={() => setSelectedSchool(school)}
              />
            ))}
          </div>
          
          <div className="text-center mt-6 text-sm text-stone-400">
            Click any school for detailed information
          </div>
        </div>
      </div>

      {selectedSchool && (
        <SchoolDetailModal
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
        />
      )}
    </section>
  );
}