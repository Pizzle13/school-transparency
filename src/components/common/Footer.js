export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-white py-12 border-t-4 border-stone-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black mb-3">School Transparency</h3>
            <p className="text-stone-400">
              Data-driven insights for international teachers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="/cities" className="hover:text-white transition-colors">Cities</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-3 text-white">Legal</h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/community-guidelines" className="hover:text-white transition-colors">Community Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-700 pt-8 text-center text-stone-400">
          <p className="font-bold">© {currentYear} School Transparency. All rights reserved.</p>
          <p className="text-sm mt-2">
            Built by teachers, for teachers. Powered by community contributions.
          </p>
        </div>
      </div>
    </footer>
  );
}
