import Link from 'next/link';

export default function CityCard({ city }) {
  const CardWrapper = city.comingSoon ? 'div' : Link;
  const wrapperProps = city.comingSoon ? {} : { href: `/cities/${city.slug}` };

  return (
    <CardWrapper {...wrapperProps}>
      <div className="relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${city.image})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Coming Soon Badge */}
        {city.comingSoon && (
          <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            Coming Soon
          </div>
        )}

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
          <p className="text-slate-300 mb-4">{city.country}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Avg Salary</p>
              <p className="text-white font-semibold text-sm">{city.stats.avgSalary}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Cost of Living</p>
              <p className="text-white font-semibold text-sm">{city.stats.costOfLiving}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Schools</p>
              <p className="text-white font-semibold text-sm">{city.stats.schoolCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Sentiment</p>
              <p className="text-white font-semibold text-sm">{city.stats.sentiment}</p>
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
