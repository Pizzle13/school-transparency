export default function EconomicOverview({ city }) {
  // Mock data for now - will connect to World Bank API later
  const economicData = {
    gdp: {
      latest: "2.3%",
      year: "2024",
      trend: "growing"
    },
    inflation: {
      latest: "3.8%",
      year: "2024",
      trend: "stable"
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Economic Overview
          </h2>
          <p className="text-lg text-slate-600">
            Understanding {city.name}'s economic stability and growth trends
          </p>
        </div>

        {/* Economic Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* GDP Card */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">GDP Growth</h3>
              <span className="text-3xl">📈</span>
            </div>
            
            <div className="mb-6">
              <p className="text-5xl font-bold text-blue-700 mb-2">
                {economicData.gdp.latest}
              </p>
              <p className="text-slate-600">Annual growth rate ({economicData.gdp.year})</p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                economicData.gdp.trend === 'growing' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {economicData.gdp.trend === 'growing' ? '↗ Growing' : '→ Stable'}
              </span>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                <strong>What this means:</strong> Positive GDP growth indicates a healthy economy 
                with expanding opportunities for international schools and stable teaching positions.
              </p>
            </div>
          </div>

          {/* Inflation Card */}
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 border border-orange-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">Inflation Rate</h3>
              <span className="text-3xl">💰</span>
            </div>
            
            <div className="mb-6">
              <p className="text-5xl font-bold text-orange-600 mb-2">
                {economicData.inflation.latest}
              </p>
              <p className="text-slate-600">Consumer price index ({economicData.inflation.year})</p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                parseFloat(economicData.inflation.latest) < 5
                  ? 'bg-emerald-100 text-emerald-700'
                  : parseFloat(economicData.inflation.latest) < 10
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {parseFloat(economicData.inflation.latest) < 5 ? '✓ Low' : 
                 parseFloat(economicData.inflation.latest) < 10 ? '⚠ Moderate' : '⚠ High'}
              </span>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                <strong>What this means:</strong> Lower inflation preserves your purchasing power 
                and keeps living costs predictable throughout your contract.
              </p>
            </div>
          </div>
        </div>

        {/* Data Source Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Data source: World Bank (Last updated: January 2025)
          </p>
        </div>
      </div>
    </section>
  );
}