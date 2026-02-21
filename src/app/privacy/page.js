export const metadata = {
  title: 'Privacy Policy - School Transparency',
  description: 'How School Transparency collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-stone-900 mb-2">Privacy Policy</h1>
        <p className="text-stone-500 mb-12">Last updated: February 21, 2026</p>

        <div className="bg-white rounded-2xl border-2 border-stone-200 p-8 md:p-12 space-y-10 text-stone-700 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">1. Who We Are</h2>
            <p>
              School Transparency (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) operates the website at schooltransparency.com. We provide a community-driven platform offering information about international schools, cities, salaries, cost of living, and teacher experiences. This Privacy Policy explains what data we collect, how we use it, and your rights regarding that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">2. Data We Collect</h2>

            <h3 className="text-lg font-bold text-stone-800 mt-6 mb-3">2.1 Data You Provide Directly</h3>
            <p className="mb-4">When you submit information through our forms, we collect:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Email address</strong> - required for all submissions, used for verification and communication about your submission.</li>
              <li><strong>School reviews</strong> - ratings (1-10 scales), text feedback (pros, cons, advice), years taught, position, contract type, and role level.</li>
              <li><strong>Salary data</strong> - position, salary amount, currency, years of experience, and benefit details (housing, flights, insurance, tuition).</li>
              <li><strong>Housing data</strong> - area name, rent prices, neighborhood descriptions, safety ratings, and commute information.</li>
              <li><strong>Local tips</strong> - category and tip text about living in a city.</li>
              <li><strong>School suggestions</strong> - school name, type, website, and district when suggesting a new school.</li>
            </ul>

            <h3 className="text-lg font-bold text-stone-800 mt-6 mb-3">2.2 Data Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Analytics data</strong> - we use Google Analytics 4 (GA4) to collect anonymized usage data including pages visited, referral source, approximate location (country/city level), device type, and browser. GA4 operates in cookieless mode by default.</li>
              <li><strong>Server logs</strong> - our hosting provider (Vercel) automatically logs IP addresses, request timestamps, and page URLs for security and performance purposes.</li>
            </ul>

            <h3 className="text-lg font-bold text-stone-800 mt-6 mb-3">2.3 Data We Do Not Collect</h3>
            <p>We do not collect passwords, payment information, government IDs, or any biometric data. We do not require account creation to use the site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">3. How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Email verification</strong> - we send a one-time verification email to confirm your submission. Verification tokens expire after 24 hours.</li>
              <li><strong>Submission review</strong> - we review all submissions for compliance with our Community Guidelines before publishing.</li>
              <li><strong>Notification</strong> - we email you when your submission is approved or rejected. We do not send marketing emails.</li>
              <li><strong>Aggregation</strong> - salary, housing, and rating data is aggregated to generate city-level and school-level statistics displayed on the site. Individual submissions are not attributed to you by name.</li>
              <li><strong>Site improvement</strong> - analytics data helps us understand which pages are useful and where to focus improvements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">4. Third-Party Services</h2>
            <p className="mb-4">We use the following third-party services to operate the platform:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-stone-200">
                    <th className="py-2 pr-4 font-bold text-stone-900">Service</th>
                    <th className="py-2 pr-4 font-bold text-stone-900">Purpose</th>
                    <th className="py-2 font-bold text-stone-900">Data Shared</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-stone-100">
                    <td className="py-3 pr-4 font-medium">Supabase</td>
                    <td className="py-3 pr-4">Database hosting</td>
                    <td className="py-3">All submission data, email addresses</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-3 pr-4 font-medium">Resend</td>
                    <td className="py-3 pr-4">Email delivery</td>
                    <td className="py-3">Email addresses, submission type, city name</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-3 pr-4 font-medium">Google Analytics 4</td>
                    <td className="py-3 pr-4">Site analytics</td>
                    <td className="py-3">Anonymized usage data, approximate location</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">Vercel</td>
                    <td className="py-3 pr-4">Website hosting</td>
                    <td className="py-3">Server logs (IP, request data)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">We do not sell, rent, or trade your personal data to any third party. We do not use your data for advertising or profiling.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">5. Cookies and Tracking</h2>
            <p>
              Google Analytics 4 may set cookies (_ga, _gid) to distinguish users and track sessions. You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-700 underline hover:text-blue-900" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>. We do not use any other tracking cookies, advertising pixels, or third-party trackers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">6. Data Retention</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Approved submissions</strong> - kept indefinitely to maintain accurate aggregated data (salary ranges, school ratings, city information).</li>
              <li><strong>Rejected submissions</strong> - deleted from our database within 90 days of rejection.</li>
              <li><strong>Email addresses</strong> - retained as long as the associated submission exists, so we can contact you if needed (e.g., to clarify information).</li>
              <li><strong>Verification tokens</strong> - automatically expire and are cleared after 24 hours.</li>
              <li><strong>Analytics data</strong> - retained by Google Analytics for 14 months (GA4 default), then automatically deleted.</li>
              <li><strong>Server logs</strong> - retained by Vercel per their standard retention policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">7. Your Rights</h2>
            <p className="mb-4">Regardless of where you are located, you have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access</strong> - request a copy of any personal data we hold about you.</li>
              <li><strong>Correction</strong> - request correction of inaccurate data.</li>
              <li><strong>Deletion</strong> - request deletion of your personal data, including submissions and your email address. Note that deleting a submission removes it from aggregated statistics.</li>
              <li><strong>Opt-out of analytics</strong> - use the Google Analytics Opt-out Add-on or a browser-based ad blocker.</li>
            </ul>
            <p className="mt-4">To exercise any of these rights, email us at the address listed in Section 11 below. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">8. European Users (GDPR)</h2>
            <p className="mb-4">
              If you are located in the European Economic Area (EEA) or United Kingdom, the following additional rights apply under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Legal basis</strong> - we process your data based on legitimate interest (operating the platform and aggregating community data) and your consent (submitting information through our forms).</li>
              <li><strong>Data portability</strong> - you may request your data in a portable format.</li>
              <li><strong>Right to object</strong> - you may object to data processing based on legitimate interest.</li>
              <li><strong>Supervisory authority</strong> - you have the right to lodge a complaint with your local data protection authority.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">9. California Users (CCPA)</h2>
            <p>
              If you are a California resident, you have the right to know what personal information we collect, request its deletion, and opt out of its sale. We do not sell personal information. To make a request, contact us at the email below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">10. Children&apos;s Privacy</h2>
            <p>
              This platform is intended for adults (teachers, parents, and education professionals). We do not knowingly collect personal information from anyone under the age of 13. If you believe a child has submitted personal information, please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">11. Contact Us</h2>
            <p>
              For any privacy-related questions, data access requests, or deletion requests, email us at: <strong>hello@schooltransparency.com</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Your continued use of the site after changes are posted constitutes your acceptance of the revised policy.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
