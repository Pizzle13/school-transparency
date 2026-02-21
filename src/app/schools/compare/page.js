import { Suspense } from 'react';
import CompareContent from './CompareContent';

export const metadata = {
  title: 'Compare Schools | School Transparency',
  description: 'Compare international schools side by side. See programmes, school type, boarding, language, and more at a glance.',
};

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-500">Loading comparison...</p>
          </div>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
