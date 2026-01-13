export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center text-white"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center px-4 max-w-4xl">
          <h1 className="text-6xl font-bold mb-4">
            Make Better Career Decisions as an International Teacher
          </h1>
          <p className="text-2xl">
            Data-driven insights on salaries, schools, and cost of living in 100+ countries
          </p>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-blue-600">
          Why School Transparency?
        </h2>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Real School Reviews</h3>
            <p>Verified reviews from 2000+ international schools</p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-lg bg-gradient-to-br from-pink-500 to-red-500 text-white hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Economic Intelligence</h3>
            <p>Live GDP, inflation, and cost of living data</p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 text-white hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Salary Transparency</h3>
            <p>Know what you should earn before you sign</p>
          </div>
        </div>

        {/* Buttons */}
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
    </div>
  );
}