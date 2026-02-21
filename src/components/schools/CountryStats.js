export default function CountryStats({ stats }) {
  if (!stats) return null;

  const { totalSchools, programmeCounts = {} } = stats;
  const progEntries = Object.entries(programmeCounts).sort(([, a], [, b]) => b - a);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="Total Schools" value={totalSchools} />
      {progEntries.map(([prog, count]) => (
        <StatCard key={prog} label={prog} value={count} />
      ))}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border-2 border-stone-200 rounded-xl p-4 text-center">
      <p className="text-3xl font-black text-stone-900">{value.toLocaleString()}</p>
      <p className="text-xs text-stone-500 font-medium mt-1">{label}</p>
    </div>
  );
}
