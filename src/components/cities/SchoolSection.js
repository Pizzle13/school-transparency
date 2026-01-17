'use client';

import { useState } from 'react';
import SchoolCard from './SchoolCard';
import SchoolDetailModal from './SchoolDetailModal';

export default function SchoolSection({ schools, cityName }) {
  const [selectedSchool, setSelectedSchool] = useState(null);

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            International Schools in {cityName}
          </h2>
          <p className="text-lg text-slate-600 mb-2">
            {schools.length} international schools • Reviews from community sources
          </p>
          <p className="text-sm text-slate-500">
            Data aggregated from teacher communities, public reviews, and school websites
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2">
            {schools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onClick={() => setSelectedSchool(school)}
              />
            ))}
          </div>
          
          <div className="text-center mt-4 text-sm text-slate-500">
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