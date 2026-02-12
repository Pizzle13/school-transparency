export default function CityHero({ city }) {
  const salary = city.salary_data?.[0];
  const economic = city.economic_data?.[0];

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background Image - Full Bleed */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${city.hero_image_url})` }}
      />
      
      {/* Strong Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

      {/* Content - Left Aligned, Bottom Positioned */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
        
        {/* Country Label */}
        <div className="mb-4">
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium tracking-wide">
            {city.country}
          </span>
        </div>

        {/* HUGE City Name */}
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white mb-8 tracking-tight leading-none">
          {city.name}
        </h1>

        {/* Minimal Stats Bar - Clean Horizontal Layout */}
        <div className="flex flex-wrap gap-8 text-white">
          
          {/* Avg Salary */}
          {salary?.avg_salary && (
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold">
                ${Math.round(salary.avg_salary / 1000)}K
              </span>
              <span className="text-white/60 text-sm uppercase tracking-wider">
                Avg Salary
              </span>
            </div>
          )}

          {/* Divider */}
          {salary?.avg_salary && economic?.gdp_growth && (
            <div className="w-px h-12 bg-white/20" />
          )}

          {/* GDP Growth */}
          {economic?.gdp_growth && (
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-bold ${
                economic.gdp_growth > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {economic.gdp_growth > 0 ? '+' : ''}{economic.gdp_growth}%
              </span>
              <span className="text-white/60 text-sm uppercase tracking-wider">
                GDP Growth
              </span>
            </div>
          )}

          {/* Divider */}
          {economic?.gdp_growth && economic?.inflation && (
            <div className="w-px h-12 bg-white/20" />
          )}

          {/* Inflation */}
          {economic?.inflation && (
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-bold ${
                economic.inflation < 5 ? 'text-green-400' : 
                economic.inflation < 10 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {economic.inflation}%
              </span>
              <span className="text-white/60 text-sm uppercase tracking-wider">
                Inflation
              </span>
            </div>
          )}

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}