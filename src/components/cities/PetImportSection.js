export default function PetImportSection({ petImport }) {
  if (!petImport) {
    return null;
  }

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header - Bold Retroverse Style */}
        <div className="mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              Pet Travel
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-4 text-stone-900">
            Pet Import Guide
          </h2>
          <p className="text-xl text-stone-600">Bringing your furry friends along</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Requirements */}
          <div className="space-y-6">
            {/* Quarantine Info */}
            <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
              <h3 className="font-bold text-stone-900 mb-4 flex items-center text-xl">
                <span className="text-3xl mr-3">🏠</span>
                Quarantine Requirements
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="font-semibold text-stone-700 min-w-[120px]">Required:</span>
                  <span className={`font-bold ${petImport.quarantine_required ? 'text-orange-600' : 'text-green-600'}`}>
                    {petImport.quarantine_required ? 'Yes' : 'No'}
                  </span>
                </div>
                {petImport.quarantine_duration && (
                  <div className="flex items-start">
                    <span className="font-semibold text-stone-700 min-w-[120px]">Duration:</span>
                    <span className="text-stone-900">{petImport.quarantine_duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Required Documents */}
            {petImport.required_documents && petImport.required_documents.length > 0 && (
              <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
                <h3 className="font-bold text-stone-900 mb-4 flex items-center text-xl">
                  <span className="text-3xl mr-3">📄</span>
                  Required Documents
                </h3>
                <ul className="space-y-2">
                  {petImport.required_documents.map((doc, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-600 mr-2 font-bold">✓</span>
                      <span className="text-stone-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vaccinations */}
            {petImport.vaccination_requirements && (
              <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
                <h3 className="font-bold text-stone-900 mb-4 flex items-center text-xl">
                  <span className="text-3xl mr-3">💉</span>
                  Vaccination Requirements
                </h3>
                <p className="text-stone-700">{petImport.vaccination_requirements}</p>
              </div>
            )}
          </div>

          {/* Right Column - Costs & Timeline */}
          <div className="space-y-6">
            {/* Cost Estimate */}
            {petImport.cost_estimate && (
              <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
                <h3 className="font-bold text-stone-900 mb-4 flex items-center text-xl">
                  <span className="text-3xl mr-3">💰</span>
                  Estimated Costs
                </h3>
                <p className="text-3xl font-black text-orange-600">{petImport.cost_estimate}</p>
              </div>
            )}

            {/* Processing Time */}
            {petImport.processing_time && (
              <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
                <h3 className="font-bold text-stone-900 mb-4 flex items-center text-xl">
                  <span className="text-3xl mr-3">⏱️</span>
                  Processing Time
                </h3>
                <p className="text-stone-700">{petImport.processing_time}</p>
              </div>
            )}

            {/* Important Notes */}
            {petImport.notes && (
              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="font-bold text-orange-900 mb-4 flex items-center text-xl">
                  <span className="text-3xl mr-3">⚠️</span>
                  Important Notes
                </h3>
                <p className="text-stone-700">{petImport.notes}</p>
              </div>
            )}

            {/* Official Resource */}
            {petImport.official_resource_url && (
              <a 
                href={petImport.official_resource_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-orange-600 text-white text-center py-4 px-6 rounded-xl font-bold hover:bg-orange-500 transition-colors text-lg"
              >
                View Official Guidelines →
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}