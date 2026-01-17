'use client'

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

  // Rotating card colors
  const cardColors = [
    'bg-purple-100 border-purple-300',
    'bg-lime-200 border-lime-400',
    'bg-sky-100 border-sky-300',
    'bg-orange-100 border-orange-300',
    'bg-pink-100 border-pink-300',
    'bg-yellow-100 border-yellow-300'
  ];

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
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              Community Wisdom
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-4 text-stone-900">
            Local Intel
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Real advice from teachers living in {cityName}. No BS, just honest experiences.
          </p>
        </div>

        {/* Disclaimer Box */}
        <div className="bg-orange-100 border-4 border-orange-600 rounded-2xl p-8 mb-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-black text-stone-900 mb-4 flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            Read This First
          </h3>
          <div className="text-sm text-stone-900 space-y-3">
            <p className="text-base font-medium">AI-curated tips from verified teacher submissions. Quality varies—some are gold, some are just opinions.</p>
            <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t-2 border-orange-600">
              <div>
                <span className="font-black text-2xl text-orange-600">{totalContributions}</span>
                <span className="text-xs text-stone-600 ml-2">contributions</span>
              </div>
              <div>
                <span className="font-black text-2xl text-orange-600">{formatDate(latestUpdate)}</span>
                <span className="text-xs text-stone-600 ml-2">last updated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories with Testimonial-Style Cards */}
        <div className="space-y-20">
          {Object.entries(groupedData).map(([category, tips]) => (
            <div key={category}>
              <h3 className="text-4xl font-black text-stone-900 mb-8 flex items-center gap-3">
                <span className="text-5xl">{categoryIcons[category] || '💡'}</span>
                {category}
              </h3>
              
              {/* Horizontal Scroll Container */}
              <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                {tips.map((tip, index) => (
                  <div 
                    key={tip.id}
                    className="flex-shrink-0 w-[400px] snap-center"
                  >
                    <div 
                      className={`${cardColors[index % cardColors.length]} border-4 rounded-2xl p-6 h-full hover:scale-105 hover:shadow-2xl transition-all duration-300`}
                    >
                      {/* Quotation marks */}
                      <div className="text-6xl font-black text-stone-900 opacity-20 leading-none mb-2">"</div>
                      
                      {/* Tip Text */}
                      <p className="text-stone-900 text-base leading-relaxed mb-6 font-medium">
                        {tip.tip_text}
                      </p>
                      
                      {/* Attribution */}
                      <div className="pt-4 border-t-2 border-stone-900">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white border-2 border-stone-900 rounded-full flex items-center justify-center text-2xl">
                            👤
                          </div>
                          <div>
                            <div className="font-black text-stone-900">
                              {tip.contributor_count} {tip.contributor_count === 1 ? 'Teacher' : 'Teachers'}
                            </div>
                            <div className="text-xs text-stone-600">
                              {tip.source === 'archived' && 'Compiled from forums'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mobile hint */}
              <div className="text-center mt-4 text-sm text-stone-400 md:hidden">
                ← Swipe for more tips →
              </div>
            </div>
          ))}
        </div>

        {/* Contribution CTA */}
        <div className="mt-20 bg-white border-4 border-stone-900 rounded-2xl p-12 text-center hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
          <h3 className="text-4xl font-black text-stone-900 mb-4">Got Fresh Intel?</h3>
          <p className="text-stone-600 mb-8 text-lg max-w-xl mx-auto">
            Share your on-the-ground experience and help other teachers make smarter decisions.
          </p>
          <button className="bg-orange-600 text-white px-10 py-5 rounded-xl font-black hover:bg-orange-500 transition-colors text-lg border-4 border-stone-900 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            Submit Your Tip (Coming Soon)
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}