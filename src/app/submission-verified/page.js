import Link from 'next/link';

export const metadata = {
  title: 'Submission Verified - School Transparency',
  description: 'Your submission has been verified',
};

export default function SubmissionVerifiedPage({ searchParams }) {
  const alreadyVerified = searchParams?.already === 'true';

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-2xl border-4 border-stone-900 max-w-2xl w-full text-center">
        <div className="text-6xl mb-6">
          {alreadyVerified ? '✓' : '🎉'}
        </div>

        <h1 className="text-4xl font-black text-stone-900 mb-4">
          {alreadyVerified ? 'Already Verified' : 'Email Verified!'}
        </h1>

        <p className="text-xl text-stone-600 mb-8">
          {alreadyVerified
            ? 'This submission has already been verified.'
            : 'Thanks for verifying your email! Your submission is now in the review queue.'
          }
        </p>

        {!alreadyVerified && (
          <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-bold text-stone-900 mb-2">What happens next?</h3>
            <ul className="text-stone-700 space-y-2 list-disc list-inside">
              <li>Our team will review your submission (usually within 48 hours)</li>
              <li>We check for accuracy, helpfulness, and community guidelines compliance</li>
              <li>You'll receive an email once your submission is approved</li>
              <li>Approved submissions appear on the site immediately</li>
            </ul>
          </div>
        )}

        <Link
          href="/cities"
          className="inline-block bg-orange-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-700 transition-colors border-2 border-stone-900"
        >
          Browse Cities
        </Link>
      </div>
    </div>
  );
}
