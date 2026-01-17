export default function SalaryAnalysis({ data, economic }) {
  if (!data || !economic) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-800 mb-8">Salary & Savings</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Average Salary</h3>
            <p className="text-3xl font-bold text-blue-700">${data.avg_salary.toLocaleString()}</p>
            <p className="text-sm text-slate-600 mt-2">Per month</p>
          </div>
          
          <div className="bg-orange-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Monthly Costs</h3>
            <p className="text-3xl font-bold text-orange-600">${data.monthly_cost.toLocaleString()}</p>
            <p className="text-sm text-slate-600 mt-2">Rent + living expenses</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Monthly Savings</h3>
            <p className="text-3xl font-bold text-green-700">${data.monthly_savings.toLocaleString()}</p>
            <p className="text-sm text-slate-600 mt-2">After expenses</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">GDP Growth</h3>
            <p className="text-3xl font-bold text-blue-700">{economic.gdp_latest}%</p>
            <p className="text-sm text-slate-600">Latest ({economic.gdp_year})</p>
            <p className="text-sm text-slate-600 mt-2">5-year avg: {economic.gdp_5yr_avg}%</p>
          </div>
          
          <div className="bg-orange-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Inflation</h3>
            <p className="text-3xl font-bold text-orange-600">{economic.inflation_latest}%</p>
            <p className="text-sm text-slate-600">Latest ({economic.inflation_year})</p>
            <p className="text-sm text-slate-600 mt-2">5-year avg: {economic.inflation_5yr_avg}%</p>
          </div>
        </div>
      </div>
    </section>
  );
}