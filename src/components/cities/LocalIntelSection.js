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
    <section className="py-24 bg-orange-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header - Bold Retroverse Style */}
        <div className="mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              Community Wisdom
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-4 text-stone-900">
            Local Intel
          </h2>
          <p className="text-xl text-stone-600">Tips from teachers on the ground</p>
        </div>

        {/* Disclaimer Box */}
        <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-orange-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">⚠️</span>
            Read This First
          </h3>
          <div className="text-sm text-stone-900 space-y-3">
            <p className="text-base">This section contains tips from teachers currently living in {cityName}. Updates are AI-curated from verified submissions.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Not professional advice - do your own research</li>
              <li>Quality varies - some tips are gold, some are opinions</li>
              <li>Recency matters - check the "Last Updated" date</li>
              <li>Want to contribute? Email required (no spam, just verification)</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-orange-300 flex flex-wrap gap-4 items-center">
              <span className="font-bold">Last Updated: {formatDate(latestUpdate)}</span>
              <span className="text-orange-700">|</span>
              <span className="font-medium">Based on {totalContributions} archived contributions</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {Object.entries(groupedData).map(([category, tips]) => (
            <div key={category}>
              <h3 className="text-3xl font-bold text-stone-900 mb-6 flex items-center">
                <span className="text-4xl mr-4">{categoryIcons[category] || '💡'}</span>
                {category}
              </h3>
              <div className="space-y-4">
                {tips.map(tip => (
                  <div key={tip.id} className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-300">
                    <p className="text-stone-800 leading-relaxed mb-3 text-base">{tip.tip_text}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                        {tip.contributor_count} {tip.contributor_count === 1 ? 'teacher' : 'teachers'} mentioned this
                      </span>
                      {tip.source === 'archived' && (
                        <span className="text-xs text-stone-400">• Compiled from online forums</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contribution CTA */}
        <div className="mt-16 bg-white border-2 border-stone-200 rounded-xl p-8 text-center">
          <h3 className="text-3xl font-bold text-stone-900 mb-4">Have fresher intel?</h3>
          <p className="text-stone-600 mb-6 text-lg">Help other teachers by sharing your on-the-ground experience</p>
          <button className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-500 transition-colors text-lg">
            Submit Your Tip (Coming Soon)
          </button>
        </div>
      </div>
    </section>
  );
}