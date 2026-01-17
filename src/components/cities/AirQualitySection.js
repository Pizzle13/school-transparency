export default function AirQualitySection({ data, cityName }) {
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
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-800 mb-8">
          Air Quality in {cityName}
        </h2>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sortedData.map((month) => (
              <div key={month.month} className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-sm font-semibold text-slate-600 mb-2">
                  {month.month}
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-2">
                  {month.aqi}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor(month.status)}`}>
                  {month.status}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-sm text-slate-600">
            <p className="font-semibold mb-2">AQI Scale:</p>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                0-50 Good
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                51-100 Moderate
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                101-150 Unhealthy for Sensitive
              </span>
              <span className="flex items-center gap-2">
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