import Link from 'next/link';

export default function CityCard({ city }) {
  const CardWrapper = city.comingSoon ? 'div' : Link;
  const wrapperProps = city.comingSoon ? {} : { href: `/cities/${city.slug}` };

  // Handle both old JSON format (city.stats) and new Supabase format (flat)
  const avgSalary = city.stats?.avgSalary || (city.hero_image_url ? 'Loading...' : 'N/A');
  const schoolCount = city.stats?.schoolCount || 'N/A';
  const image = city.image || city.hero_image_url || '/images/cities/placeholder.jpg';

  return (
    <CardWrapper {...wrapperProps}>
      <div className="relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Coming Soon Badge */}
        {city.comingSoon && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            Coming Soon
          </div>
        )}

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
          <p className="text-slate-300 mb-4">{city.country}</p>

          {/* Stats Grid - Only showing what we have */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-blue-400/20">
              <p className="text-slate-300 text-xs mb-1">Avg Salary</p>
              <p className="text-white font-semibold text-sm">{avgSalary}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-blue-400/20">
              <p className="text-slate-300 text-xs mb-1">Schools</p>
              <p className="text-white font-semibold text-sm">{schoolCount}</p>
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}