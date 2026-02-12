export default function HousingResources({ areas, websites, cityName }) {
  if (!areas && !websites) return null;

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Popular Areas - Split Layout */}
        {areas && areas.length > 0 && (
          <div className="mb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              
              {/* Left: Header & Description */}
              <div className="lg:sticky lg:top-24">
                <div className="inline-block mb-4">
                  <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
                    Living Resources
                  </span>
                </div>
                <h2 className="text-6xl md:text-7xl font-black mb-6 text-stone-900 leading-none">
                  Housing in {cityName}
                </h2>
                <p className="text-xl text-stone-600 mb-8">
                  Real neighborhoods where teachers actually live. Rent ranges, commute times, and honest pros/cons.
                </p>
                
                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-orange-600">{areas.length}</span>
                    <span className="text-lg text-stone-600">Popular districts</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-orange-600">${Math.min(...areas.filter(a => a.rent_min != null).map(a => a.rent_min)) || 'N/A'}</span>
                    <span className="text-lg text-stone-600">Starting rent/month</span>
                  </div>
                </div>
              </div>

              {/* Right: Stacked Area Cards */}
              <div className="space-y-6">
                {areas.map((area, index) => (
                  <div 
                    key={area.id} 
                    className="bg-white border-4 border-stone-900 rounded-2xl p-6 hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                    style={{ 
                      transform: `rotate(${index % 2 === 0 ? '-1deg' : '1deg'})` 
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-2xl font-black text-stone-900">{area.district}</h4>
                        <p className="text-sm text-stone-500 font-medium">{area.type}</p>
                      </div>
                      {area.teacher_rating && (
                        <div className="text-right">
                          <div className="text-2xl font-black text-orange-600">{area.teacher_rating}/5</div>
                          <div className="text-xs text-stone-500">⭐ Teachers</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-3xl font-black text-orange-600">
                        ${area.rent_min} - ${area.rent_max}
                      </p>
                      <p className="text-xs text-stone-500 font-medium">per month</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-bold text-green-600 mb-1 flex items-center gap-1">
                          <span>✓</span> Pros
                        </p>
                        <p className="text-stone-700">{area.pros}</p>
                      </div>
                      <div>
                        <p className="font-bold text-red-600 mb-1 flex items-center gap-1">
                          <span>✗</span> Cons
                        </p>
                        <p className="text-stone-700">{area.cons}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Housing Websites - Grid */}
        {websites && websites.length > 0 && (
          <div>
            <h3 className="text-4xl font-black text-stone-900 mb-8">Where to Search</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {websites.map((site, index) => {
                const colors = [
                  'bg-purple-100 border-purple-300',
                  'bg-lime-200 border-lime-400',
                  'bg-sky-100 border-sky-300'
                ];
                
                return (
                  <div 
                    key={site.id} 
                    className={`${colors[index % colors.length]} border-4 rounded-2xl p-6 hover:scale-105 transition-all duration-300`}
                  >
                    <div className="mb-4">
                      <h4 className="text-xl font-black text-stone-900 mb-2">{site.name}</h4>
                      {site.type && (
                        <span className="inline-block px-3 py-1 bg-white border-2 border-stone-900 text-xs rounded-full font-bold">
                          {site.type}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-stone-700 mb-4">{site.description}</p>
                    
                    {site.url && (
                      <a 
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-stone-900 hover:text-orange-600 transition-colors"
                      >
                        Visit Site 
                        <span className="text-orange-600">→</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}