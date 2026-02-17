'use client';

import { useState } from 'react';

export default function ReviewEditor() {
  // Auth
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Selection
  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');

  // Data
  const [school, setSchool] = useState(null);
  const [editedSchool, setEditedSchool] = useState({});
  const [reviews, setReviews] = useState([]);
  const [notes, setNotes] = useState('');

  // AI suggestions
  const [suggestions, setSuggestions] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState({});

  // UI
  const [loading, setLoading] = useState('');
  const [saveStatus, setSaveStatus] = useState({});
  const [schoolSaveStatus, setSchoolSaveStatus] = useState('');

  const headers = { 'Authorization': `Bearer ${password}` };

  // ── Fetching ──

  const fetchCities = async () => {
    setLoading('cities');
    try {
      const res = await fetch('/api/admin/editor/reviews', { headers });
      if (!res.ok) {
        if (res.status === 401) { setIsAuthenticated(false); alert('Invalid password'); }
        return;
      }
      const data = await res.json();
      setCities(data.cities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading('');
    }
  };

  const fetchSchools = async (cityId) => {
    setLoading('schools');
    setSchools([]); setSelectedSchoolId('');
    setSchool(null); setEditedSchool({}); setReviews([]);
    setSuggestions(null);
    try {
      const res = await fetch(`/api/admin/editor/reviews?city_id=${cityId}`, { headers });
      if (!res.ok) return;
      const data = await res.json();
      setSchools(data.schools || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading('');
    }
  };

  const fetchReviews = async (schoolId) => {
    setLoading('reviews');
    setSuggestions(null); setNotes(''); setSchoolSaveStatus('');
    try {
      const res = await fetch(`/api/admin/editor/reviews?school_id=${schoolId}`, { headers });
      if (!res.ok) return;
      const data = await res.json();
      setSchool(data.school);
      setEditedSchool({
        summary: data.school?.summary || '',
        pros: data.school?.pros || '',
        cons: data.school?.cons || '',
      });
      setReviews(data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading('');
    }
  };

  // ── School-level save ──

  const schoolHasChanges = school && (
    editedSchool.summary !== (school.summary || '') ||
    editedSchool.pros !== (school.pros || '') ||
    editedSchool.cons !== (school.cons || '')
  );

  const saveSchoolFields = async () => {
    if (!school) return;
    setSchoolSaveStatus('saving');
    try {
      const res = await fetch(`/api/admin/editor/school/${school.id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: editedSchool.summary,
          pros: editedSchool.pros,
          cons: editedSchool.cons,
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSchool(data.school);
        setSchoolSaveStatus('saved');
        setTimeout(() => setSchoolSaveStatus(''), 3000);
      } else {
        setSchoolSaveStatus('error');
      }
    } catch {
      setSchoolSaveStatus('error');
    }
  };

  // ── AI Suggestions ──

  const requestSuggestions = async () => {
    if (!notes.trim()) return alert('Add your notes first');

    setLoading('suggesting');
    setSuggestions(null);
    try {
      const res = await fetch('/api/admin/editor/suggest', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: school?.name || 'Unknown School',
          schoolData: {
            summary: editedSchool.summary,
            pros: editedSchool.pros,
            cons: editedSchool.cons,
          },
          reviews,
          notes
        })
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Suggestion request failed');
        return;
      }

      const data = await res.json();
      setSuggestions(data.suggestions || []);

      const selected = {};
      (data.suggestions || []).forEach(s => {
        if (s.changed) selected[s.id] = true;
      });
      setSelectedSuggestions(selected);
    } catch (err) {
      console.error(err);
      alert('Failed to get suggestions');
    } finally {
      setLoading('');
    }
  };

  // ── Save suggestions ──

  const saveSelected = async () => {
    const toSave = suggestions?.filter(s => selectedSuggestions[s.id]) || [];
    if (!toSave.length) return alert('No suggestions selected');

    setLoading('saving');
    const statuses = {};

    for (const suggestion of toSave) {
      try {
        // School-level suggestion
        if (suggestion.id === 'school') {
          const res = await fetch(`/api/admin/editor/school/${school.id}`, {
            method: 'PATCH',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              summary: suggestion.summary,
              pros: suggestion.pros,
              cons: suggestion.cons,
            })
          });
          statuses['school'] = res.ok ? 'saved' : 'error';
        } else {
          // Review-level suggestion
          const res = await fetch(`/api/admin/editor/reviews/${suggestion.id}`, {
            method: 'PATCH',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pros: suggestion.pros,
              cons: suggestion.cons,
              advice_for_teachers: suggestion.advice_for_teachers,
            })
          });
          statuses[suggestion.id] = res.ok ? 'saved' : 'error';
        }
      } catch {
        statuses[suggestion.id] = 'error';
      }
    }

    setSaveStatus(statuses);
    setLoading('');

    const savedCount = Object.values(statuses).filter(s => s === 'saved').length;
    if (savedCount > 0) {
      await fetchReviews(selectedSchoolId);
      setSuggestions(null);
      setNotes('');
    }
  };

  // ── Handlers ──

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password) return;
    setIsAuthenticated(true);
    fetchCities();
  };

  const handleCityChange = (e) => {
    const id = e.target.value;
    setSelectedCityId(id);
    if (id) fetchSchools(id);
    else { setSchools([]); setSelectedSchoolId(''); setSchool(null); setReviews([]); }
  };

  const handleSchoolChange = (e) => {
    const id = e.target.value;
    setSelectedSchoolId(id);
    if (id) fetchReviews(id);
    else { setSchool(null); setEditedSchool({}); setReviews([]); }
  };

  const toggleSuggestion = (id) => {
    setSelectedSuggestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ── Login ──

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border-4 border-stone-900 max-w-md w-full">
          <h1 className="text-3xl font-black text-stone-900 mb-2">Review Editor</h1>
          <p className="text-stone-600 mb-6 text-sm">Edit school data and reviews with AI assistance</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
            <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors border-2 border-stone-900">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main ──

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-stone-900">Review Editor</h1>
            <p className="text-stone-600 mt-1">Select a city and school to view and edit data</p>
          </div>
          <div className="flex gap-3">
            <a href="/admin" className="px-4 py-2 bg-white text-stone-900 rounded-lg font-bold hover:bg-stone-200 border-2 border-stone-900">
              Moderation
            </a>
            <button onClick={() => { setIsAuthenticated(false); setPassword(''); }} className="px-4 py-2 bg-stone-600 text-white rounded-lg font-bold hover:bg-stone-700">
              Logout
            </button>
          </div>
        </div>

        {/* Selectors */}
        <div className="bg-white p-6 rounded-2xl border-4 border-stone-900 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">City</label>
              <select value={selectedCityId} onChange={handleCityChange} disabled={loading === 'cities'}
                className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-600">
                <option value="">Select a city...</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">School</label>
              <select value={selectedSchoolId} onChange={handleSchoolChange} disabled={!selectedCityId || loading === 'schools'}
                className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-600">
                <option value="">{!selectedCityId ? 'Pick a city first' : loading === 'schools' ? 'Loading...' : 'Select a school...'}</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
              </select>
            </div>
          </div>
        </div>

        {loading === 'reviews' && (
          <div className="bg-white p-12 rounded-2xl border-4 border-stone-900 text-center mb-6">
            <p className="text-stone-600">Loading school data...</p>
          </div>
        )}

        {/* ═══ SCHOOL-LEVEL DATA (editable) ═══ */}
        {school && loading !== 'reviews' && !suggestions && (
          <div className="bg-white p-6 rounded-2xl border-4 border-stone-900 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-stone-900">{school.name}</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="px-2 py-1 bg-stone-100 rounded">{school.type || '-'}</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded font-bold">{school.rating || '-'}/5</span>
                <span className="px-2 py-1 bg-stone-100 rounded">{school.salary_range || 'No salary data'}</span>
              </div>
            </div>

            {/* Overview / Summary */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-stone-900 mb-1">Overview</label>
              <textarea
                value={editedSchool.summary || ''}
                onChange={(e) => setEditedSchool(prev => ({ ...prev, summary: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 text-sm"
                placeholder="School overview / summary..."
              />
            </div>

            {/* What Teachers Love */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-green-700 mb-1">What Teachers Love</label>
              <textarea
                value={editedSchool.pros || ''}
                onChange={(e) => setEditedSchool(prev => ({ ...prev, pros: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-green-50"
                placeholder="What teachers love about this school..."
              />
            </div>

            {/* Common Concerns */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-red-700 mb-1">Common Concerns</label>
              <textarea
                value={editedSchool.cons || ''}
                onChange={(e) => setEditedSchool(prev => ({ ...prev, cons: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-red-50"
                placeholder="Common concerns about this school..."
              />
            </div>

            {/* Save school button */}
            <div className="flex items-center gap-3">
              <button
                onClick={saveSchoolFields}
                disabled={!schoolHasChanges || schoolSaveStatus === 'saving'}
                className="px-5 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors border-2 border-stone-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {schoolSaveStatus === 'saving' ? 'Saving...' : 'Save School Info'}
              </button>
              {schoolSaveStatus === 'saved' && <span className="text-green-700 font-bold text-sm">Saved</span>}
              {schoolSaveStatus === 'error' && <span className="text-red-700 font-bold text-sm">Error saving</span>}
              {!schoolHasChanges && <span className="text-stone-400 text-sm">No changes</span>}
            </div>
          </div>
        )}

        {/* ═══ INDIVIDUAL REVIEWS ═══ */}
        {school && reviews.length > 0 && loading !== 'reviews' && !suggestions && (
          <>
            <h3 className="text-xl font-black text-stone-900 mb-4">Individual Reviews ({reviews.length})</h3>
            <div className="space-y-4 mb-6">
              {reviews.map((review, idx) => (
                <ReviewCard key={review.id} review={review} index={idx} />
              ))}
            </div>
          </>
        )}

        {school && reviews.length === 0 && loading !== 'reviews' && !suggestions && (
          <div className="bg-stone-50 p-8 rounded-2xl border-2 border-stone-300 text-center mb-6">
            <p className="text-stone-500">No individual reviews yet — school-level data above is still editable</p>
          </div>
        )}

        {/* ═══ AI NOTES + SUGGEST ═══ */}
        {school && loading !== 'reviews' && !suggestions && (
          <div className="bg-white p-6 rounded-2xl border-4 border-stone-900 mb-6">
            <h3 className="text-xl font-black text-stone-900 mb-3">AI-Assisted Updates</h3>
            <p className="text-sm text-stone-600 mb-3">
              Describe what needs changing. The AI will suggest edits to both school info and individual reviews.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="e.g., Salaries increased 20%. New principal since 2025, much more supportive. School moved to a new campus in District 7."
            />
            <button
              onClick={requestSuggestions}
              disabled={loading === 'suggesting' || !notes.trim()}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors border-2 border-stone-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'suggesting' ? 'Generating suggestions...' : 'Suggest Updates'}
            </button>
          </div>
        )}

        {/* ═══ SUGGESTIONS DIFF VIEW ═══ */}
        {suggestions && (
          <div className="space-y-6 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-stone-900">Suggested Changes</h3>
              <div className="flex gap-3">
                <button onClick={() => { setSuggestions(null); setSaveStatus({}); }}
                  className="px-4 py-2 bg-white text-stone-900 rounded-lg font-bold hover:bg-stone-200 border-2 border-stone-900">
                  Discard All
                </button>
                <button onClick={saveSelected}
                  disabled={loading === 'saving' || !Object.values(selectedSuggestions).some(Boolean)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors border-2 border-stone-900 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading === 'saving' ? 'Saving...' : `Save Selected (${Object.values(selectedSuggestions).filter(Boolean).length})`}
                </button>
              </div>
            </div>

            {suggestions.map((suggestion, idx) => {
              const isSchool = suggestion.id === 'school';
              const original = isSchool
                ? { summary: school?.summary || '', pros: school?.pros || '', cons: school?.cons || '' }
                : reviews.find(r => r.id === suggestion.id);

              if (!original) return null;

              return (
                <div key={suggestion.id}
                  className={`bg-white rounded-2xl border-4 ${suggestion.changed ? 'border-orange-400' : 'border-stone-300'} overflow-hidden`}>

                  <div className="p-4 bg-stone-50 border-b-2 border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {suggestion.changed && (
                        <input type="checkbox" checked={!!selectedSuggestions[suggestion.id]}
                          onChange={() => toggleSuggestion(suggestion.id)}
                          className="w-5 h-5 rounded border-2 border-stone-900 accent-orange-600" />
                      )}
                      <span className="font-bold text-stone-900">
                        {isSchool ? 'School Info' : `Review #${idx} — ${original.position || 'Teacher'}`}
                      </span>
                      {saveStatus[suggestion.id] === 'saved' && <span className="text-green-700 font-bold text-sm">Saved</span>}
                      {saveStatus[suggestion.id] === 'error' && <span className="text-red-700 font-bold text-sm">Error</span>}
                    </div>
                    {suggestion.changed ? (
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">
                        {suggestion.change_summary}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-sm">No changes</span>
                    )}
                  </div>

                  {suggestion.changed && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
                      <div className="p-4">
                        <h4 className="text-sm font-bold text-stone-500 mb-3 uppercase">Original</h4>
                        {isSchool ? (
                          <>
                            <DiffField label="Overview" value={original.summary} />
                            <DiffField label="What Teachers Love" value={original.pros} />
                            <DiffField label="Common Concerns" value={original.cons} />
                          </>
                        ) : (
                          <>
                            <DiffField label="Pros" value={original.pros} />
                            <DiffField label="Cons" value={original.cons} />
                            <DiffField label="Advice" value={original.advice_for_teachers} />
                          </>
                        )}
                      </div>
                      <div className="p-4 bg-orange-50">
                        <h4 className="text-sm font-bold text-orange-700 mb-3 uppercase">Suggested</h4>
                        {isSchool ? (
                          <>
                            <DiffField label="Overview" value={suggestion.summary} highlight original={original.summary} />
                            <DiffField label="What Teachers Love" value={suggestion.pros} highlight original={original.pros} />
                            <DiffField label="Common Concerns" value={suggestion.cons} highlight original={original.cons} />
                          </>
                        ) : (
                          <>
                            <DiffField label="Pros" value={suggestion.pros} highlight original={original.pros} />
                            <DiffField label="Cons" value={suggestion.cons} highlight original={original.cons} />
                            <DiffField label="Advice" value={suggestion.advice_for_teachers} highlight original={original.advice_for_teachers} />
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

// ── Sub-components ──

function ReviewCard({ review, index }) {
  return (
    <div className="bg-white p-5 rounded-2xl border-4 border-stone-900">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-stone-900">Review #{index + 1} — {review.position || 'Teacher'}</span>
        <div className="flex items-center gap-3 text-sm text-stone-600">
          {review.years_taught && <span>{review.years_taught} yrs</span>}
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded font-bold">{review.overall_rating}/10</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
        <div className="bg-stone-50 p-3 rounded-lg">
          <span className="text-stone-500 block mb-1">Sub-ratings</span>
          <div className="space-y-1">
            <RatingRow label="Admin" value={review.admin_responsiveness} />
            <RatingRow label="Community" value={review.teacher_community} />
            <RatingRow label="PD" value={review.professional_development_opportunities} />
            <RatingRow label="Work-life" value={review.work_life_balance} />
          </div>
        </div>
        <div className="bg-stone-50 p-3 rounded-lg">
          <span className="text-stone-500 block mb-1">Salary</span>
          <span className="font-bold">
            {review.reported_salary_min && review.reported_salary_max
              ? `${review.reported_salary_min.toLocaleString()} - ${review.reported_salary_max.toLocaleString()} ${review.salary_currency || 'USD'}`
              : 'Not reported'}
          </span>
          {review.contract_type && <span className="block text-stone-500 mt-1">{review.contract_type}</span>}
        </div>
      </div>

      {review.pros && (
        <div className="mb-2">
          <span className="text-xs font-bold text-green-700 uppercase">Pros</span>
          <p className="text-sm text-stone-800 mt-1">{review.pros}</p>
        </div>
      )}
      {review.cons && (
        <div className="mb-2">
          <span className="text-xs font-bold text-red-700 uppercase">Cons</span>
          <p className="text-sm text-stone-800 mt-1">{review.cons}</p>
        </div>
      )}
      {review.advice_for_teachers && (
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase">Advice</span>
          <p className="text-sm text-stone-800 mt-1">{review.advice_for_teachers}</p>
        </div>
      )}
    </div>
  );
}

function RatingRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between">
      <span className="text-stone-600">{label}</span>
      <span className="font-bold">{value}/10</span>
    </div>
  );
}

function DiffField({ label, value, highlight, original }) {
  const changed = highlight && value !== original;
  return (
    <div className="mb-3">
      <span className={`text-xs font-bold uppercase ${highlight ? 'text-orange-700' : 'text-stone-500'}`}>
        {label} {changed && '(changed)'}
      </span>
      <p className={`text-sm mt-1 ${changed ? 'text-stone-900 font-medium' : 'text-stone-700'}`}>
        {value || '(empty)'}
      </p>
    </div>
  );
}
