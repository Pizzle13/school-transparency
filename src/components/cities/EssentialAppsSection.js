const CATEGORY_CONFIG = {
  'Transport': { emoji: '🚗', label: 'Transport' },
  'Food': { emoji: '🍽️', label: 'Food Delivery' },
  'Messaging': { emoji: '💬', label: 'Messaging' },
  'Payments': { emoji: '💳', label: 'Mobile Payments' },
};

export default function EssentialAppsSection({ apps }) {
  if (!apps || apps.length === 0) {
    return null;
  }

  // Group apps by type, preserving insertion order
  const grouped = {};
  apps.forEach(app => {
    const type = app.type || 'Other';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(app);
  });

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
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

        {Object.entries(grouped).map(([type, typeApps], idx) => {
          const config = CATEGORY_CONFIG[type] || { emoji: '📱', label: type };
          return (
            <div key={type} className={idx < Object.keys(grouped).length - 1 ? 'mb-16' : ''}>
              <h3 className="text-3xl font-bold text-stone-900 mb-8">{config.emoji} {config.label}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {typeApps.map(app => (
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
          );
        })}
      </div>
    </section>
  );
}