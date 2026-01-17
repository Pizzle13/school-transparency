export default function HealthcareSection({ hospitals, emergencyNumbers }) {
  if ((!hospitals || hospitals.length === 0) && !emergencyNumbers) {
    return null;
  }

  return (
    <section className="py-24 bg-orange-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header - Bold Retroverse Style */}
        <div className="mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              Health Resources
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-4 text-stone-900">
            Healthcare & Emergency
          </h2>
          <p className="text-xl text-stone-600">English-speaking medical facilities and emergency contacts</p>
        </div>
        
        {/* Emergency Numbers */}
        {emergencyNumbers && (
          <div className="bg-orange-100 border-2 border-orange-600 rounded-xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-orange-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">🚨</span>
              Emergency Numbers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {emergencyNumbers.general && (
                <div className="text-center">
                  <div className="text-sm text-stone-600 mb-2 font-medium">General Emergency</div>
                  <div className="text-3xl font-black text-orange-600">{emergencyNumbers.general}</div>
                </div>
              )}
              {emergencyNumbers.police && (
                <div className="text-center">
                  <div className="text-sm text-stone-600 mb-2 font-medium">Police</div>
                  <div className="text-3xl font-black text-orange-600">{emergencyNumbers.police}</div>
                </div>
              )}
              {emergencyNumbers.ambulance && (
                <div className="text-center">
                  <div className="text-sm text-stone-600 mb-2 font-medium">Ambulance</div>
                  <div className="text-3xl font-black text-orange-600">{emergencyNumbers.ambulance}</div>
                </div>
              )}
              {emergencyNumbers.fire && (
                <div className="text-center">
                  <div className="text-sm text-stone-600 mb-2 font-medium">Fire</div>
                  <div className="text-3xl font-black text-orange-600">{emergencyNumbers.fire}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Hospitals */}
        {hospitals && hospitals.length > 0 && (
          <>
            <h3 className="text-3xl font-bold text-stone-900 mb-8">English-Speaking Hospitals</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map(hospital => (
                <div key={hospital.id} className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-stone-900 text-lg">{hospital.name}</h4>
                    <span className="text-3xl">🏥</span>
                  </div>
                  
                  {hospital.address && (
                    <p className="text-sm text-stone-600 mb-2">
                      📍 {hospital.address}
                    </p>
                  )}
                  
                  {hospital.phone && (
                    <p className="text-sm text-stone-600 mb-3">
                      📞 {hospital.phone}
                    </p>
                  )}
                  
                  {hospital.services && (
                    <div className="mb-4">
                      <span className="inline-block bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full font-semibold">
                        {hospital.services}
                      </span>
                    </div>
                  )}
                  
                  {hospital.notes && (
                    <p className="text-sm text-stone-700 mb-4 border-l-4 border-orange-500 pl-3">
                      {hospital.notes}
                    </p>
                  )}
                  
                  {hospital.website && (
                    <a 
                      href={hospital.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-orange-600 text-sm font-bold hover:text-orange-500 transition-colors"
                    >
                      Visit website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}