'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Truck, CheckCircle2, Settings2, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../../lib/api';
import { PageHeader, DashboardCard } from '../../../components';
import type { CourierProviderName } from '@shopnix/types';

export default function CouriersPage() {
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState<CourierProviderName | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [trackingSearch, setTrackingSearch] = useState('');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

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
        credentials: {
          api_key: apiKey,
          secret_key: secretKey,
        },
      });
    },
    onSuccess: () => {
      setSelectedProvider(null);
      setApiKey('');
      setSecretKey('');
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

  const configs = configsData?.data || [];
  const isConfigured = (provider: string) =>
    configs.some((c) => c.provider === provider && c.is_active);

  const partners: Array<{
    id: CourierProviderName;
    name: string;
    description: string;
    logoColor: string;
  }> = [
    {
      id: 'sandbox',
      name: 'Sandbox Simulator',
      description: 'Simulate automated consignment booking and tracking events without live merchant credentials.',
      logoColor: 'bg-emerald-600',
    },
    {
      id: 'steadfast',
      name: 'Steadfast Courier',
      description: 'Direct integration with Steadfast API (Api-Key & Secret-Key header authentication).',
      logoColor: 'bg-red-600',
    },
    {
      id: 'pathao',
      name: 'Pathao Courier',
      description: 'Automated parcel bookings via Pathao OAuth2 client credentials grant.',
      logoColor: 'bg-rose-500',
    },
    {
      id: 'redx',
      name: 'RedX Delivery',
      description: 'Tech-first delivery integration via RedX merchant API token.',
      logoColor: 'bg-amber-600',
    },
    {
      id: 'ecourier',
      name: 'eCourier',
      description: 'Multi-header parcel booking and COD collection reconciliation.',
      logoColor: 'bg-blue-600',
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Bangladesh Courier Logistics Integrations"
        description="Connect Steadfast, Pathao, RedX, and eCourier APIs for 1-click consignment generation and automated tracking sync."
      />

      {/* Shipment Tracker Widget */}
      <DashboardCard
        title="Quick Consignment Tracking"
        description="Query live parcel status across any integrated carrier"
      >
        <div className="flex gap-2 max-w-lg mb-3">
          <input
            type="text"
            value={trackingSearch}
            onChange={(e) => setTrackingSearch(e.target.value)}
            placeholder="Enter Consignment ID or Tracking Code..."
            className="flex-1 h-9 px-3 text-xs rounded-md border border-border bg-card text-foreground"
          />
          <button
            type="button"
            onClick={handleTrack}
            disabled={isTrackingLoading || !trackingSearch.trim()}
            className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            {isTrackingLoading ? 'Searching...' : 'Track'}
          </button>
        </div>

        {trackingResult && (
          <div className="p-4 rounded-md border border-border bg-muted/20 text-xs">
            {trackingResult.error ? (
              <p className="text-destructive font-medium">{trackingResult.error}</p>
            ) : (
              <div className="space-y-1">
                <div className="font-semibold text-foreground">
                  Status: <span className="text-primary uppercase">{trackingResult.status}</span>
                </div>
                <div className="text-muted-foreground font-mono">
                  Tracking Code: {trackingResult.tracking_code}
                </div>
                {trackingResult.current_location && (
                  <div className="text-muted-foreground">
                    Location: {trackingResult.current_location}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DashboardCard>

      {/* Courier Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => {
          const active = isConfigured(partner.id) || partner.id === 'sandbox';

          return (
            <div
              key={partner.id}
              className="rounded-lg border border-border bg-card p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`h-9 w-9 rounded-md ${partner.logoColor} text-white flex items-center justify-center font-bold text-sm shadow-xs`}
                  >
                    {partner.name[0]}
                  </div>
                  {active ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-sm">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Connected
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">Not Configured</span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-foreground">{partner.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {partner.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedProvider(partner.id)}
                  className="w-full inline-flex items-center justify-center gap-1.5 h-8 text-xs font-semibold rounded-md border border-border bg-card text-foreground hover:bg-muted cursor-pointer transition-colors"
                >
                  <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Configure Credentials
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground capitalize">
                Configure {selectedProvider} API Credentials
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Obtain your credentials from your {selectedProvider} merchant dashboard.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                API Key / Access Token
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste API Key here..."
                className="w-full h-9 px-3 text-xs rounded-md border border-border bg-card text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Secret Key (if applicable)
              </label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Paste Secret Key here..."
                className="w-full h-9 px-3 text-xs rounded-md border border-border bg-card text-foreground"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProvider(null)}
                className="px-3.5 py-2 text-xs font-semibold rounded-md border border-border bg-card text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveConfigMutation.mutate()}
                disabled={saveConfigMutation.isPending}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                {saveConfigMutation.isPending ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
