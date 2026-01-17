export default function SalaryCard({ title, amount, color, icon, breakdown, type, onClick }) {
  const colorClasses = {
    blue: 'bg-blue-700 hover:bg-blue-800',
    orange: 'bg-orange-500 hover:bg-orange-600',
    green: 'bg-green-500 hover:bg-green-600'
  };

  if (type === 'breakdown') {
    return (
      <div
        onClick={onClick}
        className="bg-white border-2 border-blue-200 rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] hover:border-blue-400 transition-all duration-300 cursor-pointer"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
        <div className="space-y-3">
          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-lg font-semibold text-blue-700">
                ${value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-blue-600 font-semibold">
          Click for details →
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${colorClasses[color]} text-white rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-lg`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 opacity-90">{title}</h3>
      <div className="text-4xl font-bold">
        ${amount.toLocaleString()}
      </div>
      <div className="mt-4 text-sm opacity-75">
        Click for breakdown →
      </div>
    </div>
  );
}