'use client';

import React, { useState, useEffect } from 'react';

export const ConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const acknowledged = localStorage.getItem('panacea_cookie_ack');
    if (!acknowledged) {
      setVisible(true);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem('panacea_cookie_ack', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Security and Privacy Notice"
      className="fixed bottom-0 inset-x-0 z-50 p-4 bg-navy-950/95 text-white backdrop-blur-md border-t border-navy-800 shadow-2xl transition-all"
    >
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-gray-300 leading-relaxed max-w-4xl">
          <span className="font-semibold text-gold-400 uppercase tracking-wide mr-1">
            Privacy & Security Notice:
          </span>
          This platform uses essential session security cookies to authenticate authorized
          institutional users, prevent cross-site request forgery, and maintain strict data isolation.
          No third-party tracking or advertising cookies are utilized. By utilizing this platform,
          you acknowledge our institutional security governance standards.
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleAcknowledge}
            className="rounded-md bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-navy-950 font-semibold px-4 py-2 text-xs transition-colors shadow-sm"
          >
            Acknowledge & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};
