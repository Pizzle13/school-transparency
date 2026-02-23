'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('submissions'); // 'submissions' | 'disputes' | 'linking'

  // Submissions state
  const [submissions, setSubmissions] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Disputes state
  const [disputes, setDisputes] = useState([]);
  const [disputeCounts, setDisputeCounts] = useState({ open: 0, resolved: 0, dismissed: 0 });
  const [disputeFilter, setDisputeFilter] = useState('open');
  const [disputeLoading, setDisputeLoading] = useState(false);

  // School linking state
  const [linkCities, setLinkCities] = useState([]);
  const [linkSelectedCity, setLinkSelectedCity] = useState(null);
  const [linkSuggestions, setLinkSuggestions] = useState(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkActionLoading, setLinkActionLoading] = useState({});

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/submissions?status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          alert('Invalid password');
        }
        return;
      }

      const data = await response.json();
      setSubmissions(data.submissions);
      setCounts(data.counts);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchDisputes = async () => {
    setDisputeLoading(true);
    try {
      const response = await fetch(`/api/admin/disputes?status=${disputeFilter}`, {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      setDisputes(data.disputes);
      setDisputeCounts(data.counts);
    } catch (error) {
      console.error('Disputes fetch error:', error);
    } finally {
      setDisputeLoading(false);
    }
  };

  const fetchLinkCities = async () => {
    setLinkLoading(true);
    try {
      const response = await fetch('/api/admin/link-schools', {
        headers: { 'Authorization': `Bearer ${password}` }
      });
      if (!response.ok) return;
      const data = await response.json();
      setLinkCities(data.cities || []);
    } catch (error) {
      console.error('Link cities fetch error:', error);
    } finally {
      setLinkLoading(false);
    }
  };

  const fetchLinkSuggestions = async (citySlug) => {
    setLinkLoading(true);
    try {
      const response = await fetch(`/api/admin/link-schools?city=${citySlug}`, {
        headers: { 'Authorization': `Bearer ${password}` }
      });
      if (!response.ok) return;
      const data = await response.json();
      setLinkSuggestions(data);
    } catch (error) {
      console.error('Link suggestions fetch error:', error);
    } finally {
      setLinkLoading(false);
    }
  };

  const handleLinkAction = async (action, payload) => {
    const key = payload.pipelineSchoolId || 'bulk';
    setLinkActionLoading(prev => ({ ...prev, [key]: true }));
    try {
      const response = await fetch('/api/admin/link-schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ action, ...payload })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Refresh suggestions
        if (linkSelectedCity) {
          fetchLinkSuggestions(linkSelectedCity);
        }
        return data;
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (error) {
      console.error('Link action error:', error);
      alert('Error performing action');
    } finally {
      setLinkActionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleBulkLink = async (citySlug) => {
    if (!confirm('Auto-merge all high-confidence matches for this city?')) return;
    const result = await handleLinkAction('bulk', { citySlug, threshold: 0.7 });
    if (result) {
      alert(`${result.summary}\n\nMerged: ${result.merged?.map(m => `${m.pipeline} → ${m.directory}`).join('\n') || 'none'}`);
      fetchLinkCities();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password) return;
    setIsAuthenticated(true);
  };

  const handleAction = async (submissionId, action) => {
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({
          action,
          rejection_reason: rejectionReason
        })
      });

      if (response.ok) {
        setRejectionReason('');
        setSelectedSubmission(null);
        fetchSubmissions();
      } else {
        alert('Failed to perform action');
      }
    } catch (error) {
      console.error('Action error:', error);
      alert('Error performing action');
    }
  };

  const handleDisputeAction = async (disputeId, action) => {
    try {
      const response = await fetch('/api/admin/disputes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ id: disputeId, action })
      });

      if (response.ok) {
        fetchDisputes();
      } else {
        alert('Failed to update dispute');
      }
    } catch (error) {
      console.error('Dispute action error:', error);
    }
  };

  // Fetch dispute counts on login so the badge shows on the toggle button
  useEffect(() => {
    if (isAuthenticated) {
      fetchDisputes();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeView === 'submissions') {
      fetchSubmissions();
    }
  }, [statusFilter, isAuthenticated, activeView]);

  useEffect(() => {
    if (isAuthenticated && activeView === 'disputes') {
      fetchDisputes();
    }
  }, [disputeFilter, isAuthenticated, activeView]);

  useEffect(() => {
    if (isAuthenticated && activeView === 'linking') {
      fetchLinkCities();
    }
  }, [isAuthenticated, activeView]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border-4 border-stone-900 max-w-md w-full">
          <h1 className="text-3xl font-black text-stone-900 mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors border-2 border-stone-900"
            >
              Login
            </button>
          </form>
          <p className="text-xs text-stone-500 text-center mt-4">
            Admin dashboard is localhost-only
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-black text-stone-900">
            {activeView === 'submissions' ? 'Submission Moderation'
              : activeView === 'disputes' ? 'Data Disputes'
              : 'Link Schools'}
          </h1>
          <div className="flex gap-3">
            {['submissions', 'disputes', 'linking'].map(view => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 rounded-lg font-bold border-2 border-stone-900 transition-colors ${
                  activeView === view
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-900 hover:bg-stone-200'
                }`}
              >
                {view === 'submissions' ? 'Submissions' : view === 'disputes' ? 'Disputes' : 'Link Schools'}
                {view === 'disputes' && disputeCounts.open > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full">
                    {disputeCounts.open}
                  </span>
                )}
                {view === 'linking' && linkCities.some(c => c.unlinked > 0) && (
                  <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-orange-600 text-white text-xs font-bold rounded-full">
                    !
                  </span>
                )}
              </button>
            ))}
            <a
              href="/admin/editor"
              className="px-4 py-2 bg-white text-stone-900 rounded-lg font-bold hover:bg-stone-200 border-2 border-stone-900"
            >
              Review Editor
            </a>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword('');
              }}
              className="px-4 py-2 bg-stone-600 text-white rounded-lg font-bold hover:bg-stone-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ─── SUBMISSIONS VIEW ─── */}
        {activeView === 'submissions' && (
          <>
            {/* Status Tabs */}
            <div className="flex gap-4 mb-6 flex-wrap">
              {['pending', 'approved', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-3 rounded-lg font-bold border-2 border-stone-900 transition-colors ${
                    statusFilter === status
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({counts[status]})
                </button>
              ))}
            </div>

            {/* Submissions List */}
            {loading ? (
              <div className="text-center py-12 bg-white rounded-2xl border-4 border-stone-900">
                <p>Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border-4 border-stone-900 text-center">
                <p className="text-xl text-stone-600">No {statusFilter} submissions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map(submission => (
                  <div
                    key={submission.id}
                    className="bg-white p-6 rounded-2xl border-4 border-stone-900 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold mb-2">
                          {submission.submission_type.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        {!submission.email_verified && (
                          <span className="inline-block ml-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                            ⚠ NOT VERIFIED
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-stone-900">
                          {submission.cities?.name}
                        </h3>
                        <p className="text-sm text-stone-600">
                          {submission.submitter_email}
                        </p>
                        <p className="text-sm text-stone-600">
                          {new Date(submission.submitted_at).toLocaleString()}
                        </p>
                      </div>

                      {statusFilter === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(submission.id, 'approve')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors border-2 border-stone-900"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors border-2 border-stone-900"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Submission Details */}
                    <div className="bg-stone-50 p-4 rounded-lg border-2 border-stone-200 text-sm">
                      {submission.submission_type === 'school_review' && submission.school_reviews?.[0] && (
                        <div>
                          <p className="font-bold">
                            School: {submission.school_reviews[0].schools?.name}
                          </p>
                          <p>Rating: {submission.school_reviews[0].overall_rating}/10</p>
                          {submission.school_reviews[0].pros && (
                            <p className="mt-2">
                              <strong>Pros:</strong> {submission.school_reviews[0].pros.substring(0, 200)}{submission.school_reviews[0].pros.length > 200 ? '...' : ''}
                            </p>
                          )}
                          {submission.school_reviews[0].cons && (
                            <p className="mt-1">
                              <strong>Cons:</strong> {submission.school_reviews[0].cons.substring(0, 200)}{submission.school_reviews[0].cons.length > 200 ? '...' : ''}
                            </p>
                          )}
                        </div>
                      )}

                      {submission.submission_type === 'school_suggestion' && submission.school_suggestions?.[0] && (
                        <div>
                          <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-3">
                            <p className="font-bold text-blue-900">
                              NEW SCHOOL: {submission.school_suggestions[0].school_name}
                            </p>
                            <p className="text-blue-800">Type: {submission.school_suggestions[0].school_type}</p>
                            {submission.school_suggestions[0].school_district && (
                              <p className="text-blue-800">District: {submission.school_suggestions[0].school_district}</p>
                            )}
                            {submission.school_suggestions[0].school_website && (
                              <p className="text-blue-800">
                                Website: <a href={submission.school_suggestions[0].school_website} target="_blank" rel="noopener noreferrer" className="underline">{submission.school_suggestions[0].school_website}</a>
                              </p>
                            )}
                            <p className="text-xs text-blue-600 mt-2 font-bold">
                              Approving will add this school to the directory and publish the attached review.
                            </p>
                          </div>
                          {submission.school_reviews?.[0] && (
                            <div>
                              <p>Review Rating: {submission.school_reviews[0].overall_rating}/10</p>
                              {submission.school_reviews[0].pros && (
                                <p className="mt-1"><strong>Pros:</strong> {submission.school_reviews[0].pros.substring(0, 200)}{submission.school_reviews[0].pros.length > 200 ? '...' : ''}</p>
                              )}
                              {submission.school_reviews[0].cons && (
                                <p className="mt-1"><strong>Cons:</strong> {submission.school_reviews[0].cons.substring(0, 200)}{submission.school_reviews[0].cons.length > 200 ? '...' : ''}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {submission.submission_type === 'local_intel' && submission.local_intel_submissions?.[0] && (
                        <div>
                          <p className="font-bold">{submission.local_intel_submissions[0].category}</p>
                          <p className="mt-1 text-stone-700">
                            {submission.local_intel_submissions[0].tip_text.substring(0, 150)}...
                          </p>
                        </div>
                      )}

                      {submission.submission_type === 'housing' && submission.housing_submissions?.[0] && (
                        <div>
                          <p className="font-bold">{submission.housing_submissions[0].area_name}</p>
                          {submission.housing_submissions[0].rent_1br && (
                            <p>Est. 1BR: ${submission.housing_submissions[0].rent_1br}/month</p>
                          )}
                        </div>
                      )}

                      {submission.submission_type === 'salary' && submission.salary_submissions?.[0] && (
                        <div>
                          <p className="font-bold">{submission.salary_submissions[0].position}</p>
                          <p>${submission.salary_submissions[0].salary_amount.toLocaleString()}/year</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ─── DISPUTES VIEW ─── */}
        {activeView === 'disputes' && (
          <>
            {/* Status Tabs */}
            <div className="flex gap-4 mb-6 flex-wrap">
              {['open', 'resolved', 'dismissed'].map(status => (
                <button
                  key={status}
                  onClick={() => setDisputeFilter(status)}
                  className={`px-6 py-3 rounded-lg font-bold border-2 border-stone-900 transition-colors ${
                    disputeFilter === status
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({disputeCounts[status]})
                </button>
              ))}
            </div>

            {/* Disputes List */}
            {disputeLoading ? (
              <div className="text-center py-12 bg-white rounded-2xl border-4 border-stone-900">
                <p>Loading disputes...</p>
              </div>
            ) : disputes.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border-4 border-stone-900 text-center">
                <p className="text-xl text-stone-600">No {disputeFilter} disputes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {disputes.map(dispute => (
                  <div
                    key={dispute.id}
                    className="bg-white p-6 rounded-2xl border-4 border-stone-900 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold mb-2">
                          DATA DISPUTE
                        </span>
                        <h3 className="text-lg font-bold text-stone-900">
                          {dispute.schools?.name || 'Unknown school'}
                        </h3>
                        <p className="text-sm text-stone-600">
                          {dispute.category}
                        </p>
                        <p className="text-sm text-stone-600">
                          {new Date(dispute.created_at).toLocaleString()}
                        </p>
                      </div>

                      {disputeFilter === 'open' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDisputeAction(dispute.id, 'resolve')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors border-2 border-stone-900"
                          >
                            ✓ Resolve
                          </button>
                          <button
                            onClick={() => handleDisputeAction(dispute.id, 'dismiss')}
                            className="px-4 py-2 bg-stone-500 text-white rounded-lg font-bold hover:bg-stone-600 transition-colors border-2 border-stone-900"
                          >
                            ✗ Dismiss
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Dispute Details */}
                    <div className="bg-stone-50 p-4 rounded-lg border-2 border-stone-200 text-sm space-y-2">
                      <p className="text-stone-700">{dispute.description}</p>
                      {dispute.evidence_url && (
                        <p>
                          <strong>Evidence:</strong>{' '}
                          <a
                            href={dispute.evidence_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline break-all"
                          >
                            {dispute.evidence_url}
                          </a>
                        </p>
                      )}
                      {dispute.schools?.slug && (
                        <p>
                          <a
                            href={`/schools/s/${dispute.schools.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-xs"
                          >
                            View school profile
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ─── LINK SCHOOLS VIEW ─── */}
        {activeView === 'linking' && (
          <>
            {!linkSelectedCity ? (
              /* City list */
              linkLoading ? (
                <div className="text-center py-12 bg-white rounded-2xl border-4 border-stone-900">
                  <p>Loading cities...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-stone-600 mb-4">
                    When a city is imported via the pipeline, its schools may already exist in the IBO directory.
                    Use this tool to merge pipeline review/salary data onto existing directory schools.
                  </p>
                  {linkCities.map(city => (
                    <div
                      key={city.id}
                      className="bg-white p-5 rounded-2xl border-4 border-stone-900 flex items-center justify-between hover:shadow-lg transition-shadow"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-stone-900">{city.name}</h3>
                        <p className="text-sm text-stone-600">
                          {city.totalLinked} pipeline schools &middot; {city.inDirectory} already in directory
                          {city.unlinked > 0 && (
                            <span className="text-orange-600 font-bold"> &middot; {city.unlinked} unlinked</span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {city.unlinked > 0 && (
                          <>
                            <button
                              onClick={() => handleBulkLink(city.slug)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors border-2 border-stone-900 text-sm"
                            >
                              Auto-Link All
                            </button>
                            <button
                              onClick={() => {
                                setLinkSelectedCity(city.slug);
                                fetchLinkSuggestions(city.slug);
                              }}
                              className="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors border-2 border-stone-900 text-sm"
                            >
                              Review Matches
                            </button>
                          </>
                        )}
                        {city.unlinked === 0 && city.totalLinked > 0 && (
                          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold text-sm">
                            All linked
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Suggestions for selected city */
              <>
                <button
                  onClick={() => { setLinkSelectedCity(null); setLinkSuggestions(null); fetchLinkCities(); }}
                  className="mb-4 px-4 py-2 bg-white text-stone-900 rounded-lg font-bold hover:bg-stone-200 border-2 border-stone-900 text-sm"
                >
                  &larr; Back to cities
                </button>

                {linkLoading ? (
                  <div className="text-center py-12 bg-white rounded-2xl border-4 border-stone-900">
                    <p>Analyzing matches...</p>
                  </div>
                ) : linkSuggestions ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-stone-600">
                        <strong>{linkSuggestions.city?.name}</strong>: {linkSuggestions.unlinkedCount} unlinked pipeline schools,
                        {' '}{linkSuggestions.alreadyLinked} already linked
                      </p>
                      {linkSuggestions.unlinkedCount > 0 && (
                        <button
                          onClick={() => handleBulkLink(linkSelectedCity)}
                          disabled={linkActionLoading.bulk}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors border-2 border-stone-900 text-sm disabled:opacity-50"
                        >
                          {linkActionLoading.bulk ? 'Merging...' : 'Auto-Link All High Confidence'}
                        </button>
                      )}
                    </div>

                    {linkSuggestions.suggestions?.map(s => (
                      <div
                        key={s.pipelineSchool.id}
                        className="bg-white p-5 rounded-2xl border-4 border-stone-900"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-stone-900">{s.pipelineSchool.name}</h4>
                            <p className="text-sm text-stone-500">
                              Pipeline &middot; Rating: {s.pipelineSchool.rating || '–'} &middot;
                              {' '}{s.pipelineSchool.reviews || 0} reviews &middot;
                              {' '}{s.pipelineSchool.salary_range || 'No salary data'}
                            </p>

                            {s.bestMatch ? (
                              <div className="mt-3 bg-green-50 border-2 border-green-200 rounded-lg p-3">
                                <p className="text-sm font-bold text-green-800">
                                  Best match: {s.bestMatch.directorySchool.name}
                                  <span className="ml-2 text-green-600">
                                    ({Math.round(s.bestMatch.similarity * 100)}% confidence)
                                  </span>
                                </p>
                                <p className="text-xs text-green-700 mt-1">
                                  Programmes: {s.bestMatch.directorySchool.programmes?.join(', ') || 'None'}
                                  {' '}&middot; Slug: {s.bestMatch.directorySchool.slug}
                                </p>

                                {s.suggestedMatches.length > 1 && (
                                  <details className="mt-2">
                                    <summary className="text-xs text-green-600 cursor-pointer">
                                      {s.suggestedMatches.length - 1} other potential matches
                                    </summary>
                                    {s.suggestedMatches.slice(1).map(m => (
                                      <p key={m.directorySchool.id} className="text-xs text-green-700 mt-1">
                                        {m.directorySchool.name} ({Math.round(m.similarity * 100)}%)
                                      </p>
                                    ))}
                                  </details>
                                )}
                              </div>
                            ) : (
                              <div className="mt-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                                <p className="text-sm font-bold text-yellow-800">No directory match found</p>
                                <p className="text-xs text-yellow-700">
                                  This school can be added to the directory with a new slug.
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 flex-shrink-0">
                            {s.bestMatch && (
                              <button
                                onClick={() => handleLinkAction('merge', {
                                  pipelineSchoolId: s.pipelineSchool.id,
                                  directorySchoolId: s.bestMatch.directorySchool.id,
                                })}
                                disabled={linkActionLoading[s.pipelineSchool.id]}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors border-2 border-stone-900 text-xs disabled:opacity-50"
                              >
                                {linkActionLoading[s.pipelineSchool.id] ? '...' : 'Merge'}
                              </button>
                            )}
                            <button
                              onClick={() => handleLinkAction('skip', {
                                pipelineSchoolId: s.pipelineSchool.id,
                              })}
                              disabled={linkActionLoading[s.pipelineSchool.id]}
                              className="px-3 py-2 bg-stone-200 text-stone-700 rounded-lg font-bold hover:bg-stone-300 transition-colors border-2 border-stone-300 text-xs disabled:opacity-50"
                            >
                              {linkActionLoading[s.pipelineSchool.id] ? '...' : 'Add as New'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </>
        )}

        {/* Rejection Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 border-4 border-stone-900">
              <h2 className="text-2xl font-black text-stone-900 mb-4">Reject Submission</h2>
              <p className="text-stone-600 mb-4">Provide a reason for rejection:</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg mb-4"
                placeholder="e.g., Does not provide enough detail, inappropriate content, etc."
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(selectedSubmission.id, 'reject')}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors border-2 border-stone-900"
                >
                  Confirm Reject
                </button>
                <button
                  onClick={() => {
                    setSelectedSubmission(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 bg-white text-stone-900 py-3 rounded-lg font-bold hover:bg-stone-100 transition-colors border-2 border-stone-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
