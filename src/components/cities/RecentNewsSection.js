export default function RecentNewsSection({ news }) {
  if (!news || news.length === 0) {
    return null;
  }

  // Sort by date, most recent first
  const sortedNews = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));

  const getCategoryColor = (category) => {
    const colors = {
      'Safety': 'bg-red-100 text-red-700',
      'Government': 'bg-stone-200 text-stone-700',
      'Economy': 'bg-green-100 text-green-700',
      'Education': 'bg-orange-100 text-orange-700',
      'Infrastructure': 'bg-orange-100 text-orange-700',
      'Environment': 'bg-emerald-100 text-emerald-700',
      'General': 'bg-stone-200 text-stone-700'
    };
    return colors[category] || colors['General'];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header - Bold Retroverse Style */}
        <div className="mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              Latest Updates
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-4 text-stone-900">
            Recent News & Updates
          </h2>
          <p className="text-xl text-stone-600">What's been happening lately - curated for teachers</p>
        </div>
        
        <div className="space-y-6">
          {sortedNews.map(item => (
            <div key={item.id} className="bg-stone-50 border-2 border-stone-200 rounded-xl p-8 hover:border-orange-500 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
                <span className="text-sm text-stone-500 font-medium">{formatDate(item.date)}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-stone-900 mb-3">{item.headline}</h3>
              
              {item.summary && (
                <p className="text-stone-700 mb-4 text-lg">{item.summary}</p>
              )}
              
              {item.relevance_to_teachers && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
                  <p className="text-sm text-stone-900">
                    <span className="font-bold">Why it matters: </span>
                    {item.relevance_to_teachers}
                  </p>
                </div>
              )}
              
              {item.source_url && (
                <a 
                  href={item.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-600 text-sm font-bold hover:text-orange-500 transition-colors"
                >
                  Read full article →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}