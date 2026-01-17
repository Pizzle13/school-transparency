export default function PetImportSection({ petImport }) {
  if (!petImport) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Pet Import Guide</h2>
        <p className="text-slate-600 mb-8">Bringing your furry friends along</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Requirements */}
          <div className="space-y-6">
            {/* Quarantine Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">🏠</span>
                Quarantine Requirements
              </h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="font-medium text-slate-700 min-w-[120px]">Required:</span>
                  <span className={`font-semibold ${petImport.quarantine_required ? 'text-orange-600' : 'text-green-600'}`}>
                    {petImport.quarantine_required ? 'Yes' : 'No'}
                  </span>
                </div>
                {petImport.quarantine_duration && (
                  <div className="flex items-start">
                    <span className="font-medium text-slate-700 min-w-[120px]">Duration:</span>
                    <span className="text-slate-800">{petImport.quarantine_duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Required Documents */}
            {petImport.required_documents && petImport.required_documents.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">📄</span>
                  Required Documents
                </h3>
                <ul className="space-y-2">
                  {petImport.required_documents.map((doc, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="text-slate-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vaccinations */}
            {petImport.vaccination_requirements && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">💉</span>
                  Vaccination Requirements
                </h3>
                <p className="text-slate-700">{petImport.vaccination_requirements}</p>
              </div>
            )}
          </div>

          {/* Right Column - Costs & Timeline */}
          <div className="space-y-6">
            {/* Cost Estimate */}
            {petImport.cost_estimate && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">💰</span>
                  Estimated Costs
                </h3>
                <p className="text-2xl font-bold text-orange-700">{petImport.cost_estimate}</p>
              </div>
            )}

            {/* Processing Time */}
            {petImport.processing_time && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">⏱️</span>
                  Processing Time
                </h3>
                <p className="text-slate-700">{petImport.processing_time}</p>
              </div>
            )}

            {/* Important Notes */}
            {petImport.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">⚠️</span>
                  Important Notes
                </h3>
                <p className="text-slate-700">{petImport.notes}</p>
              </div>
            )}

            {/* Official Resource */}
            {petImport.official_resource_url && (
              <a 
                href={petImport.official_resource_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-blue-600 text-white text-center py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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