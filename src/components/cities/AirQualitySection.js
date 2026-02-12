export default function AirQualitySection({ data, cityName, dataYear }) {
  if (!data || data.length === 0) return null;

  // Sort by month order
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const sortedData = [...data].sort((a, b) => 
    monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  );

  const getStatusColor = (status) => {
    if (status.includes('Good')) return 'bg-green-500';
    if (status.includes('Moderate')) return 'bg-yellow-500';
    if (status.includes('Sensitive')) return 'bg-orange-500';
    if (status.includes('Unhealthy')) return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <section className="py-24 bg-orange-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header - Bold Retroverse Style */}
        <div className="mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              Environmental Data
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-6 text-stone-900">
            Air Quality in {cityName}
          </h2>
          {dataYear && (
            <p className="text-lg text-stone-500">
              Monthly estimates based on {dataYear} IQAir data
            </p>
          )}
        </div>
        
        {/* Monthly AQI Grid */}
        <div className="bg-white rounded-2xl p-8 border border-stone-200">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sortedData.map((month) => (
              <div key={month.month} className="text-center p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-sm font-semibold text-stone-600 mb-2">
                  {month.month}
                </div>
                <div className="text-2xl font-bold text-stone-900 mb-2">
                  {month.aqi}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor(month.status)}`}>
                  {month.status}
                </div>
              </div>
            ))}
          </div>
          
          {/* AQI Scale Legend */}
          <div className="mt-8 pt-6 border-t border-stone-200">
            <p className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">AQI Scale:</p>
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-2 text-sm text-stone-600">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                0-50 Good
              </span>
              <span className="flex items-center gap-2 text-sm text-stone-600">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                51-100 Moderate
              </span>
              <span className="flex items-center gap-2 text-sm text-stone-600">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                101-150 Unhealthy for Sensitive
              </span>
              <span className="flex items-center gap-2 text-sm text-stone-600">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                151+ Unhealthy
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}