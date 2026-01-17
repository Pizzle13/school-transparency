'use client';

export default function DetailModal({ data, onClose }) {
  const renderContent = () => {
    if (typeof data === 'string') {
      // Simple card type (salary, cost, savings)
      const titles = {
        salary: 'Teacher Salary Breakdown',
        cost: 'Monthly Living Costs',
        savings: 'Savings Potential'
      };
      
      const descriptions = {
        salary: 'Average salary for international teachers with 3-5 years experience. Varies by curriculum (IB, American, British) and school tier.',
        cost: 'Average monthly expenses for a single teacher living comfortably. Includes rent, food, transport, and entertainment.',
        savings: 'Typical monthly savings after all expenses. Many teachers save 40-50% of their salary in HCMC.'
      };

      return (
        <div className="p-6">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">{titles[data]}</h3>
          <p className="text-slate-700 leading-relaxed">{descriptions[data]}</p>
        </div>
      );
    }

    if (data.type === 'category') {
      // Category detail
      return (
        <div className="p-6">
          <div className="text-5xl mb-4">{data.data.icon}</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">{data.data.name}</h3>
          <div className="text-4xl font-bold text-blue-700 mb-6">
            ${data.data.amount.toLocaleString()}/month
          </div>
          <p className="text-slate-700">
            This is a typical monthly cost for this category in Ho Chi Minh City.
            Actual costs may vary based on lifestyle and location within the city.
          </p>
        </div>
      );
    }

    // Housing or expenses breakdown
    return (
      <div className="p-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">
          {data === 'housing' ? 'Housing Cost Details' : 'Daily Expenses Details'}
        </h3>
        <p className="text-slate-700">
          Detailed breakdown and recommendations would appear here. This modal can be expanded
          with more specific information about each expense category.
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-3xl leading-none"
          >
            ×
          </button>
        </div>
        
        {renderContent()}

        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}