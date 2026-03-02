import Link from 'next/link';
import ReportDataButton from '../submissions/ReportDataButton';

// Friendly labels for known accreditation codes — unknown ones show raw value
const ACCREDITATION_MAP = {
  IBO: { label: 'International Baccalaureate' },
  CIS: { label: 'Council of International Schools' },
  WASC: { label: 'Western Assoc. of Schools & Colleges' },
  NEASC: { label: 'New England Assoc. of Schools & Colleges' },
  MSA: { label: 'Middle States Association' },
  COGNIA: { label: 'Cognia' },
  COBIS: { label: 'Council of British Intl Schools' },
  BSO: { label: 'British Schools Overseas' },
  ECIS: { label: 'Educational Collaborative for Intl Schools' },
  EARCOS: { label: 'East Asia Regional Council of Schools' },
  CAMBRIDGE: { label: 'Cambridge International' },
  EDEXCEL: { label: 'Pearson Edexcel' },
  AP: { label: 'College Board AP' },
};

const PROGRAMME_COLORS = {
  DP: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', accent: 'bg-purple-500' },
  MYP: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'bg-blue-500' },
  PYP: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', accent: 'bg-emerald-500' },
  CP: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', accent: 'bg-amber-500' },
};

const PROGRAMME_LABELS = {
  DP: 'Diploma Programme',
  MYP: 'Middle Years Programme',
  PYP: 'Primary Years Programme',
  CP: 'Career-related Programme',
};

function slugifyCountry(name) {
  if (!name) return '';
  return name.toLowerCase().replace(/\s+/g, '-');
}

