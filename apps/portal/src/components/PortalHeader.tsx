'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';

export const PortalHeader: React.FC = () => {
  const { user, logout, isDirector, isPanaceaStaff } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Directorate / Client Badge */}
        {isPanaceaStaff ? (
          <div className="flex items-center gap-2 rounded-md bg-burgundy-50 border border-burgundy-200 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-burgundy-600 animate-pulse" />
            <span className="text-xs font-bold text-burgundy-950 flex items-center gap-1.5">
              <span>🏛️</span>
              <span>{isDirector ? 'PANACEA DIRECTORATE COMMAND' : 'PANACEA ENFORCEMENT OPERATIONS'}</span>
            </span>
            <span className="text-[10px] text-gray-500 hidden md:inline border-l border-burgundy-200 pl-2 ml-1">
              {user?.organization?.legalName || 'Panacea Consultancy Pvt Ltd'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-md bg-navy-50 border border-navy-200 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
              <span>🏦</span>
              <span>{user?.organization?.legalName || 'Bank Client Desk'}</span>
            </span>
            <span className="text-[10px] text-gray-500 hidden md:inline border-l border-navy-200 pl-2 ml-1">
              Secured Creditor Mandate
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Security Session Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
          <svg className="h-3.5 w-3.5 text-navy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Encrypted Session (30m idle timeout)</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-navy-950">{user?.displayName || 'Authorized User'}</div>
            <div className="text-[10px] text-gray-500 capitalize">{user?.role?.name?.replace(/_/g, ' ') || 'Authorized User'}</div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 hover:text-burgundy-700 transition-colors"
            title="Log Out & Invalidate Session"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-5m0 0l-4-5m4 5H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
