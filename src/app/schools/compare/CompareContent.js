'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import HeroBackground from '../../../components/schools/HeroBackground';

const PROGRAMME_COLORS = {
  DP: 'bg-purple-100 text-purple-700',
  MYP: 'bg-blue-100 text-blue-700',
  PYP: 'bg-emerald-100 text-emerald-700',
  CP: 'bg-amber-100 text-amber-700',
};

export default function CompareContent() {
  const searchParams = useSearchParams();
  const schoolSlugs = (searchParams.get('schools') || '').split(',').filter(Boolean);

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (schoolSlugs.length < 2) {
      setLoading(false);
      return;
    }

    async function fetchSchools() {
      try {
        const res = await fetch(`/api/schools/compare?schools=${schoolSlugs.join(',')}`);
        if (!res.ok) throw new Error('Failed to fetch schools');
        const data = await res.json();
        setSchools(data.schools || []);
      } catch {
        // Silently handle — shows empty state
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (schoolSlugs.length < 2 || schools.length < 2) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl font-black text-stone-300 mb-4">Select Schools to Compare</h1>
          <p className="text-stone-500 mb-6">
            Add at least 2 schools from the directory to compare them side by side.
          </p>
          <Link
            href="/schools"
            className="inline-block px-6 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors"
          >
            Browse schools
          </Link>
        </div>
      </div>
    );
  }

  const colCount = schools.length;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative bg-stone-900 text-white py-12 md:py-16 overflow-hidden">
        <HeroBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-stone-400 mb-4">
            <Link href="/schools" className="hover:text-white transition-colors">Schools</Link>
            <span>/</span>
            <span className="text-white">Compare</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black">Compare Schools</h1>
          <p className="text-stone-400 mt-2">Side-by-side comparison of {schools.length} schools</p>
        </div>
      </section>

      {/* School header cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className={`grid gap-4 ${colCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {schools.map(school => (
            <div key={school.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-stone-200/60 p-5">
              <Link
                href={`/schools/s/${school.slug}/`}
                className="text-lg font-black text-stone-900 hover:text-orange-600 transition-colors"
              >
                {school.name}
              </Link>
              <p className="text-sm text-stone-500 mt-1">{school.address || school.country_name || ''}</p>
              {Array.isArray(school.programmes) && school.programmes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {school.programmes.map(p => (
                    <span key={p} className={`text-xs font-bold px-2 py-0.5 rounded ${PROGRAMME_COLORS[p] || 'bg-stone-100 text-stone-600'}`}>
                      {p}
                    </span>
                  ))}
                </div>
              )}
              {school.rating != null && (
                <div className="flex items-center gap-1 mt-3">
                  <span className="text-amber-500">&#9733;</span>
                  <span className="text-sm font-black text-stone-900">{school.rating}/10</span>
                  {school.reviews > 0 && (
                    <span className="text-xs text-stone-400 ml-1">({school.reviews} reviews)</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Comparison rows */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-stone-200/60 overflow-x-auto">
          <CompareSection title="Overview" tab="bg-blue-500" tint="bg-blue-50/40">
            <CompareRow label="Country" schools={schools} field="country_name" />
            <CompareRow label="School Type" schools={schools} field="school_type" format={v => v.charAt(0) + v.slice(1).toLowerCase()} />
            <CompareRow label="Gender" schools={schools} field="gender" format={formatGender} />
            <CompareRow label="Boarding" schools={schools} field="boarding" format={v => v === 'NONE' ? 'Day school' : 'Boarding available'} />
            <CompareRow label="Age Range" schools={schools} field="age_range" />
            <CompareRow label="Founded" schools={schools} field="founded_year" format={v => String(v)} />
          </CompareSection>

          <CompareSection title="Curriculum" tab="bg-emerald-500" tint="bg-emerald-50/40">
            <CompareRow label="IB Programmes" schools={schools} render={s =>
              Array.isArray(s.programmes) && s.programmes.length > 0
                ? <div className="flex flex-wrap gap-1">{s.programmes.map(p => (
                    <span key={p} className={`text-xs font-bold px-2 py-0.5 rounded ${PROGRAMME_COLORS[p] || 'bg-stone-100 text-stone-600'}`}>{p}</span>
                  ))}</div>
                : <span className="text-stone-300">—</span>
            } />
            <CompareRow label="Language" schools={schools} field="language_of_instruction" />
            <CompareRow label="IB Since" schools={schools} field="ib_since" />
            <CompareRow label="IB Region" schools={schools} field="ibo_region" />
            <CompareRow label="DP Subjects" schools={schools} render={s => {
              const dp = Array.isArray(s.programmes_detail)
                ? s.programmes_detail.find(p => p.name === 'DIPLOMA' || p.name === 'DP')
                : null;
              if (!dp || !dp.subjects) return <span className="text-stone-300">—</span>;
              return <span className="font-bold">{dp.subjects.length}</span>;
            }} />
            <CompareRow label="University Counsellor" schools={schools} field="has_university_counsellor" format={v => v === true ? 'Yes' : v === false ? 'No' : null} />
          </CompareSection>

          <CompareSection title="Accreditations" tab="bg-violet-500" tint="bg-violet-50/40">
            <CompareRow label="Accreditations" schools={schools} render={s => {
              const accreds = Array.isArray(s.accreditations) ? s.accreditations.filter(Boolean) : [];
              if (accreds.length === 0) return <span className="text-stone-300">—</span>;
              return (
                <div className="flex flex-wrap gap-1">
                  {accreds.map(a => (
                    <span key={a} className="text-xs font-bold px-2 py-0.5 rounded bg-violet-100 text-violet-700">{a}</span>
                  ))}
                </div>
              );
            }} />
          </CompareSection>

          <CompareSection title="Teacher Data" tab="bg-amber-500" tint="bg-amber-50/40">
            <CompareRow label="Rating" schools={schools} render={s =>
              s.rating != null
                ? <span className="font-black text-amber-600">{s.rating}<span className="text-stone-400 font-normal">/10</span></span>
                : <span className="text-stone-300">—</span>
            } highlight />
            <CompareRow label="Reviews" schools={schools} field="reviews" format={v => v > 0 ? v.toLocaleString() : null} />
            <CompareRow label="Salary Range" schools={schools} render={s =>
              s.salary_range
                ? <span className="font-bold text-orange-600">{s.salary_range}</span>
                : <span className="text-stone-300">—</span>
            } />
          </CompareSection>

          <CompareSection title="Links" tab="bg-orange-500" tint="bg-orange-50/40" last>
            <CompareRow label="Website" schools={schools} render={s =>
              s.website_url ? (
                <a href={s.website_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700">
                  <GlobeIcon className="w-3.5 h-3.5" /> Visit
                </a>
              ) : <span className="text-stone-300">—</span>
            } />
            <CompareRow label="IBO Page" schools={schools} render={s =>
              s.ibo_url ? (
                <a href={s.ibo_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700">
                  <ExternalIcon className="w-3.5 h-3.5" /> View
                </a>
              ) : <span className="text-stone-300">—</span>
            } />
            <CompareRow label="Profile" schools={schools} render={s =>
              <Link href={`/schools/s/${s.slug}/`}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-700 hover:text-stone-900">
                Full profile &rarr;
              </Link>
            } />
          </CompareSection>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/schools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors"
          >
            &larr; Back to directory
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ─── File-folder section with colored tab ─── */
function CompareSection({ title, children, tab = 'bg-stone-500', tint = 'bg-stone-50/40', last }) {
  // Filter out null children (hidden rows)
  const visibleChildren = [];
  if (Array.isArray(children)) {
    children.forEach(c => { if (c) visibleChildren.push(c); });
  } else if (children) {
    visibleChildren.push(children);
  }

  return (
    <div className={!last ? 'border-b border-stone-200' : ''}>
      {/* Tab */}
      <div className="px-6 pt-4 pb-0">
        <span className={`inline-block ${tab} text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-t-lg`}>
          {title}
        </span>
      </div>
      {/* Tinted body */}
      <div className={`${tint} divide-y divide-white/60`}>
        {visibleChildren}
      </div>
    </div>
  );
}

/* ─── Single comparison row ─── */
function CompareRow({ label, schools, field, render, format, highlight }) {
  // Hide row if no school has data
  const hasAnyData = schools.some(s => {
    if (render) {
      const result = render(s);
      // Check if render returns the dash placeholder
      if (result?.props?.className?.includes('text-stone-300')) return false;
      return true;
    }
    const val = s[field];
    return val != null && val !== '';
  });
  if (!hasAnyData) return null;

  return (
    <div className={`flex items-center min-w-[600px] ${highlight ? 'bg-amber-50/50' : ''}`}>
      <div className="w-32 sm:w-40 md:w-48 flex-shrink-0 px-4 sm:px-6 py-3.5">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${schools.length}, 1fr)` }}>
        {schools.map(school => {
          let value;
          if (render) {
            value = render(school);
          } else if (field) {
            const raw = school[field];
            if (raw != null && raw !== '') {
              value = format ? format(raw) : String(raw);
            }
          }

          return (
            <div key={school.id} className="px-4 py-3.5 text-sm text-stone-700 font-medium">
              {value || <span className="text-stone-300">—</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatGender(gender) {
  if (!gender) return null;
  if (gender === 'COEDUCATIONAL') return 'Co-educational';
  return gender.charAt(0) + gender.slice(1).toLowerCase();
}

/* ─── Tiny icons ─── */
function GlobeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ExternalIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
