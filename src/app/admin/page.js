'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

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

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password) return;
    setIsAuthenticated(true);
    fetchSubmissions();
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [statusFilter, isAuthenticated]);

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
          <h1 className="text-5xl font-black text-stone-900">Submission Moderation</h1>
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
                      <p>Rating: {submission.school_reviews[0].overall_rating}/5</p>
                      {submission.school_reviews[0].schools?.name && (
                        <p className="mt-2">
                          <strong>Pros:</strong> {submission.school_reviews[0].pros?.substring(0, 100)}...
                        </p>
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
