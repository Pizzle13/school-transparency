'use client';

import { useState } from 'react';
import DataDisputeModal from './DataDisputeModal';

export default function ReportDataButton({ schoolId, schoolName }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-red-600 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
        Report an issue
      </button>

      {isOpen && (
        <DataDisputeModal
          schoolId={schoolId}
          schoolName={schoolName}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
