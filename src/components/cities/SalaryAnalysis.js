'use client'

export default function SalaryAnalysis({ data, economic, schools }) {
  if (!data) return null;

  // Compute salary range from school-level data using 10th/90th percentile to filter outliers
  const schoolList = schools || [];
  const allMins = schoolList.map(s => s.salary_min).filter(Boolean).sort((a, b) => a - b);
  const allMaxes = schoolList.map(s => s.salary_max).filter(Boolean).sort((a, b) => a - b);
  const percentile = (arr, p) => arr[Math.max(0, Math.ceil(arr.length * p) - 1)];
  const salaryLow = allMins.length >= 3 ? percentile(allMins, 0.1) : (allMins[0] || null);
  const salaryHigh = allMaxes.length >= 3 ? percentile(allMaxes, 0.9) : (allMaxes[allMaxes.length - 1] || null);

  // Role-based salary data (populated by teacher submissions over time)
  const roleCards = [
    {
      label: 'Classroom Teacher',
      value: data.entry_level,
      bgClass: 'bg-blue-50',
      borderClass: 'border-blue-500',
      textClass: 'text-blue-600',
    },
    {
      label: 'Teacher Leader',
      value: data.mid_level,
      bgClass: 'bg-purple-50',
      borderClass: 'border-purple-500',
      textClass: 'text-purple-600',
    },
    {
      label: 'Senior Leadership',
      value: data.senior_level,
      bgClass: 'bg-orange-50',
      borderClass: 'border-orange-500',
      textClass: 'text-orange-600',
    },
  ];

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header - Bold & Asymmetric */}
        <div className="mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              Financial Data
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-6 text-stone-900">
            What You'll<br/>Actually Make
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl">
            Financial snapshot for international teachers in this city.
          </p>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">

          {/* Typical Salary Range */}
          <div className="bg-white p-8 border-4 border-stone-900">
            <div className="text-stone-400 text-sm uppercase tracking-widest mb-3">
              Typical Salary Range
            </div>
            {salaryLow && salaryHigh ? (
              <>
                <div className="text-5xl font-black tabular-nums text-stone-900 mb-2">
                  ${Math.round(salaryLow / 1000)}K&ndash;${Math.round(salaryHigh / 1000)}K
                </div>
                <p className="text-stone-600 text-sm">
                  per year &middot; see individual schools below
                </p>
              </>
            ) : (
              <div className="text-4xl font-black text-stone-400 mb-2">N/A</div>
            )}
          </div>

          {/* Monthly Living Cost */}
          <div className="bg-orange-50 p-8 border-4 border-orange-500">
            <div className="text-orange-600 text-sm uppercase tracking-widest mb-3">
              Living Costs
            </div>
            <div className="text-6xl font-black tabular-nums text-stone-900 mb-2">
              ${data.monthly_cost?.toLocaleString() || 'N/A'}
            </div>
            <p className="text-stone-600 text-sm">per month</p>
          </div>

          {/* Schools Reporting */}
          <div className="bg-green-50 p-8 border-4 border-green-600">
            <div className="text-green-600 text-sm uppercase tracking-widest mb-3">
              Schools Listed
            </div>
            <div className="text-6xl font-black tabular-nums text-stone-900 mb-2">
              {schoolList.length}
            </div>
            <p className="text-stone-600 text-sm">
              {allMins.length} reporting salary data
            </p>
          </div>

        </div>

        {/* Salary by Role Breakdown */}
        <div className="mb-20">
          <div className="text-stone-400 text-sm uppercase tracking-widest mb-6">
            Salary by Role
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {roleCards.map(({ label, value, bgClass, borderClass, textClass }) => (
              <div key={label} className={`${bgClass} p-6 border-4 ${borderClass} rounded-xl`}>
                <div className={`${textClass} text-xs uppercase tracking-widest font-medium mb-3`}>
                  {label}
                </div>
                {value ? (
                  <>
                    <div className="text-3xl font-black text-stone-900 mb-1">
                      ${Math.round(value / 1000)}K
                    </div>
                    <p className="text-stone-600 text-sm">avg per year</p>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-bold text-stone-400 mb-1">
                      No reports yet
                    </div>
                    <p className="text-stone-500 text-sm">
                      Be the first to share your salary
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>


        {/* Economic Context - Side by Side */}
        {economic && (
          <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-stone-200">

            {/* GDP Growth */}
            <div>
              <div className="text-stone-400 text-sm uppercase tracking-widest mb-3">
                Economic Growth
              </div>
              <div className="flex items-baseline gap-4">
                <span className={`text-6xl font-black tabular-nums ${
                  economic.gdp_latest > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {economic.gdp_latest > 0 ? '+' : ''}{economic.gdp_latest}%
                </span>
                <span className="text-stone-600">GDP Growth</span>
              </div>
              <p className="mt-3 text-stone-600 text-sm">
                {economic.gdp_latest > 3 ? '🟢 Strong growth - schools hiring' :
                 economic.gdp_latest > 0 ? '🟡 Moderate growth - stable jobs' :
                 '🔴 Economic contraction - caution'}
              </p>
            </div>

            {/* Inflation */}
            <div>
              <div className="text-stone-400 text-sm uppercase tracking-widest mb-3">
                Cost of Living
              </div>
              <div className="flex items-baseline gap-4">
                <span className={`text-6xl font-black tabular-nums ${
                  economic.inflation_latest < 5 ? 'text-green-600' :
                  economic.inflation_latest < 10 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {economic.inflation_latest}%
                </span>
                <span className="text-stone-600">Inflation</span>
              </div>
              <p className="mt-3 text-stone-600 text-sm">
                {economic.inflation_latest < 5 ? '🟢 Low inflation - your salary keeps value' :
                 economic.inflation_latest < 10 ? '🟡 Moderate - negotiate annual raises' :
                 '🔴 High inflation - purchasing power eroding'}
              </p>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
