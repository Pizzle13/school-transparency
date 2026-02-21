export const metadata = {
  title: 'Community Guidelines - School Transparency',
  description: 'Guidelines for contributing reviews and data to School Transparency.',
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-stone-900 mb-2">Community Guidelines</h1>
        <p className="text-stone-500 mb-12">Last updated: February 21, 2026</p>

        <div className="bg-white rounded-2xl border-2 border-stone-200 p-8 md:p-12 space-y-10 text-stone-700 leading-relaxed">

          <section>
            <p className="text-lg">
              School Transparency is built on the honesty and generosity of the international teaching community. Every review, salary report, and tip helps another teacher make a better-informed decision. These guidelines exist to keep the platform trustworthy, fair, and useful for everyone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">What We Expect</h2>
            <ul className="space-y-4">
              <li>
                <strong className="text-stone-900">Be honest.</strong> Share your genuine experience. If a school was great, say so. If it wasn&apos;t, say that too. What matters is that it&apos;s real.
              </li>
              <li>
                <strong className="text-stone-900">Be specific.</strong> &quot;The management was poor&quot; is less helpful than &quot;Teacher concerns raised in meetings were consistently dismissed without follow-up.&quot; Details help other teachers evaluate whether a concern applies to them.
              </li>
              <li>
                <strong className="text-stone-900">Be fair.</strong> No school is perfect, and no school is entirely bad. A balanced review that covers both strengths and weaknesses is more credible and more useful.
              </li>
              <li>
                <strong className="text-stone-900">Be current.</strong> Conditions at schools change. If your experience is several years old, mention that. A review from 2019 may not reflect how a school operates today.
              </li>
              <li>
                <strong className="text-stone-900">Report accurate data.</strong> When submitting salary, housing, or cost-of-living information, use real numbers from your actual experience. Don&apos;t estimate or guess.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">What Is Not Allowed</h2>
            <p className="mb-4">The following will result in your submission being rejected:</p>

            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="font-bold text-stone-900">False factual claims</p>
                <p className="text-sm mt-1">Stating something as fact that you know to be untrue, or making specific accusations without basis. There is a difference between sharing your opinion (&quot;I felt the administration was unresponsive&quot;) and making an unsubstantiated factual claim (&quot;The principal embezzles school funds&quot;). Opinions based on your experience are welcome. Unverifiable factual allegations about criminal or unethical behavior are not.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="font-bold text-stone-900">Harassment or personal attacks</p>
                <p className="text-sm mt-1">Targeting specific individuals by name with the intent to harass, intimidate, or damage their personal reputation. You may describe your experience with management, administration, or colleagues in general terms without naming individuals.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="font-bold text-stone-900">Confidential or private information</p>
                <p className="text-sm mt-1">Posting internal school documents, private communications, personal contact information of staff, or other confidential material.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="font-bold text-stone-900">Discrimination and hate speech</p>
                <p className="text-sm mt-1">Content that targets individuals or groups based on race, ethnicity, nationality, religion, gender, sexual orientation, disability, or any other protected characteristic.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="font-bold text-stone-900">Spam and promotion</p>
                <p className="text-sm mt-1">Advertising, recruitment agency promotions, commercial solicitations, or any content submitted primarily for promotional purposes rather than to share genuine experience.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="font-bold text-stone-900">Duplicate or manipulative submissions</p>
                <p className="text-sm mt-1">Submitting the same review multiple times, or coordinating with others to artificially inflate or deflate a school&apos;s rating.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">How Moderation Works</h2>
            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li><strong>You submit</strong> a review, salary report, housing data, or tip through one of our forms.</li>
              <li><strong>You verify</strong> your email address via the link we send you (expires in 24 hours).</li>
              <li><strong>We review</strong> your submission against these guidelines. This typically takes a few days.</li>
              <li><strong>We publish or reject.</strong> If approved, your submission appears on the site. If rejected, you receive an email explaining why, and you are welcome to resubmit with changes.</li>
            </ol>
            <p className="mt-4">
              We review every submission before it goes live. We reserve the sole and absolute right to approve, reject, or remove any content at any time, for any reason.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">For Schools</h2>
            <p className="mb-4">
              We understand that negative reviews can be frustrating. Here is how we handle school concerns:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>We do not remove reviews because they are negative.</strong> Honest criticism of a school&apos;s working conditions, management, or facilities is permitted.</li>
              <li><strong>We will review reported content.</strong> If you believe a review violates these guidelines (contains false factual claims, harassment, or confidential information), you may report it to us. We will review the report and make a determination at our sole discretion.</li>
              <li><strong>We make the final call.</strong> We are not obligated to remove content based on external requests, legal threats, or pressure. Our moderation decisions are final.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Consequences</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>First violation:</strong> Submission rejected with an email explaining which guideline was violated and how to fix it.</li>
              <li><strong>Repeated violations:</strong> Your email address may be banned from making further submissions.</li>
              <li><strong>Severe violations</strong> (threats, doxxing, illegal content): Immediate ban, and we may cooperate with law enforcement if necessary.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Contact</h2>
            <p>
              To report a guideline violation or ask questions about moderation, email us at: <strong>community@schooltransparency.com</strong>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
