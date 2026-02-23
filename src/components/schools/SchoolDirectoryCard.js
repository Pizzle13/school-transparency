'use client';

import Link from 'next/link';
import Image from 'next/image';

const PROGRAMME_COLORS = {
  DP: 'bg-purple-100 text-purple-700',
  MYP: 'bg-blue-100 text-blue-700',
  PYP: 'bg-emerald-100 text-emerald-700',
  CP: 'bg-amber-100 text-amber-700',
};

// Map DB accreditation keys to display names
const ACCREDITATION_LABELS = {
  IBO: 'IBO',
  CIS: 'CIS',
  WASC: 'WASC',
  NEASC: 'NEASC',
  MSA: 'MSA',
  COGNIA: 'Cognia',
  COBIS: 'COBIS',
  BSO: 'BSO',
  ECIS: 'ECIS',
  EARCOS: 'EARCOS',
};

// Map DB accreditation keys to badge image filenames
const ACCREDITATION_BADGES = {
  IBO: { src: '/accreditations/ib.png', alt: 'IB World School' },
  CIS: { src: '/accreditations/cis.png', alt: 'CIS Accredited' },
  WASC: { src: '/accreditations/wasc.png', alt: 'WASC Accredited' },
  NEASC: { src: '/accreditations/neasc.png', alt: 'NEASC Accredited' },
  MSA: { src: '/accreditations/msa.png', alt: 'MSA Accredited' },
  COGNIA: { src: '/accreditations/cognia.png', alt: 'Cognia Accredited' },
  COBIS: { src: '/accreditations/cobis.png', alt: 'COBIS Member' },
  BSO: { src: '/accreditations/bso.png', alt: 'British Schools Overseas' },
  ECIS: { src: '/accreditations/ecis.png', alt: 'ECIS Member' },
  EARCOS: { src: '/accreditations/earcos.png', alt: 'EARCOS Member' },
  CAMBRIDGE: { src: '/accreditations/cambridge.png', alt: 'Cambridge International' },
  EDEXCEL: { src: '/accreditations/edexcel.png', alt: 'Pearson Edexcel' },
  AP: { src: '/accreditations/ap.png', alt: 'College Board AP' },
};

export default function SchoolDirectoryCard({ school, onCompare, isComparing }) {
  const {
    name,
    slug,
    country_name,
    programmes,
    school_type,
    rating,
    reviews,
    salary_range,
    accreditations,
  } = school;

  // Build curriculum badges — group programmes under "IB" for now
  // Future: Cambridge, AP, Edexcel will be separate curriculum entries
  const ibProgrammes = Array.isArray(programmes) ? programmes : [];

  // Accreditations excluding IBO (since IB is shown as curriculum)
  const otherAccreditations = Array.isArray(accreditations)
    ? accreditations.filter(a => a !== 'IBO' && ACCREDITATION_LABELS[a])
    : [];

  // Coin badges for bottom row — built from actual accreditations data
  const coinBadges = [];
  if (Array.isArray(accreditations)) {
    accreditations.forEach(a => {
      if (ACCREDITATION_BADGES[a]) {
        coinBadges.push(ACCREDITATION_BADGES[a]);
      }
    });
  }
  // If school has IB programmes but IBO isn't in accreditations, still show IB badge
  if (ibProgrammes.length > 0 && !coinBadges.some(b => b.src === ACCREDITATION_BADGES.IBO.src)) {
    coinBadges.unshift(ACCREDITATION_BADGES.IBO);
  }

  return (
    <div className="group relative bg-white border-2 border-stone-200 rounded-2xl hover:border-stone-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <Link href={`/schools/s/${slug}/`} className="block p-6 pb-4 flex-1">
        {/* Top row: curriculum + accreditations info badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {/* IB curriculum badge */}
          {ibProgrammes.length > 0 && (
            <div className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-md px-2 py-0.5">
              <span className="text-[11px] font-black text-blue-700 leading-none">IB</span>
              <span className="text-[11px] text-blue-500 font-medium leading-none">
                {ibProgrammes.join(' · ')}
              </span>
            </div>
          )}

          {/* Accreditations text badge — only if school has extra accreditations */}
          {otherAccreditations.length > 0 && (
            <div className="inline-flex items-center bg-stone-50 border border-stone-200 rounded-md px-2 py-0.5">
              <span className="text-[11px] text-stone-500 font-medium leading-none">
                {otherAccreditations.map(a => ACCREDITATION_LABELS[a]).join(' · ')}
              </span>
            </div>
          )}

          {/* Rating — pushed right */}
          {rating != null && (
            <div className="flex items-center gap-1 ml-auto flex-shrink-0">
              <span className="text-orange-500 text-xs">&#9733;</span>
              <span className="text-xs font-bold text-stone-900">{rating}/10</span>
            </div>
          )}
        </div>

        {/* School name */}
        <h3 className="text-lg font-black text-stone-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
          {name}
        </h3>

        {/* Location + school type */}
        <p className="text-sm text-stone-500 mb-3">
          {country_name || 'Unknown location'}
          {school_type && (
            <span className="text-stone-400"> &middot; {school_type.charAt(0) + school_type.slice(1).toLowerCase()}</span>
          )}
        </p>

        {/* Quick stats — only for merged schools with review data */}
        {(salary_range || reviews > 0) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
            {salary_range && (
              <span className="font-semibold text-orange-600">{salary_range}</span>
            )}
            {reviews > 0 && (
              <span>{reviews} review{reviews !== 1 ? 's' : ''}</span>
            )}
          </div>
        )}
      </Link>

      {/* Badge row + compare — sits at the bottom of the card */}
      <div className="px-6 pb-4 flex items-center justify-between gap-3">
        {/* Accreditation coin badges */}
        <div className="flex items-center gap-1.5">
          {coinBadges.map(b => (
            <Image
              key={b.src}
              src={b.src}
              alt={b.alt}
              width={28}
              height={28}
              className="drop-shadow-sm opacity-70 group-hover:opacity-100 transition-opacity"
            />
          ))}
        </div>

        {/* Compare button — compact */}
        {onCompare && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompare(school);
            }}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all duration-200 flex-shrink-0
              ${isComparing
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-stone-400 border-stone-200 hover:border-stone-900 hover:text-stone-900'
              }`}
          >
            {isComparing ? 'Comparing' : '+ Compare'}
          </button>
        )}
      </div>
    </div>
  );
}
