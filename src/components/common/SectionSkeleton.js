export default function SectionSkeleton({ title, rows = 3 }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        {/* Section title skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-slate-100 rounded animate-pulse"></div>
        </div>

        {/* Content rows skeleton */}
        <div className="space-y-6">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }, (_, j) => (
                  <div key={j} className="h-24 bg-slate-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}