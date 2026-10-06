import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-navy-50 text-navy-950 flex items-center justify-center font-display text-2xl font-bold border border-navy-200 mb-6">
        404
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-950">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-gray-600 leading-relaxed">
        The requested resource does not exist or has been relocated within the secure Panacea network.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-navy-950 hover:bg-navy-900 active:bg-navy-950 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors"
        >
          Return to Homepage
        </Link>
        <Link
          href="/contact"
          className="rounded-md border border-gray-300 px-5 py-2.5 text-xs font-semibold text-navy-900 hover:bg-gray-50 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
