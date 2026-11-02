'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, Clock, User, Filter } from 'lucide-react';
import { formatDate } from '@shopnix/utils';
import type { AdminAuditLog } from '@shopnix/types';

export default function AdminAuditLogsPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('shopnix_admin_tokens') : null;
      const tokens = stored ? JSON.parse(stored) : null;

      const res = await fetch('http://localhost:8000/api/v1/admin/audit-logs', {
        headers: { Authorization: `Bearer ${tokens?.access_token || ''}` },
      });
      if (!res.ok) throw new Error('Failed to load audit logs');
      const json = await res.json();
      return json.data as AdminAuditLog[];
    },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Platform Audit Logs</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Immutable event log of all administrative actions, policy changes, and credential updates
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Type</th>
              <th className="py-3 px-4">Target ID</th>
              <th className="py-3 px-4">Admin Actor</th>
              <th className="py-3 px-4">Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {(logs || []).map((l) => (
              <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                  {formatDate(l.created_at)}
                </td>
                <td className="py-3 px-4 font-semibold text-white">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-red-300 font-mono text-[10px]">
                    {l.action}
                  </span>
                </td>
                <td className="py-3 px-4 capitalize">{l.target_type}</td>
                <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{l.target_id}</td>
                <td className="py-3 px-4">{l.admin_email}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-400 truncate max-w-xs">
                  {l.details ? JSON.stringify(l.details) : '-'}
                </td>
              </tr>
            ))}

            {(!logs || logs.length === 0) && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No administrative events recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
