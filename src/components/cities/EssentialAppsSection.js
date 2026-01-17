export default function EssentialAppsSection({ apps }) {
  if (!apps || apps.length === 0) {
    return null;
  }

  const transportApps = apps.filter(app => app.type === 'Transport');
  const foodApps = apps.filter(app => app.type === 'Food');

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header - Bold Retroverse Style */}
        <div className="mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              Digital Tools
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-6 text-stone-900">
            Essential Apps
          </h2>
        </div>
        
        {/* Transport Apps */}
        {transportApps.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-stone-900 mb-8">🚗 Transport</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {transportApps.map(app => (
                <div key={app.id} className="bg-stone-50 border-2 border-stone-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-300">
                  <h4 className="text-xl font-bold text-stone-900 mb-2">{app.name}</h4>
                  <p className="text-sm text-stone-600 mb-4">{app.description}</p>
                  {app.url && (
                    <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 text-sm font-bold hover:text-orange-500 transition-colors">
                      Learn more →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Food Apps */}
        {foodApps.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold text-stone-900 mb-8">🍽️ Food Delivery</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {foodApps.map(app => (
                <div key={app.id} className="bg-stone-50 border-2 border-stone-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-300">
                  <h4 className="text-xl font-bold text-stone-900 mb-2">{app.name}</h4>
                  <p className="text-sm text-stone-600 mb-4">{app.description}</p>
                  {app.url && (
                    <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 text-sm font-bold hover:text-orange-500 transition-colors">
                      Learn more →
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