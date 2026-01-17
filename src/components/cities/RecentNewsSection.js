export default function RecentNewsSection({ news }) {
  if (!news || news.length === 0) {
    return null;
  }

  // Sort by date, most recent first
  const sortedNews = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));

  const getCategoryColor = (category) => {
    const colors = {
      'Safety': 'bg-red-100 text-red-700 border-red-200',
      'Government': 'bg-blue-100 text-blue-700 border-blue-200',
      'Economy': 'bg-green-100 text-green-700 border-green-200',
      'Education': 'bg-purple-100 text-purple-700 border-purple-200',
      'Infrastructure': 'bg-orange-100 text-orange-700 border-orange-200',
      'Environment': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'General': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return colors[category] || colors['General'];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Recent News & Updates</h2>
        <p className="text-slate-600 mb-8">What's been happening lately - curated for teachers</p>
        
        <div className="space-y-6">
          {sortedNews.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
                <span className="text-sm text-slate-500">{formatDate(item.date)}</span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">{item.headline}</h3>
              
              {item.summary && (
                <p className="text-slate-700 mb-3">{item.summary}</p>
              )}
              
              {item.relevance_to_teachers && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Why it matters: </span>
                    {item.relevance_to_teachers}
                  </p>
                </div>
              )}
              
              {item.source_url && (
                <a 
                  href={item.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm font-medium hover:underline inline-flex items-center"
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