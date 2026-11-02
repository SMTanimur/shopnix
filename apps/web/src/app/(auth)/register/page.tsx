'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { api, setStoredTokens } from '../../../lib/api';
import { useAuthStore } from '../../../stores/auth.store';
import { ShopnixIcon } from '../../../components/brand';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: '' };
    if (password.length < 8) return { score: 1, label: 'Too short (min 8)', color: 'bg-rose-500' };
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    if (hasLetters && hasNumbers && hasSpecial) {
      return { score: 3, label: 'Strong password', color: 'bg-emerald-500' };
    }
    if ((hasLetters && hasNumbers) || (hasLetters && hasSpecial)) {
      return { score: 2, label: 'Medium strength', color: 'bg-amber-500' };
    }
    return { score: 1, label: 'Weak (add numbers/symbols)', color: 'bg-rose-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Frontend validation
    const cleanedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanedPhone.length < 11) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678)');
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.auth.register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        store_name: storeName.trim(),
        phone_number: cleanedPhone,
        email: email.trim().toLowerCase(),
        password,
      });

      // Successful registration: store tokens and redirect to dashboard
      setStoredTokens(res.tokens);
      setAuth(res.user, res.organization);
      router.push('/dashboard');
    } catch (err: any) {
      // Capture specific backend error message
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Registration failed. Please check your information and try again.';
      setErrorMessage(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 bg-slate-50/60 dark:bg-background">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-3 hover:scale-105 transition-transform">
            <ShopnixIcon size={44} />
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Create your Shopnix Store
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
            Empower your online business with automated courier logistics & omnichannel chat
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-medium leading-relaxed">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="SM"
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Rahman"
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Store / Business Name */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Store / Business Name
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="SM Tanimir Fashion"
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Contact Phone (11 digits) */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center justify-between">
              <span>Contact Phone</span>
              <span className="text-[10px] text-muted-foreground font-normal">11-digit BD number</span>
            </label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="01648138404"
              className="w-full h-10 px-3 text-xs sm:text-sm font-mono rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Work Email Address */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Work Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="smtrstar@gmail.com"
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Password with Visibility Toggle & Strength Gauge */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Password (min 8 characters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 pr-10 text-xs sm:text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Strength Meter Bar */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1.5 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${(strength.score / 3) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground flex justify-between">
                  <span>{strength.label}</span>
                  <span>Min 8 characters</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Your Store...</span>
              </div>
            ) : (
              <>
                <span>Create Account & Store</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-border/70 text-center text-xs text-muted-foreground">
          <span>Already have an account? </span>
          <Link href="/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
