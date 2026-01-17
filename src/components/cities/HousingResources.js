export default function HousingResources({ areas, websites, cityName }) {
  if (!areas && !websites) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-800 mb-8">
          Housing in {cityName}
        </h2>

        {/* Housing Areas */}
        {areas && areas.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Popular Areas</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {areas.map((area) => (
                <div key={area.id} className="bg-slate-50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold mb-2">{area.district}</h4>
                  <p className="text-sm text-slate-600 mb-3">{area.type}</p>
                  <div className="mb-4">
                    <p className="text-lg font-bold text-blue-700">
                      ${area.rent_min} - ${area.rent_max}/month
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-green-700">Pros:</p>
                      <p className="text-slate-600">{area.pros}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-red-600">Cons:</p>
                      <p className="text-slate-600">{area.cons}</p>
                    </div>
                  </div>
                  {area.teacher_rating && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-sm text-slate-600">
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
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Where to Search</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {websites.map((site) => (
                <div key={site.id} className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold mb-2">{site.name}</h4>
                  <p className="text-sm text-slate-600 mb-3">{site.description}</p>
                  {site.type && (
                    <span className="inline-block px-3 py-1 bg-blue-200 text-blue-800 text-xs rounded-full mb-3">
                      {site.type}
                    </span>
                  )}
                  {site.url && (
                    <a 
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline text-sm font-semibold"
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