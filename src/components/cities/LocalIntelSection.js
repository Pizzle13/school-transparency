export default function LocalIntelSection({ intelData, cityName }) {
  if (!intelData || intelData.length === 0) {
    return null;
  }

  // Group tips by category
  const groupedData = intelData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Category emoji mapping
  const categoryIcons = {
    'Restaurants & Food': '🍽️',
    'Apartment Hunting': '🏠',
    'Transportation': '🚗',
    'Shopping': '🛒',
    'Safety & Avoiding Scams': '🛡️',
    'Social Life': '🎉',
    'Other': '💡'
  };

  // Get most recent update date
  const latestUpdate = intelData.reduce((latest, item) => {
    const itemDate = new Date(item.last_updated);
    return itemDate > latest ? itemDate : latest;
  }, new Date(0));

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const totalContributions = intelData.reduce((sum, item) => sum + (item.contributor_count || 0), 0);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Local Intel</h2>
        <p className="text-slate-600 mb-6">Tips from teachers on the ground</p>

        {/* Disclaimer Box */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-yellow-900 mb-3 flex items-center">
            <span className="text-2xl mr-2">⚠️</span>
            Read This First
          </h3>
          <div className="text-sm text-yellow-900 space-y-2">
            <p>This section contains tips from teachers currently living in {cityName}. Updates are AI-curated from verified submissions.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Not professional advice - do your own research</li>
              <li>Quality varies - some tips are gold, some are opinions</li>
              <li>Recency matters - check the "Last Updated" date</li>
              <li>Want to contribute? Email required (no spam, just verification)</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-yellow-300 flex flex-wrap gap-4 items-center">
              <span className="font-semibold">Last Updated: {formatDate(latestUpdate)}</span>
              <span className="text-yellow-700">|</span>
              <span>Based on {totalContributions} archived contributions</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {Object.entries(groupedData).map(([category, tips]) => (
            <div key={category}>
              <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <span className="text-3xl mr-3">{categoryIcons[category] || '💡'}</span>
                {category}
              </h3>
              <div className="space-y-4">
                {tips.map(tip => (
                  <div key={tip.id} className="bg-slate-50 border border-slate-200 rounded-lg p-5 hover:border-blue-500 transition-colors">
                    <p className="text-slate-800 leading-relaxed mb-2">{tip.tip_text}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {tip.contributor_count} {tip.contributor_count === 1 ? 'teacher' : 'teachers'} mentioned this
                      </span>
                      {tip.source === 'archived' && (
                        <span className="text-xs text-slate-400">• Compiled from online forums</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contribution CTA */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-blue-900 mb-3">Have fresher intel?</h3>
          <p className="text-blue-800 mb-6">Help other teachers by sharing your on-the-ground experience</p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Submit Your Tip (Coming Soon)
          </button>
        </div>
      </div>
    </section>
  );
}