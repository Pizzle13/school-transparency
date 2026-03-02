'use client';

import Link from 'next/link';

const MAX_COMPARE = 3;

export default function CompareBar({ schools = [], onRemove }) {
  if (schools.length === 0) return null;

  const slugs = schools.map(s => s.slug || s.id).join(',');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-stone-900 border-t-4 border-orange-600 p-4 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400 flex-shrink-0">
            Compare ({schools.length}/{MAX_COMPARE})
          </span>
          {schools.map(school => (
            <div
              key={school.id}
              className="flex items-center gap-2 bg-stone-800 px-3 py-1.5 rounded-lg flex-shrink-0"
            >
              <span className="text-sm text-white font-medium truncate max-w-[120px] sm:max-w-[160px]">
                {school.name}
              </span>
              <button
                onClick={() => onRemove(school)}
                className="text-stone-400 hover:text-white transition-colors text-xs"
              >
                x
              </button>
            </div>
          ))}
        </div>

        <Link
          href={`/schools/compare?schools=${slugs}`}
          className={`flex-shrink-0 w-full sm:w-auto text-center px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
            ${schools.length >= 2
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-stone-700 text-stone-400 pointer-events-none'
            }`}
        >
          Compare{schools.length >= 2 ? ` (${schools.length})` : ' — select 2+'}
        </Link>
      </div>
    </div>
  );
}

export { MAX_COMPARE };
