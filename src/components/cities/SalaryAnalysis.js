'use client'

export default function SalaryAnalysis({ data, economic }) {
  if (!data) return null;

  // Derive monthly salary from the monthly figures (monthly_cost + monthly_savings)
  // avg_salary in the DB is annual; monthly_cost and monthly_savings are monthly
  const monthlySalary = (data.monthly_cost && data.monthly_savings)
    ? data.monthly_cost + data.monthly_savings
    : (data.avg_salary ? Math.round(data.avg_salary / 12) : null);

  const costPct = monthlySalary ? ((data.monthly_cost / monthlySalary) * 100) : 0;
  const savingsPct = monthlySalary ? ((data.monthly_savings / monthlySalary) * 100) : 0;

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

          {/* Monthly Salary */}
          <div className="bg-white p-8 border-4 border-stone-900">
            <div className="text-stone-400 text-sm uppercase tracking-widest mb-3">
              Monthly Salary
            </div>
            <div className="text-6xl font-black tabular-nums text-stone-900 mb-2">
              ${monthlySalary?.toLocaleString() || 'N/A'}
            </div>
            <p className="text-stone-600 text-sm">
              per month{data.avg_salary ? ` ($${Math.round(data.avg_salary).toLocaleString()}/yr)` : ''}
            </p>
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

          {/* Monthly Savings */}
          <div className="bg-green-50 p-8 border-4 border-green-600">
            <div className="text-green-600 text-sm uppercase tracking-widest mb-3">
              Potential Savings
            </div>
            <div className="text-6xl font-black tabular-nums text-stone-900 mb-2">
              ${data.monthly_savings?.toLocaleString() || 'N/A'}
            </div>
            <p className="text-stone-600 text-sm">per month</p>
          </div>

        </div>

        {/* Savings Visual Bar */}
        {monthlySalary && data.monthly_cost && (
          <div className="mb-20">
            <div className="text-stone-400 text-sm uppercase tracking-widest mb-4">
              Income Breakdown
            </div>
            <div className="h-16 bg-stone-200 flex overflow-hidden">
              <div
                className="bg-orange-500 flex items-center justify-center text-white font-bold"
                style={{ width: `${costPct}%` }}
              >
                Living Costs
              </div>
              <div
                className="bg-green-600 flex items-center justify-center text-white font-bold"
                style={{ width: `${savingsPct}%` }}
              >
                Savings
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-stone-600">
              <span>{costPct.toFixed(0)}% expenses</span>
              <span>{savingsPct.toFixed(0)}% savings</span>
            </div>
          </div>
        )}

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