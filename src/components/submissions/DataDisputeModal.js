'use client';

import { useState } from 'react';

const CATEGORIES = [
  'Incorrect salary or compensation data',
  'Wrong school details (name, type, contact)',
  'Outdated programme information',
  'Inaccurate teacher reviews',
  'Wrong location or address',
  'Other',
];

export default function DataDisputeModal({ schoolId, schoolName, onClose }) {
  const [formData, setFormData] = useState({
    category: CATEGORIES[0],
    description: '',
    evidence_url: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/submissions/data-dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_id: schoolId,
          category: formData.category,
          description: formData.description,
          evidence_url: formData.evidence_url || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.details) {
          const fieldErrors = {};
          result.details.forEach(err => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: result.error || 'Submission failed' });
        }
        return;
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error('Dispute submission error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-8 border-4 border-stone-900">
          <div className="text-center">
            <div className="text-6xl mb-4">
              <svg className="w-16 h-16 mx-auto text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-stone-900 mb-4">Thanks for flagging this!</h2>
            <p className="text-lg text-stone-600 mb-6">
              We&apos;ll review your report for <strong>{schoolName}</strong> and update the data if needed.
            </p>
            <button
              onClick={onClose}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors border-2 border-stone-900"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-4 border-stone-900 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className="text-3xl font-black text-stone-900">Report a Data Issue</h2>
            <p className="text-stone-600 mt-1">{schoolName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border-2 border-red-600 rounded-lg p-4 text-red-800">
              {errors.general}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              What&apos;s wrong? <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Describe the issue <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={5}
              minLength={20}
              maxLength={1000}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="Tell us what's incorrect and what the correct information should be..."
            />
            <p className="text-xs text-stone-500 mt-1">
              {formData.description.length}/1000 characters (minimum 20)
            </p>
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Evidence URL */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Source or evidence link <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.evidence_url}
              onChange={(e) => handleChange('evidence_url', e.target.value)}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="https://..."
            />
            {errors.evidence_url && (
              <p className="text-red-600 text-sm mt-1">{errors.evidence_url}</p>
            )}
          </div>

          {/* Submit */}
          <div className="sticky bottom-0 bg-white pt-6 border-t-4 border-stone-900 -mx-6 px-6 -mb-6 pb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 text-white py-4 rounded-lg font-black text-lg hover:bg-orange-700 transition-colors border-2 border-stone-900 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
