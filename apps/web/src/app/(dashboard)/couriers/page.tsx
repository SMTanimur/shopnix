'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import {
  Truck,
  Settings2,
  Search,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { PageHeader, DashboardCard, BrandLogo } from '../../../components';
import type { CourierProviderName, CourierFraudCheckResponse } from '@shopnix/types';

export default function CouriersPage() {
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState<CourierProviderName | null>(null);
  const [creds, setCreds] = useState<Record<string, string>>({});
  const [trackingSearch, setTrackingSearch] = useState('');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  // Cross-Courier Phone Fraud Check State
  const [fraudPhone, setFraudPhone] = useState('01711223344');
  const [fraudResult, setFraudResult] = useState<CourierFraudCheckResponse | null>(null);
  const [isFraudLoading, setIsFraudLoading] = useState(false);

  const { data: configsData } = useQuery({
    queryKey: ['courier-configs'],
    queryFn: () => api.couriers.getConfigurations(),
  });

  const saveConfigMutation = useMutation({
    mutationFn: () => {
      if (!selectedProvider) throw new Error('No provider selected');
      return api.couriers.configure({
        provider: selectedProvider,
        is_active: true,
        credentials: creds,
      });
    },
    onSuccess: () => {
      setSelectedProvider(null);
      setCreds({});
      queryClient.invalidateQueries({ queryKey: ['courier-configs'] });
    },
  });

  const handleTrack = async () => {
    if (!trackingSearch.trim()) return;
    setIsTrackingLoading(true);
    try {
      const res = await api.couriers.track(trackingSearch.trim());
      setTrackingResult(res.data);
    } catch {
      setTrackingResult({ error: 'Tracking information not found for this consignment ID' });
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const handleFraudCheck = async () => {
    if (!fraudPhone.trim()) return;
    setIsFraudLoading(true);
    try {
      const res = await api.couriers.checkFraudRisk(fraudPhone.trim());
      setFraudResult(res.data);
    } catch {
      setFraudResult(null);
    } finally {
      setIsFraudLoading(false);
    }
  };

  const configs = configsData?.data || [];
  const isConfigured = (provider: string) =>
    configs.some((c) => c.provider === provider && c.is_active);

  const partners: Array<{
    id: CourierProviderName;
    name: string;
    badge: string;
    description: string;
    sla: string;
    fields: Array<{ key: string; label: string; placeholder: string; type?: string }>;
  }> = [
    {
      id: 'steadfast',
      name: 'Steadfast Courier',
      badge: 'Packzy Portal API v1',
      description: 'Nationwide COD parcel fulfillment with real-time consignment generation, tracking & balance sync.',
      sla: '24–36h Inside Dhaka',
      fields: [
        { key: 'api_key', label: 'Steadfast Api-Key Header', placeholder: 'Paste Packzy Api-Key...' },
        { key: 'secret_key', label: 'Steadfast Secret-Key Header', placeholder: 'Paste Secret-Key...', type: 'password' },
      ],
    },
    {
      id: 'pathao',
      name: 'Pathao Courier',
      badge: 'Hermes Aladdin OAuth2',
      description: 'Automated OAuth2 parcel booking with hierarchical City → Zone → Area resolution and live webhooks.',
      sla: '18–24h Express SLA',
      fields: [
        { key: 'client_id', label: 'Pathao Client ID', placeholder: 'Aladdin OAuth Client ID' },
        { key: 'client_secret', label: 'Pathao Client Secret', placeholder: 'Aladdin Client Secret', type: 'password' },
        { key: 'username', label: 'Merchant Email / Username', placeholder: 'merchant@store.com' },
        { key: 'password', label: 'Merchant Password', placeholder: '••••••••', type: 'password' },
      ],
    },
    {
      id: 'redx',
      name: 'RedX Delivery',
      badge: 'OpenAPI Bearer Token',
      description: 'High-volume tech logistics across 64 districts with automated pickup store and gram-weight pricing.',
      sla: '24–48h Nationwide',
      fields: [
        { key: 'api_token', label: 'RedX API Access Token (Bearer)', placeholder: 'eyJhbGciOiJIUzI1NiIs...', type: 'password' },
      ],
    },
    {
      id: 'paperfly',
      name: 'Paperfly Wings',
      badge: 'Union-Level Doorstep API',
      description: 'Deep union and upazila doorstep coverage across Bangladesh with automated RTO return management.',
      sla: '24–48h All Thanas',
      fields: [
        { key: 'username', label: 'Paperfly Merchant Username', placeholder: 'Merchant ID / Username' },
        { key: 'password', label: 'Paperfly Password', placeholder: '••••••••', type: 'password' },
        { key: 'api_key', label: 'Paperfly API Key Header', placeholder: 'paperflykey...', type: 'password' },
      ],
    },
    {
      id: 'ecourier',
      name: 'eCourier',
      badge: 'Instapay & Backoffice API',
      description: 'Multi-header parcel booking, Thana/Postcode resolution, and Instant COD payment settlement.',
      sla: '24h Metro Express',
      fields: [
        { key: 'user_id', label: 'eCourier USER-ID', placeholder: 'e.g. EC-8821' },
        { key: 'api_key', label: 'eCourier API-KEY', placeholder: 'Paste API-KEY...' },
        { key: 'api_secret', label: 'eCourier API-SECRET', placeholder: 'Paste API-SECRET...', type: 'password' },
      ],
    },
    {
      id: 'carrybee',
      name: 'Carrybee Express',
      badge: 'Same-Day & Next-Day COD',
      description: 'Fast metro and suburban COD parcel dispatch with instant rider assignment and low COD surcharge.',
      sla: '12–24h Metro',
      fields: [
        { key: 'api_key', label: 'Carrybee Merchant API Key', placeholder: 'Paste Carrybee API Key...', type: 'password' },
      ],
    },
  ];

  const activeModalPartner = partners.find((p) => p.id === selectedProvider);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20"
    >
      <PageHeader
        title="Bangladesh Courier Logistics & Fraud Intelligence Hub"
        description="Connect Steadfast, Pathao, RedX, Paperfly, eCourier & Carrybee APIs for 1-click AWB generation and cross-courier phone ratio verification."
      />

      {/* Top Row: Cross-Courier Fraud Ratio Checker + Live Shipment Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Cross-Courier Customer Phone Fraud & RTO Ratio Checker"
          description="Verify a buyer's historical delivery vs. return ratio across Steadfast, Pathao, RedX & Paperfly before dispatching COD"
        >
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={fraudPhone}
                onChange={(e) => setFraudPhone(e.target.value)}
                placeholder="Enter 11-digit BD mobile (e.g. 01711223344)..."
                className="w-full h-9 pl-9 pr-3 text-xs font-mono rounded-lg border border-border bg-background text-foreground"
              />
            </div>
            <button
              type="button"
              onClick={handleFraudCheck}
              disabled={isFraudLoading || !fraudPhone.trim()}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {isFraudLoading ? 'Checking...' : 'Check Ratio'}
            </button>
          </div>

          {fraudResult && (
            <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border/60">
                <div>
                  <span className="text-xs font-extrabold text-foreground font-mono">
                    {fraudResult.phone_number}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({fraudResult.delivered_parcels} Delivered / {fraudResult.total_parcels} Total Parcels)
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                    fraudResult.risk_level === 'trusted'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : fraudResult.risk_level === 'moderate'
                      ? 'bg-amber-500/15 text-amber-600'
                      : 'bg-rose-500/15 text-rose-600'
                  }`}
                >
                  {fraudResult.success_rate}% Success ({fraudResult.risk_level.replace('_', ' ').toUpperCase()})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {fraudResult.carriers.map((c) => (
                  <div
                    key={c.provider}
                    className="p-2.5 rounded-lg border border-border/60 bg-card flex items-center gap-2"
                  >
                    <BrandLogo brand={c.provider} size={22} />
                    <div>
                      <div className="text-[11px] font-bold capitalize text-foreground">
                        {c.provider}
                      </div>
                      <div className="text-[10px] text-muted-foreground tabular-nums">
                        {c.delivered_parcels}/{c.total_parcels} ({c.success_rate}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-muted-foreground flex items-start gap-1.5 pt-1">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{fraudResult.ai_recommendation}</span>
              </p>
            </div>
          )}
        </DashboardCard>

        {/* Shipment Tracker Widget */}
        <DashboardCard
          title="Universal Consignment & AWB Tracker"
          description="Query live parcel status and hub checkpoints across any integrated courier"
        >
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={trackingSearch}
              onChange={(e) => setTrackingSearch(e.target.value)}
              placeholder="Enter Consignment ID (e.g. SF-840201, PTH-840202)..."
              className="flex-1 h-9 px-3 text-xs font-mono rounded-lg border border-border bg-background text-foreground"
            />
            <button
              type="button"
              onClick={handleTrack}
              disabled={isTrackingLoading || !trackingSearch.trim()}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Search className="h-3.5 w-3.5" />
              {isTrackingLoading ? 'Searching...' : 'Track AWB'}
            </button>
          </div>

          {trackingResult ? (
            <div className="p-4 rounded-xl border border-border bg-muted/20 text-xs">
              {trackingResult.error ? (
                <p className="text-destructive font-medium">{trackingResult.error}</p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">
                      Status: <span className="text-primary uppercase">{trackingResult.status}</span>
                    </span>
                    <span className="text-muted-foreground font-mono text-[11px]">
                      AWB: {trackingResult.tracking_code}
                    </span>
                  </div>
                  {trackingResult.current_location && (
                    <div className="text-muted-foreground">
                      Current Hub: <span className="font-semibold text-foreground">{trackingResult.current_location}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-border text-xs text-muted-foreground">
              Enter any Steadfast, Pathao, RedX, Paperfly, or Sandbox consignment code to inspect live sorting hub telemetry.
            </div>
          )}
        </DashboardCard>
      </div>

      {/* Courier Partners Grid with Authentic SVG Brand Logos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => {
          const active = isConfigured(partner.id);

          return (
            <motion.div
              key={partner.id}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-border/80 bg-card p-5 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-3">
                    <BrandLogo brand={partner.id} size={38} className="shrink-0 shadow-2xs rounded-lg" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{partner.name}</h3>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {partner.badge}
                      </span>
                    </div>
                  </div>
                  {active ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Live Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                      Sandbox Ready
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {partner.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-[11px] px-3 py-2 rounded-lg bg-muted/40 border border-border/50">
                  <span className="text-muted-foreground font-medium">Target SLA</span>
                  <span className="font-bold text-foreground">{partner.sla}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/70">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProvider(partner.id);
                    setCreds({});
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 h-9 text-xs font-bold rounded-lg border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer transition-all"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Configure {partner.name} API
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Provider-Specific Configuration Modal */}
      {selectedProvider && activeModalPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <BrandLogo brand={activeModalPartner.id} size={36} />
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {activeModalPartner.name} Credentials
                </h3>
                <p className="text-xs text-muted-foreground">
                  {activeModalPartner.badge} • Encrypted with AES-256-GCM
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {activeModalPartner.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    value={creds[field.key] || ''}
                    onChange={(e) =>
                      setCreds((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                    className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background text-foreground"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedProvider(null)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-border bg-card text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveConfigMutation.mutate()}
                disabled={saveConfigMutation.isPending}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                {saveConfigMutation.isPending ? 'Saving...' : 'Save & Activate Carrier'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
