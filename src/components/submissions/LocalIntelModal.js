'use client';

import { useState } from 'react';

const CATEGORIES = [
  'Restaurants & Food',
  'Apartment Hunting',
  'Transportation',
  'Shopping',
  'Safety & Avoiding Scams',
  'Social Life',
  'Banking & Finance',
  'Healthcare Tips',
  'Other'
];

export default function LocalIntelModal({ cityId, cityName, onClose }) {
  const [formData, setFormData] = useState({
    submitter_email: '',
    category: 'Restaurants & Food',
    tip_text: '',
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
      const response = await fetch('/api/submissions/local-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city_id: cityId,
          submitter_email: formData.submitter_email,
          category: formData.category,
          tip_text: formData.tip_text,
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
      console.error('Submission error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-8 border-4 border-stone-900">
          <div className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-3xl font-black text-stone-900 mb-4">Check Your Email!</h2>
            <p className="text-lg text-stone-600 mb-6">
              We sent a verification link to <strong>{formData.submitter_email}</strong>.
              Click the link to verify your tip.
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-4 border-stone-900 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className="text-3xl font-black text-stone-900">Share Local Intel</h2>
            <p className="text-stone-600 mt-1">{cityName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border-2 border-red-600 rounded-lg p-4 text-red-800">
              {errors.general}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Your Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.submitter_email}
              onChange={(e) => handleChange('submitter_email', e.target.value)}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="your.email@example.com"
            />
            {errors.submitter_email && (
              <p className="text-red-600 text-sm mt-1">{errors.submitter_email}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Category <span className="text-red-600">*</span>
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
          </div>

          {/* Tip Text */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Your Tip <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              value={formData.tip_text}
              onChange={(e) => handleChange('tip_text', e.target.value)}
              rows={6}
              minLength={20}
              maxLength={1000}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="Example: Use Grab instead of taxis — safer and cheaper. Download the app before you arrive and link a credit card."
            />
            <p className="text-xs text-stone-500 mt-1">
              {formData.tip_text.length}/1000 characters (minimum 20)
            </p>
            {errors.tip_text && (
              <p className="text-red-600 text-sm mt-1">{errors.tip_text}</p>
            )}
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-4">
            <h4 className="font-bold text-stone-900 mb-2">💡 Good Tips Are:</h4>
            <ul className="text-sm text-stone-700 space-y-1 list-disc list-inside">
              <li>Specific and actionable</li>
              <li>Based on personal experience</li>
              <li>Helpful for teachers arriving in {cityName}</li>
              <li>Honest but constructive</li>
            </ul>
          </div>

          {/* Submit */}
          <div className="sticky bottom-0 bg-white pt-6 border-t-4 border-stone-900 -mx-6 px-6 -mb-6 pb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 text-white py-4 rounded-lg font-black text-lg hover:bg-orange-700 transition-colors border-2 border-stone-900 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Tip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
