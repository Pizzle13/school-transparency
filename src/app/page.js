import Hero from '../components/Hero'

export const metadata = {
  title: 'School Transparency | Data-Driven Insights for International Teachers',
  description: 'Empowering international teachers with comprehensive data insights for smarter career decisions. Explore city guides, expert articles, and educational resources.',
  keywords: 'international teaching, teacher salaries, expat education, school data, teacher careers, international schools, educational insights',
  openGraph: {
    title: 'School Transparency - Data-Driven Education Intelligence',
    description: 'Comprehensive platform for international teachers with city guides, expert articles, and data insights.',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'School Transparency - International Education Data Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School Transparency - International Teacher Resources',
    description: 'Data-driven insights for international educators making career decisions.',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
    </main>
  );
}