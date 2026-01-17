export default function SchoolCard({ school, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:shadow-xl hover:scale-[1.02] hover:border-orange-500 transition-all duration-300 cursor-pointer group"
    >
      {/* School Type Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600">
          {school.type}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-orange-500">★</span>
          <span className="text-sm font-semibold text-stone-900">{school.rating}</span>
        </div>
      </div>

      {/* School Name */}
      <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
        {school.name}
      </h3>

      {/* Quick Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <span>👥</span>
          <span>{school.studentCount} students</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <span>💰</span>
          <span className="font-semibold text-orange-600">{school.salaryRange}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <span>💬</span>
          <span>{school.reviews} community reviews</span>
        </div>
      </div>

      {/* Summary Preview */}
      <p className="text-sm text-stone-600 line-clamp-2 mb-3">
        {school.summary}
      </p>

      {/* Click hint */}
      <div className="text-xs text-orange-600 font-semibold group-hover:text-orange-500 transition-colors">
        Click for full details →
      </div>
    </div>
  );
}