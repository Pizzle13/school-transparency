'use client';

import { useState, useEffect } from 'react';
import SectionSkeleton from './SectionSkeleton';

export default function ProgressiveLoader({
  cityId,
  dataFetcher,
  Component,
  componentProps = {},
  skeletonTitle,
  skeletonRows = 3
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!cityId) return;

      try {
        setLoading(true);
        const result = await dataFetcher(cityId);
        setData(result);
      } catch (err) {
        console.error('Progressive loading error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    // Delay loading to prioritize above-fold content
    const timer = setTimeout(loadData, 100);
    return () => clearTimeout(timer);
  }, [cityId, dataFetcher]);

  if (loading) {
    return <SectionSkeleton title={skeletonTitle} rows={skeletonRows} />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 rounded-2xl border border-red-200 p-8 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Failed to load {skeletonTitle}
          </h3>
          <p className="text-red-600">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  return <Component {...data} {...componentProps} />;
}