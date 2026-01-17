export default function SalaryAnalysis({ data, economic }) {
  if (!data) return null;

  const salaryRanges = [
    { level: 'Entry', amount: data.entry_level, years: '0-2 years' },
    { level: 'Mid', amount: data.mid_level, years: '3-7 years' },
    { level: 'Senior', amount: data.senior_level, years: '8+ years' }
  ];

  // Calculate percentages for visual bars
  const maxSalary = Math.max(data.entry_level || 0, data.mid_level || 0, data.senior_level || 0);

  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header - Bold & Asymmetric */}
        <div className="mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-white/10 text-white/60 text-xs uppercase tracking-widest font-medium">
              Financial Data
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            What You'll<br/>Actually Make
          </h2>
          <p className="text-xl text-white/60 max-w-2xl">
            Real salary ranges for international teachers. Based on {data.sample_size || 'actual'} teacher reports.
          </p>
        </div>

        {/* Salary Bars - Visual & Bold */}
        <div className="space-y-8 mb-20">
          {salaryRanges.map((range, index) => {
            if (!range.amount) return null;
            const percentage = (range.amount / maxSalary) * 100;
            
            return (
              <div key={index} className="group">
                {/* Label Row */}
                <div className="flex justify-between items-baseline mb-3">
                  <div>
                    <span className="text-2xl font-bold">{range.level} Level</span>
                    <span className="ml-4 text-white/40 text-sm">{range.years}</span>
                  </div>
                  <span className="text-4xl font-black tabular-nums">
                    ${range.amount.toLocaleString()}
                  </span>
                </div>
                
                {/* Visual Bar */}
                <div className="h-3 bg-white/10 relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Economic Context - Side by Side */}
        {economic && (
          <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-white/10">
            
            {/* GDP Growth */}
            <div>
              <div className="text-white/40 text-sm uppercase tracking-widest mb-3">
                Economic Growth
              </div>
              <div className="flex items-baseline gap-4">
                <span className={`text-6xl font-black tabular-nums ${
                  economic.gdp_growth > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {economic.gdp_growth > 0 ? '+' : ''}{economic.gdp_growth}%
                </span>
                <span className="text-white/60">GDP Growth</span>
              </div>
              <p className="mt-3 text-white/60 text-sm">
                {economic.gdp_growth > 3 ? '🟢 Strong growth - schools hiring' : 
                 economic.gdp_growth > 0 ? '🟡 Moderate growth - stable jobs' : 
                 '🔴 Economic contraction - caution'}
              </p>
            </div>

            {/* Inflation */}
            <div>
              <div className="text-white/40 text-sm uppercase tracking-widest mb-3">
                Cost of Living
              </div>
              <div className="flex items-baseline gap-4">
                <span className={`text-6xl font-black tabular-nums ${
                  economic.inflation < 5 ? 'text-green-400' : 
                  economic.inflation < 10 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {economic.inflation}%
                </span>
                <span className="text-white/60">Inflation</span>
              </div>
              <p className="mt-3 text-white/60 text-sm">
                {economic.inflation < 5 ? '🟢 Low inflation - your salary keeps value' : 
                 economic.inflation < 10 ? '🟡 Moderate - negotiate annual raises' : 
                 '🔴 High inflation - purchasing power eroding'}
              </p>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}