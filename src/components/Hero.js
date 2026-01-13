export default function Hero() {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center text-white"
      style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="text-center px-4 max-w-4xl">
        <h1 className="text-7xl font-bold mb-6">
          School Transparency
        </h1>
        <p className="text-3xl mb-12">
          Coming Soon
        </p>
        <p className="text-xl mb-8">
          Data-driven insights for international teachers making career decisions
        </p>
        <a 
          href="https://schooltransparency.com/blog/" 
          className="inline-block px-10 py-5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg text-xl"
        >
          Read the Blog
        </a>
      </div>
    </section>
  );
}