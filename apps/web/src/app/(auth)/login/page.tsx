'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api, setStoredTokens } from '../../../lib/api';
import { useAuthStore } from '../../../stores/auth.store';
import { ShopnixIcon } from '../../../components/brand';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.auth.login({ email, password });
      setStoredTokens(res.tokens);
      setAuth(res.user, res.organization);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Invalid email or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-7 shadow-xl space-y-6">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-3 hover:scale-105 transition-transform">
            <ShopnixIcon size={44} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Sign in to Shopnix
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Enterprise Ecommerce Management & Logistics
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="merchant@example.com"
              className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-foreground">
                Password
              </label>
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register your store
          </Link>
        </div>
      </div>
    </div>
  );
}
