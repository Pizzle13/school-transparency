export default function HealthcareSection({ hospitals, emergencyNumbers }) {
  if ((!hospitals || hospitals.length === 0) && !emergencyNumbers) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Healthcare & Emergency</h2>
        <p className="text-slate-600 mb-8">English-speaking medical facilities and emergency contacts</p>
        
        {/* Emergency Numbers */}
        {emergencyNumbers && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">🚨</span>
              Emergency Numbers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {emergencyNumbers.general && (
                <div className="text-center">
                  <div className="text-sm text-slate-600 mb-1">General Emergency</div>
                  <div className="text-2xl font-bold text-red-700">{emergencyNumbers.general}</div>
                </div>
              )}
              {emergencyNumbers.police && (
                <div className="text-center">
                  <div className="text-sm text-slate-600 mb-1">Police</div>
                  <div className="text-2xl font-bold text-blue-700">{emergencyNumbers.police}</div>
                </div>
              )}
              {emergencyNumbers.ambulance && (
                <div className="text-center">
                  <div className="text-sm text-slate-600 mb-1">Ambulance</div>
                  <div className="text-2xl font-bold text-green-700">{emergencyNumbers.ambulance}</div>
                </div>
              )}
              {emergencyNumbers.fire && (
                <div className="text-center">
                  <div className="text-sm text-slate-600 mb-1">Fire</div>
                  <div className="text-2xl font-bold text-orange-600">{emergencyNumbers.fire}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Hospitals */}
        {hospitals && hospitals.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">English-Speaking Hospitals</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map(hospital => (
                <div key={hospital.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-slate-800 text-lg">{hospital.name}</h4>
                    <span className="text-2xl">🏥</span>
                  </div>
                  
                  {hospital.address && (
                    <p className="text-sm text-slate-600 mb-2">
                      📍 {hospital.address}
                    </p>
                  )}
                  
                  {hospital.phone && (
                    <p className="text-sm text-slate-600 mb-2">
                      📞 {hospital.phone}
                    </p>
                  )}
                  
                  {hospital.services && (
                    <div className="mb-3">
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                        {hospital.services}
                      </span>
                    </div>
                  )}
                  
                  {hospital.notes && (
                    <p className="text-sm text-slate-700 mb-3 border-l-2 border-blue-500 pl-3">
                      {hospital.notes}
                    </p>
                  )}
                  
                  {hospital.website && (
                    <a 
                      href={hospital.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 text-sm font-medium hover:underline inline-flex items-center"
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