export default function SchoolProfile({ school, citySlug }) {
  const hasReviewData = school.city_id != null;
  const countrySlug = slugifyCountry(school.country_name);

  // Collect all stat items that exist
  const stats = [];
  if (Array.isArray(school.programmes) && school.programmes.length > 0) {
    stats.push({ value: school.programmes.length, label: `IB Programme${school.programmes.length !== 1 ? 's' : ''}`, color: 'text-purple-600' });
  }
  if (school.rating != null) {
    stats.push({ value: school.rating, suffix: '/10', label: 'Rating', color: 'text-amber-600' });
  }
  if (school.reviews > 0) {
    stats.push({ value: school.reviews, label: 'Reviews', color: 'text-blue-600' });
  }
  if (school.student_count) {
    stats.push({ value: school.student_count.toLocaleString(), label: 'Students', color: 'text-emerald-600' });
  }
  if (school.salary_range) {
    stats.push({ value: school.salary_range, label: 'Salary Range', color: 'text-orange-600', small: true });
  }

  // Collect detail rows
  const details = [];
  if (school.school_type) details.push({ icon: SchoolIcon, label: 'Type', value: school.school_type.charAt(0) + school.school_type.slice(1).toLowerCase() });
  if (school.gender) details.push({ icon: UsersIcon, label: 'Gender', value: formatGender(school.gender) });
  if (school.boarding) details.push({ icon: HomeIcon, label: 'Boarding', value: school.boarding === 'NONE' ? 'Day school' : 'Boarding available' });
  if (school.language_of_instruction) details.push({ icon: GlobeIcon, label: 'Language', value: school.language_of_instruction });
  if (Array.isArray(school.languages) && school.languages.length > 0) details.push({ icon: ChatIcon, label: 'Languages', value: school.languages.join(', ') });
  if (school.age_range) details.push({ icon: UsersIcon, label: 'Age Range', value: school.age_range });
  if (school.ib_since) details.push({ icon: CalendarIcon, label: 'IB Authorized', value: school.ib_since });
  if (school.ibo_region) details.push({ icon: MapIcon, label: 'IB Region', value: school.ibo_region });
  if (school.has_university_counsellor != null) details.push({ icon: AcademicIcon, label: 'University Counsellor', value: school.has_university_counsellor ? 'Yes' : 'No' });
  if (school.founded_year) details.push({ icon: CalendarIcon, label: 'Founded', value: String(school.founded_year) });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Stats bar ── */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-stone-200/60">
              <p className={`${stat.small ? 'text-lg' : 'text-3xl'} font-black ${stat.color}`}>
                {stat.value}
                {stat.suffix && <span className="text-lg text-stone-400">{stat.suffix}</span>}
              </p>
              <p className="text-xs text-stone-500 font-semibold mt-1 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── At a Glance ── */}
      {details.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-stone-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-lg font-black text-stone-900">At a Glance</h2>
          </div>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
            <div className="divide-y divide-stone-100">
              {details.filter((_, i) => i % 2 === 0).map((d, i) => (
                <DetailRow key={i} icon={d.icon} label={d.label} value={d.value} />
              ))}
            </div>
            <div className="divide-y divide-stone-100">
              {details.filter((_, i) => i % 2 === 1).map((d, i) => (
                <DetailRow key={i} icon={d.icon} label={d.label} value={d.value} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tuition (future — hidden when null) ── */}
      {(school.tuition_min || school.tuition_max) && (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-stone-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-lg font-black text-stone-900">Tuition</h2>
          </div>
          <div className="px-6 py-5">
            <p className="text-2xl font-black text-stone-900">
              {school.tuition_min && school.tuition_max
                ? `$${school.tuition_min.toLocaleString()} – $${school.tuition_max.toLocaleString()}`
                : school.tuition_min
                  ? `From $${school.tuition_min.toLocaleString()}`
                  : `Up to $${school.tuition_max.toLocaleString()}`
              }
              <span className="text-sm font-medium text-stone-400 ml-2">per year</span>
            </p>
            {school.tuition_currency && school.tuition_currency !== 'USD' && (
              <p className="text-xs text-stone-400 mt-1">Shown in {school.tuition_currency}</p>
            )}
          </div>
        </div>
      )}

      {/* ── IB Programmes ── */}
      {Array.isArray(school.programmes) && school.programmes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-stone-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-lg font-black text-stone-900">IB Programmes</h2>
          </div>
          <div className="p-6 space-y-4">
            {school.programmes.map(p => {
              const colors = PROGRAMME_COLORS[p] || { bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700', accent: 'bg-stone-500' };
              const detail = Array.isArray(school.programmes_detail)
                ? school.programmes_detail.find(d => d.name && d.name.includes(p))
                : null;

              return (
                <div key={p} className={`${colors.bg} border ${colors.border} rounded-xl p-5`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`w-2 h-2 rounded-full ${colors.accent}`} />
                        <h3 className={`font-black ${colors.text}`}>{p}</h3>
                        <span className="text-sm text-stone-500">{PROGRAMME_LABELS[p] || ''}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-stone-600">
                        {detail?.authorised && (
                          <span>Authorized <strong>{detail.authorised}</strong></span>
                        )}
                        {detail?.language && (
                          <span>Language: <strong>{detail.language}</strong></span>
                        )}
                        {Array.isArray(detail?.subjects) && detail.subjects.length > 0 && (
                          <span><strong>{detail.subjects.length}</strong> subjects offered</span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/schools/curriculum/ib-${p.toLowerCase()}`}
                      className={`text-xs font-bold ${colors.text} hover:underline flex-shrink-0`}
                    >
                      All {p} schools &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Mission / Vision ── */}
      {(school.mission_statement || school.vision || school.purpose) && (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-stone-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-lg font-black text-stone-900">About This School</h2>
          </div>
          <div className="p-6 space-y-5">
            {school.mission_statement && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Mission</p>
                <p className="text-stone-700 leading-relaxed">{school.mission_statement}</p>
              </div>
            )}
            {school.vision && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Vision</p>
                <p className="text-stone-700 leading-relaxed">{school.vision}</p>
              </div>
            )}
            {school.purpose && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Purpose</p>
                <p className="text-stone-700 leading-relaxed">{school.purpose}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Accreditations ── */}
      {Array.isArray(school.accreditations) && school.accreditations.filter(Boolean).length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-stone-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-lg font-black text-stone-900">Accreditations</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {school.accreditations.filter(Boolean).map(a => {
                const label = ACCREDITATION_MAP[a]?.label || a;
                return (
                  <span key={a} className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 text-sm font-semibold px-3.5 py-2 rounded-lg">
                    <ShieldIcon className="w-3.5 h-3.5 text-stone-400" />
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Teacher Reviews ── */}
      {hasReviewData && (school.summary || school.pros || school.cons) && (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-stone-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-lg font-black text-stone-900">Teacher Reviews</h2>
          </div>
          <div className="p-6">
            {school.summary && (
              <p className="text-stone-700 leading-relaxed mb-6">{school.summary}</p>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {school.pros && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-700 mb-3">Pros</h3>
                  <ul className="space-y-2">
                    {school.pros.split(';').filter(Boolean).map((item, i) => (
                      <li key={i} className="text-sm text-stone-700 flex gap-2">
                        <span className="text-emerald-500 flex-shrink-0 mt-0.5">+</span>
                        {item.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {school.cons && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-red-700 mb-3">Cons</h3>
                  <ul className="space-y-2">
                    {school.cons.split(';').filter(Boolean).map((item, i) => (
                      <li key={i} className="text-sm text-stone-700 flex gap-2">
                        <span className="text-red-500 flex-shrink-0 mt-0.5">&ndash;</span>
                        {item.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Contact & Actions ── */}
      {(school.website_url || school.phone || school.address || school.ibo_url) && (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-stone-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-lg font-black text-stone-900">Contact</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-3 mb-5">
              {school.website_url && (
                <a
                  href={school.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-stone-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-stone-800 transition-colors"
                >
                  <GlobeIcon className="w-4 h-4" />
                  Visit Website
                </a>
              )}
              {school.phone && (
                <a
                  href={`tel:${school.phone}`}
                  className="inline-flex items-center gap-2 bg-white text-stone-700 font-bold text-sm px-5 py-2.5 rounded-xl ring-1 ring-stone-200 hover:ring-stone-400 transition-colors"
                >
                  <PhoneIcon className="w-4 h-4" />
                  {school.phone}
                </a>
              )}
              {school.ibo_url && (
                <a
                  href={school.ibo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-stone-700 font-bold text-sm px-5 py-2.5 rounded-xl ring-1 ring-stone-200 hover:ring-stone-400 transition-colors"
                >
                  <ExternalIcon className="w-4 h-4" />
                  IBO Profile
                </a>
              )}
            </div>
            {school.address && (
              <div className="flex items-start gap-3 text-sm text-stone-600">
                <MapPinIcon className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                <span>{school.address}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Report Data Issue ── */}
      <div className="flex justify-end px-2">
        <ReportDataButton schoolId={school.id} schoolName={school.name} />
      </div>

      {/* ── Explore More ── */}
      <div className="bg-stone-100 rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-black text-stone-900 mb-4">Explore More</h2>
        <div className="flex flex-wrap gap-3">
          {countrySlug && (
            <Link href={`/schools/${countrySlug}/`} className="text-sm font-bold bg-white text-stone-700 px-4 py-2 rounded-lg ring-1 ring-stone-200 hover:ring-stone-900 transition-colors">
              Schools in {school.country_name}
            </Link>
          )}
          {citySlug && (
            <Link href={`/cities/${citySlug}`} className="text-sm font-bold bg-white text-stone-700 px-4 py-2 rounded-lg ring-1 ring-stone-200 hover:ring-stone-900 transition-colors">
              City guide
            </Link>
          )}
          <Link href="/schools/" className="text-sm font-bold bg-white text-stone-700 px-4 py-2 rounded-lg ring-1 ring-stone-200 hover:ring-stone-900 transition-colors">
            Full directory
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail row with icon ─── */
function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5">
      <Icon className="w-4 h-4 text-stone-400 flex-shrink-0 hidden sm:block" />
      <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide w-24 sm:w-28 flex-shrink-0">{label}</span>
      <span className="text-sm font-bold text-stone-900 break-words min-w-0">{value}</span>
    </div>
  );
}

function formatGender(gender) {
  if (!gender) return '';
  if (gender === 'COEDUCATIONAL') return 'Co-educational';
  return gender.charAt(0) + gender.slice(1).toLowerCase();
}

/* ─── Inline SVG icons (no dependency needed) ─── */
function SchoolIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function HomeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function GlobeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ChatIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function MapIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function AcademicIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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

function MapPinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
