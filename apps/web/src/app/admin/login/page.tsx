'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@shopnix.io');
  const [password, setPassword] = useState('ShopnixAdmin2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Invalid administrator credentials');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('shopnix_admin_tokens', JSON.stringify(json.data.tokens));
      }
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-400 mb-3">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Super Admin Control Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Restricted platform administrative gateway. Authorized personnel only.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-700 bg-slate-800/80 text-sm text-white focus:outline-hidden focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Root Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-700 bg-slate-800/80 text-sm text-white focus:outline-hidden focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 mt-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Verifying Credentials...' : 'Authenticate as Super Admin'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Default seed: <code className="text-slate-400">admin@shopnix.io</code> / <code className="text-slate-400">ShopnixAdmin2026!</code>
        </div>
      </div>
    </div>
  );
}
