export default function WhySection() {
  return (
    <section className="py-20 px-4">
      <h2 className="text-4xl font-bold text-center mb-16 text-blue-600">
        Why School Transparency?
      </h2>
      
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="p-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">Real School Reviews</h3>
          <p>Verified reviews from 2000+ international schools</p>
        </div>

        <div className="p-8 rounded-lg bg-gradient-to-br from-pink-500 to-red-500 text-white hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">Economic Intelligence</h3>
          <p>Live GDP, inflation, and cost of living data</p>
        </div>

        <div className="p-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 text-white hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">Salary Transparency</h3>
          <p>Know what you should earn before you sign</p>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-16">
        <a 
          href="#" 
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Browse Schools
        </a>
        <a 
          href="https://schooltransparency.com/blog/" 
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Read the Blog
        </a>
      </div>
    </section>
  );
}