export default function HousingResources({ areas, websites, cityName }) {
  if (!areas && !websites) return null;

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header - Bold Retroverse Style */}
        <div className="mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              Living Resources
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-6 text-stone-900">
            Housing in {cityName}
          </h2>
        </div>

        {/* Housing Areas */}
        {areas && areas.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-stone-900 mb-8">Popular Areas</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {areas.map((area) => (
                <div key={area.id} className="bg-white p-6 rounded-xl border-2 border-stone-200 hover:border-orange-500 transition-all duration-300">
                  <h4 className="text-xl font-bold text-stone-900 mb-2">{area.district}</h4>
                  <p className="text-sm text-stone-500 mb-4">{area.type}</p>
                  <div className="mb-4">
                    <p className="text-2xl font-black text-orange-600">
                      ${area.rent_min} - ${area.rent_max}/month
                    </p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-bold text-green-600 mb-1">Pros:</p>
                      <p className="text-stone-600">{area.pros}</p>
                    </div>
                    <div>
                      <p className="font-bold text-red-600 mb-1">Cons:</p>
                      <p className="text-stone-600">{area.cons}</p>
                    </div>
                  </div>
                  {area.teacher_rating && (
                    <div className="mt-4 pt-4 border-t border-stone-200">
                      <p className="text-sm text-stone-600">
                        Teacher Rating: {area.teacher_rating}/5 ⭐
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Housing Websites */}
        {websites && websites.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold text-stone-900 mb-8">Where to Search</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {websites.map((site) => (
                <div key={site.id} className="bg-white p-6 rounded-xl border-2 border-stone-200 hover:border-orange-500 transition-all duration-300">
                  <h4 className="text-lg font-bold text-stone-900 mb-2">{site.name}</h4>
                  <p className="text-sm text-stone-600 mb-4">{site.description}</p>
                  {site.type && (
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-xs rounded-full mb-4 font-semibold">
                      {site.type}
                    </span>
                  )}
                  {site.url && (
                    <a 
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-500 text-sm font-bold transition-colors"
                    >
                      Visit Site →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}