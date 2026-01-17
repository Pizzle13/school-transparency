export default function CityHero({ city }) {
  const salary = city.salary_data?.[0];
  const economic = city.economic_data?.[0];

  return (
    <div className="relative h-[60vh]">
      {/* Background Image */}
      {city.hero_image_url && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${city.hero_image_url})` }}
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">{city.name}</h1>
        <p className="text-xl md:text-2xl mb-8">{city.tagline}</p>
        
        <div className="flex gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">
              {salary ? `$${salary.avg_salary.toLocaleString()}` : 'N/A'}
            </div>
            <div className="text-sm">Avg Salary</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {salary ? `$${salary.monthly_savings.toLocaleString()}` : 'N/A'}
            </div>
            <div className="text-sm">Monthly Savings</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {economic ? `${economic.gdp_latest}%` : 'N/A'}
            </div>
            <div className="text-sm">GDP Growth</div>
          </div>
        </div>
      </div>
    </div>
  );
}