'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { api, setStoredTokens } from '../../../lib/api';
import { useAuthStore } from '../../../stores/auth.store';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.auth.register({
        first_name: firstName,
        last_name: lastName,
        store_name: storeName,
        phone_number: phoneNumber,
        email,
        password,
      });

      setStoredTokens(res.tokens);
      setAuth(res.user, res.organization);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Failed to create organization account'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-7 shadow-xl space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs mb-3">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Create your Shopnix Store
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Empower your online business with automated courier logistics
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tanvir"
                className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ahmed"
                className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Store / Business Name
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Aarong Style Boutique"
              className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Contact Phone (11 digits)
            </label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="01712345678"
              className="w-full h-9 px-3 text-sm font-mono rounded-md border border-border bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Work Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@yourbrand.com"
              className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Password (min 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            {isLoading ? 'Creating store...' : 'Create Account & Store'}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
