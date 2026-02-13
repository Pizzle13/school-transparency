'use client';

export default function SchoolDetailModal({ school, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                {school.type}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-xl">★</span>
                <span className="text-lg font-bold text-slate-700">{school.rating}</span>
                <span className="text-sm text-slate-500">({school.reviews} reviews)</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">{school.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl mb-1">👥</div>
              <div className="text-sm text-slate-600">Students</div>
              <div className="text-xl font-bold text-blue-700">{school.student_count || 'N/A'}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-sm text-slate-600">Salary Range</div>
              <div className="text-xl font-bold text-green-700">{school.salary_range || 'N/A'}</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-sm text-slate-600">Community Rating</div>
              <div className="text-xl font-bold text-orange-700">{school.rating || 'N/A'}</div>
            </div>
          </div>

          {/* Low-data disclaimer */}
          {school.reviews < 3 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>Limited data:</strong> This school has {school.reviews === 1 ? 'only 1 teacher review' : `only ${school.reviews} teacher reviews`}. Summary and pros/cons require more reviews to generate reliable patterns. Check back as more teachers share their experiences.
              </p>
            </div>
          )}

          {/* School Summary */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Overview</h3>
            <p className="text-slate-700 leading-relaxed">{school.summary || 'No summary available yet.'}</p>
          </div>

          {/* Pros & Cons */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pros */}
            {school.pros && (
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  <span>✓</span> What Teachers Love
                </h4>
                <p className="text-slate-700 leading-relaxed">{school.pros}</p>
              </div>
            )}

            {/* Cons */}
            {school.cons && (
              <div className="bg-red-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                  <span>⚠</span> Common Concerns
                </h4>
                <p className="text-slate-700 leading-relaxed">{school.cons}</p>
              </div>
            )}
          </div>

          {/* Data Source Disclaimer */}
          <div className="bg-slate-100 rounded-xl p-4">
            <p className="text-sm text-slate-600">
              <strong>Data Sources:</strong> Information aggregated from teacher community forums, public review platforms, and school websites. Salaries and ratings represent community-reported averages and may vary based on experience, qualifications, and contract terms.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={onClose}
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}