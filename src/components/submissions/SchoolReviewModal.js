'use client';

import { useState } from 'react';

const SCHOOL_TYPES = [
  'International',
  'Bilingual',
  'Language Center',
  'Private National',
  'Other',
];

export default function SchoolReviewModal({ school, isNewSchool, cityId, cityName, onClose }) {
  const [formData, setFormData] = useState({
    submitter_email: '',
    // New school fields
    school_name: '',
    school_type: 'International',
    school_website: '',
    school_district: '',
    // Review fields
    overall_rating: 3,
    years_taught: '',
    position: '',
    contract_type: 'foreign',
    admin_responsiveness: 3,
    teacher_community: 3,
    professional_development_opportunities: 3,
    work_life_balance: 3,
    pros: '',
    cons: '',
    advice_for_teachers: '',
    reported_salary_min: '',
    reported_salary_max: '',
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

    // Client-side validation for new school
    if (isNewSchool && !formData.school_name.trim()) {
      setErrors({ school_name: 'School name is required' });
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = isNewSchool
        ? '/api/submissions/school-suggestion'
        : '/api/submissions/school-review';

      const payload = {
        city_id: cityId,
        submitter_email: formData.submitter_email,
        overall_rating: parseInt(formData.overall_rating),
        years_taught: formData.years_taught ? parseInt(formData.years_taught) : undefined,
        position: formData.position || undefined,
        contract_type: formData.contract_type || undefined,
        admin_responsiveness: parseInt(formData.admin_responsiveness),
        teacher_community: parseInt(formData.teacher_community),
        professional_development_opportunities: parseInt(formData.professional_development_opportunities),
        work_life_balance: parseInt(formData.work_life_balance),
        pros: formData.pros || undefined,
        cons: formData.cons || undefined,
        advice_for_teachers: formData.advice_for_teachers || undefined,
        reported_salary_min: formData.reported_salary_min ? parseInt(formData.reported_salary_min) : undefined,
        reported_salary_max: formData.reported_salary_max ? parseInt(formData.reported_salary_max) : undefined,
      };

      if (isNewSchool) {
        payload.school_name = formData.school_name.trim();
        payload.school_type = formData.school_type;
        payload.school_website = formData.school_website.trim() || undefined;
        payload.school_district = formData.school_district.trim() || undefined;
      } else {
        payload.school_id = school.id;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
              Click the link to verify your submission.
            </p>
            {isNewSchool && (
              <p className="text-sm text-stone-500 mb-4">
                Your school suggestion and review will both be reviewed by our team before appearing on the site.
              </p>
            )}
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

  const headerTitle = isNewSchool
    ? 'Suggest a School & Write Review'
    : `Review ${school.name}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b-4 border-stone-900 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className="text-3xl font-black text-stone-900">{headerTitle}</h2>
            <p className="text-stone-600 mt-1">{cityName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border-2 border-red-600 rounded-lg p-4 text-red-800">
              {errors.general}
            </div>
          )}

          {/* New School Details — only shown when suggesting a new school */}
          {isNewSchool && (
            <div className="bg-blue-50 border-2 border-blue-600 rounded-xl p-5 space-y-4">
              <h3 className="text-lg font-bold text-stone-900">School Details</h3>
              <p className="text-sm text-stone-600">Tell us about this school. Our team will review it before adding it to the directory.</p>

              <div>
                <label className="block text-sm font-bold text-stone-900 mb-2">
                  School Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.school_name}
                  onChange={(e) => handleChange('school_name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., ABC International School"
                />
                {errors.school_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.school_name}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-900 mb-2">
                    School Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.school_type}
                    onChange={(e) => handleChange('school_type', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {SCHOOL_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-900 mb-2">
                    District / Area
                  </label>
                  <input
                    type="text"
                    value={formData.school_district}
                    onChange={(e) => handleChange('school_district', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g., District 2, Thao Dien"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-900 mb-2">
                  School Website
                </label>
                <input
                  type="url"
                  value={formData.school_website}
                  onChange={(e) => handleChange('school_website', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="https://www.schoolname.edu.vn"
                />
                {errors.school_website && (
                  <p className="text-red-600 text-sm mt-1">{errors.school_website}</p>
                )}
                <p className="text-xs text-stone-500 mt-1">Helps us verify the school exists</p>
              </div>
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
            <p className="text-xs text-stone-500 mt-1">We'll send a verification email here</p>
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Overall Rating <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleChange('overall_rating', rating)}
                  className={`w-12 h-12 rounded-full border-2 border-stone-900 font-bold text-lg transition-all ${
                    formData.overall_rating >= rating
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* Years Taught & Contract Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">
                Years Taught Here
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.years_taught}
                onChange={(e) => handleChange('years_taught', e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">
                Contract Type
              </label>
              <select
                value={formData.contract_type}
                onChange={(e) => handleChange('contract_type', e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                <option value="foreign">Foreign Contract</option>
                <option value="local">Local Contract</option>
                <option value="management">Management</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Your Position
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="e.g., Primary English Teacher"
            />
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-stone-900">Detailed Ratings</h3>

            {[
              { field: 'admin_responsiveness', label: 'Admin Responsiveness' },
              { field: 'teacher_community', label: 'Teacher Community' },
              { field: 'professional_development_opportunities', label: 'Professional Development' },
              { field: 'work_life_balance', label: 'Work-Life Balance' },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="block text-sm font-bold text-stone-900 mb-2">{label}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleChange(field, rating)}
                      className={`w-10 h-10 rounded-full border-2 border-stone-900 font-bold transition-all ${
                        formData[field] >= rating
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pros */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              What Teachers Love (Pros)
            </label>
            <textarea
              value={formData.pros}
              onChange={(e) => handleChange('pros', e.target.value)}
              rows={4}
              maxLength={2000}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="Supportive management, modern facilities, great professional development..."
            />
            <p className="text-xs text-stone-500 mt-1">{formData.pros.length}/2000 characters</p>
            {errors.pros && <p className="text-red-600 text-sm mt-1">{errors.pros}</p>}
          </div>

          {/* Cons */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Common Concerns (Cons)
            </label>
            <textarea
              value={formData.cons}
              onChange={(e) => handleChange('cons', e.target.value)}
              rows={4}
              maxLength={2000}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="High workload, limited parent communication, dated curriculum..."
            />
            <p className="text-xs text-stone-500 mt-1">{formData.cons.length}/2000 characters</p>
            {errors.cons && <p className="text-red-600 text-sm mt-1">{errors.cons}</p>}
          </div>

          {/* Salary (Optional) */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Salary Range (USD, Optional)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                min="0"
                value={formData.reported_salary_min}
                onChange={(e) => handleChange('reported_salary_min', e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Min (e.g., 25000)"
              />
              <input
                type="number"
                min="0"
                value={formData.reported_salary_max}
                onChange={(e) => handleChange('reported_salary_max', e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Max (e.g., 35000)"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white pt-6 border-t-4 border-stone-900 -mx-6 px-6 -mb-6 pb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 text-white py-4 rounded-lg font-black text-lg hover:bg-orange-700 transition-colors border-2 border-stone-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : (isNewSchool ? 'Submit School & Review' : 'Submit Review')}
            </button>
            <p className="text-xs text-stone-500 text-center mt-3">
              By submitting, you agree to our community guidelines and verify that this is an honest review based on your experience.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
