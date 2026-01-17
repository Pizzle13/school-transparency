export default function EssentialAppsSection({ apps }) {
  if (!apps || apps.length === 0) {
    return null;
  }

  const transportApps = apps.filter(app => app.type === 'Transport');
  const foodApps = apps.filter(app => app.type === 'Food');

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Essential Apps</h2>
        
        {/* Transport Apps */}
        {transportApps.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">🚗 Transport</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {transportApps.map(app => (
                <div key={app.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <h4 className="font-semibold text-slate-800">{app.name}</h4>
                  <p className="text-sm text-slate-600 mt-1">{app.description}</p>
                  {app.url && (
                    <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
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
            <h3 className="text-xl font-semibold text-orange-500 mb-4">🍽️ Food Delivery</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {foodApps.map(app => (
                <div key={app.id} className="border border-slate-200 rounded-lg p-4 hover:border-orange-500 transition-colors">
                  <h4 className="font-semibold text-slate-800">{app.name}</h4>
                  <p className="text-sm text-slate-600 mt-1">{app.description}</p>
                  {app.url && (
                    <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-orange-500 text-sm mt-2 inline-block hover:underline">
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