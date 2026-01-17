'use client';

import { useState } from 'react';
import SchoolCard from './SchoolCard';
import SchoolDetailModal from './SchoolDetailModal';

export default function SchoolSection({ schools, cityName }) {
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Assign rotating colors to cards
  const cardColors = [
    'bg-purple-100 border-purple-300',
    'bg-lime-200 border-lime-400', 
    'bg-sky-100 border-sky-300',
    'bg-orange-100 border-orange-300',
    'bg-pink-100 border-pink-300',
    'bg-yellow-100 border-yellow-300'
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              Schools Directory
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-6 text-stone-900">
            International Schools in {cityName}
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl text-stone-600 mb-2">
                {schools.length} international schools • Reviews from community sources
              </p>
              <p className="text-sm text-stone-400">
                Data aggregated from teacher communities, public reviews, and school websites
              </p>
            </div>
            
            {/* Scroll Navigation */}
            <div className="hidden md:flex gap-3">
              <button 
                onClick={() => document.getElementById('school-scroll').scrollBy({ left: -400, behavior: 'smooth' })}
                className="w-12 h-12 rounded-full border-2 border-stone-900 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all"
              >
                ←
              </button>
              <button 
                onClick={() => document.getElementById('school-scroll').scrollBy({ left: 400, behavior: 'smooth' })}
                className="w-12 h-12 rounded-full border-2 border-stone-900 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Cards */}
        <div 
          id="school-scroll"
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {schools.map((school, index) => (
            <div 
              key={school.id}
              className="flex-shrink-0 w-[380px] snap-center"
            >
              <div
                onClick={() => setSelectedSchool(school)}
                className={`${cardColors[index % cardColors.length]} border-4 rounded-2xl p-6 h-full cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300`}
              >
                {/* School Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white border-2 border-stone-900">
                    {school.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-orange-500 text-xl">★</span>
                    <span className="text-lg font-black text-stone-900">{school.rating}</span>
                  </div>
                </div>

                {/* School Name */}
                <h3 className="text-2xl font-black text-stone-900 mb-4 leading-tight">
                  {school.name}
                </h3>

                {/* Quick Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-stone-700">
                    <span className="text-xl">👥</span>
                    <span className="font-medium">{school.studentCount} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-xl">💰</span>
                    <span className="font-bold text-orange-600 text-base">{school.salaryRange}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-700">
                    <span className="text-xl">💬</span>
                    <span className="font-medium">{school.reviews} community reviews</span>
                  </div>
                </div>

                {/* Summary Preview */}
                <p className="text-sm text-stone-700 line-clamp-3 mb-4">
                  {school.summary}
                </p>

                {/* Click hint */}
                <div className="text-sm text-stone-900 font-bold flex items-center gap-2">
                  Click for details 
                  <span className="text-orange-600">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile hint */}
        <div className="text-center mt-6 text-sm text-stone-400 md:hidden">
          ← Swipe to see more schools →
        </div>
      </div>

      {selectedSchool && (
        <SchoolDetailModal
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
        />
      )}
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}