'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Store, User, Shield, CheckCircle2 } from 'lucide-react';
import { api } from '../../../lib/api';
import { PageHeader, FormSection } from '../../../components';
import { useAuthStore } from '../../../stores/auth.store';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { organization, setOrganization, user } = useAuthStore();

  const [storeName, setStoreName] = useState(organization?.store_name || '');
  const [storePhone, setStorePhone] = useState(organization?.store_phone || '');
  const [storeEmail, setStoreEmail] = useState(organization?.store_email || '');
  const [addressLine, setAddressLine] = useState(organization?.store_address?.address_line || '');
  const [city, setCity] = useState(organization?.store_address?.city || 'Dhaka');
  const [currency, setCurrency] = useState(organization?.settings?.currency || 'BDT');
  const [lowStockThreshold, setLowStockThreshold] = useState(
    organization?.settings?.low_stock_alert_threshold || 5
  );

  const [isSaved, setIsSaved] = useState(false);

  const updateMutation = useMutation({
    mutationFn: () =>
      api.axios.patch('/organizations/current', {
        store_name: storeName,
        store_phone: storePhone,
        store_email: storeEmail,
        settings: {
          currency,
          low_stock_alert_threshold: lowStockThreshold,
        },
      }),
    onSuccess: (res) => {
      setOrganization(res.data.data);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      queryClient.invalidateQueries({ queryKey: ['current-organization'] });
    },
  });

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      <PageHeader
        title="Store & Organization Settings"
        description="Manage merchant profile, contact info, default currency, and operational thresholds."
        actions={
          <button
            type="button"
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        }
      />

      {isSaved && (
        <div className="flex items-center gap-2 p-3.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4" />
          Settings saved successfully.
        </div>
      )}

      {/* Store Profile Section */}
      <FormSection
        title="Store Profile & Merchant Details"
        description="Appears on customer invoices and courier packing slips."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Store Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Store Contact Phone
            </label>
            <input
              type="text"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Public Store Email
            </label>
            <input
              type="email"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
              className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Warehouse Pickup City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">
            Pickup Address Line
          </label>
          <input
            type="text"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground"
          />
        </div>
      </FormSection>

      {/* Preferences Section */}
      <FormSection
        title="Regional & Stock Preferences"
        description="Set default store currency and inventory reorder alert levels."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Operating Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground cursor-pointer"
            >
              <option value="BDT">BDT (Bangladeshi Taka - ৳)</option>
              <option value="USD">USD (US Dollar - $)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Global Low Stock Alert Threshold
            </label>
            <input
              type="number"
              min="1"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10) || 5)}
              className="w-full h-9 px-3 text-sm rounded-md border border-border bg-card text-foreground tabular-nums"
            />
          </div>
        </div>
      </FormSection>

      {/* Account Info */}
      <FormSection
        title="Your Team Account"
        description="Role-based permissions assigned to your user account."
      >
        <div className="p-4 rounded-md border border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
              {user?.first_name[0]}
              {user?.last_name[0]}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase">
              {user?.role}
            </span>
          </div>
        </div>
      </FormSection>
    </div>
  );
}
