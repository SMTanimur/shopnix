'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Save,
  CheckCircle2,
  Mail,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  Clock,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { PageHeader, FormSection, DashboardCard } from '../../../components';
import { useAuthStore } from '../../../stores/auth.store';
import { formatDate } from '@shopnix/utils';

const EMAIL_TEMPLATES: Record<string, { subject: string; body: string }> = {
  order_confirmation: {
    subject: 'Order Confirmed — Thank you for shopping with us!',
    body: 'Hello valued customer,\n\nYour order has been verified and confirmed by our operations desk. We are preparing your parcel for courier dispatch.\n\nThank you for choosing our store!',
  },
  courier_dispatch: {
    subject: 'Your Parcel Has Been Dispatched via Courier!',
    body: 'Hello,\n\nGreat news! Your order has been handed over to our nationwide courier partner. You will receive an SMS with your live tracking link shortly.\n\nKeep your COD amount ready upon delivery.',
  },
  invoice_receipt: {
    subject: 'Official Digital Invoice & Payment Receipt',
    body: 'Hello,\n\nPlease find your order summary and digital invoice confirmation from our store. Feel free to reply to this email if you need any assistance.',
  },
  custom: {
    subject: 'Important Update from Our Store',
    body: 'Hello,\n\nWe wanted to reach out regarding your recent interaction with our store.',
  },
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { organization, setOrganization, user } = useAuthStore();

  const [storeName, setStoreName] = useState(organization?.store_name || '');
  const [storePhone, setStorePhone] = useState(organization?.store_phone || '');
  const [storeEmail, setStoreEmail] = useState(organization?.store_email || '');
  const [addressLine, setAddressLine] = useState(
    organization?.store_address?.address_line || ''
  );
  const [city, setCity] = useState(organization?.store_address?.city || 'Dhaka');
  const [currency, setCurrency] = useState(organization?.settings?.currency || 'BDT');
  const [lowStockThreshold, setLowStockThreshold] = useState(
    organization?.settings?.low_stock_alert_threshold || 5
  );

  // Email Provider Connect State
  const [emailProvider, setEmailProvider] = useState<'smtp' | 'resend' | 'sendgrid'>('smtp');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [fromName, setFromName] = useState(organization?.store_name || 'Shopnix Store');
  const [fromEmail, setFromEmail] = useState(organization?.store_email || 'orders@shopnix.io');
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [emailApiKey, setEmailApiKey] = useState('');
  const [notifyNewOrder, setNotifyNewOrder] = useState(true);
  const [notifyCourier, setNotifyCourier] = useState(true);

  // Email Composer State
  const [recipientEmail, setRecipientEmail] = useState(user?.email || 'customer@example.com');
  const [selectedTemplate, setSelectedTemplate] = useState('order_confirmation');
  const [emailSubject, setEmailSubject] = useState(EMAIL_TEMPLATES.order_confirmation!.subject);
  const [emailBody, setEmailBody] = useState(EMAIL_TEMPLATES.order_confirmation!.body);

  const [isSaved, setIsSaved] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null);

  const { data: emailData, refetch: refetchEmailConfig } = useQuery({
    queryKey: ['organization-email-config'],
    queryFn: async () => {
      const res = await api.axios.get('/organizations/current/email-config');
      return res.data?.data;
    },
  });

  useEffect(() => {
    if (emailData?.email_config) {
      const cfg = emailData.email_config;
      setEmailProvider(cfg.provider || 'smtp');
      setEmailEnabled(cfg.enabled ?? true);
      setFromName(cfg.from_name || organization?.store_name || 'Shopnix Store');
      setFromEmail(cfg.from_email || organization?.store_email || 'orders@shopnix.io');
      setSmtpHost(cfg.smtp_host || 'smtp.gmail.com');
      setSmtpPort(cfg.smtp_port || 587);
      setSmtpUser(cfg.smtp_user || '');
      setSmtpPass(cfg.smtp_pass || '');
      setEmailApiKey(cfg.api_key || '');
      setNotifyNewOrder(cfg.notify_on_new_order ?? true);
      setNotifyCourier(cfg.notify_on_courier_dispatch ?? true);
    }
  }, [emailData, organization]);

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

  const saveEmailConfigMutation = useMutation({
    mutationFn: () =>
      api.axios.put('/organizations/current/email-config', {
        provider: emailProvider,
        enabled: emailEnabled,
        from_name: fromName,
        from_email: fromEmail,
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        smtp_user: smtpUser,
        smtp_pass: smtpPass,
        api_key: emailApiKey,
        notify_on_new_order: notifyNewOrder,
        notify_on_courier_dispatch: notifyCourier,
      }),
    onSuccess: () => {
      setEmailFeedback('Email provider connection saved and active!');
      setTimeout(() => setEmailFeedback(null), 3500);
      refetchEmailConfig();
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: () =>
      api.axios.post('/organizations/current/email-send', {
        to: recipientEmail,
        subject: emailSubject,
        template: selectedTemplate,
        body: emailBody,
      }),
    onSuccess: () => {
      setEmailFeedback(`Email dispatched to ${recipientEmail} successfully!`);
      setTimeout(() => setEmailFeedback(null), 4000);
      refetchEmailConfig();
      queryClient.invalidateQueries({ queryKey: ['top-nav-notifications'] });
    },
  });

  const handleTemplateChange = (tplKey: string) => {
    setSelectedTemplate(tplKey);
    const tpl = EMAIL_TEMPLATES[tplKey];
    if (tpl) {
      setEmailSubject(tpl.subject);
      setEmailBody(tpl.body);
    }
  };

  const emailLogs = emailData?.email_logs || [];

  return (
    <div className="space-y-6 pb-20 max-w-5xl">
      <PageHeader
        title="Store Profile, Email Connect & Notification Hub"
        description="Manage merchant profile, connect SMTP / Resend / SendGrid email providers, and dispatch customer emails."
        actions={
          <button
            type="button"
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold hover:opacity-95 transition-all shadow-md shadow-rose-500/20 cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            {updateMutation.isPending ? 'Saving...' : 'Save Store Profile'}
          </button>
        }
      />

      {isSaved && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/12 border border-emerald-500/25 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Store profile settings saved successfully.
        </div>
      )}

      {emailFeedback && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/12 border border-rose-500/25 text-rose-800 text-xs font-bold">
          <Sparkles className="h-4 w-4 text-rose-600" />
          {emailFeedback}
        </div>
      )}

      {/* Email Integration & Transactional Dispatch Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <DashboardCard
            title="Email Provider Connection (SMTP / Resend / SendGrid)"
            description="Connect your transactional email engine for order confirmations, invoices, and alerts"
            action={
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-700">
                <ShieldCheck className="h-3 w-3" />
                {emailProvider.toUpperCase()} Ready
              </span>
            }
          >
            <div className="space-y-4">
              {/* Provider Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'smtp', label: 'Custom SMTP' },
                  { id: 'resend', label: 'Resend API' },
                  { id: 'sendgrid', label: 'SendGrid' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setEmailProvider(p.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      emailProvider === p.id
                        ? 'border-rose-500 bg-rose-500/12 text-rose-700 shadow-2xs'
                        : 'border-rose-500/15 bg-white/60 text-muted-foreground hover:bg-rose-500/5'
                    }`}
                  >
                    <Server className="h-3.5 w-3.5" />
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Sender Name (From Name)
                  </label>
                  <input
                    type="text"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-rose-500/20 bg-white text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Sender Email (From Address)
                  </label>
                  <input
                    type="email"
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-rose-500/20 bg-white text-foreground"
                  />
                </div>
              </div>

              {emailProvider === 'smtp' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="w-full h-9 px-3 text-xs rounded-xl border border-rose-500/20 bg-white text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(Number(e.target.value) || 587)}
                      className="w-full h-9 px-3 text-xs rounded-xl border border-rose-500/20 bg-white text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      placeholder="orders@yourdomain.com"
                      className="w-full h-9 px-3 text-xs rounded-xl border border-rose-500/20 bg-white text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      SMTP App Password
                    </label>
                    <input
                      type="password"
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-9 px-3 text-xs rounded-xl border border-rose-500/20 bg-white text-foreground"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {emailProvider === 'resend' ? 'Resend API Key (re_...)' : 'SendGrid API Key (SG...)'}
                  </label>
                  <input
                    type="password"
                    value={emailApiKey}
                    onChange={(e) => setEmailApiKey(e.target.value)}
                    placeholder={
                      emailProvider === 'resend'
                        ? 're_123456789_abcdefghijklmnop'
                        : 'SG.xxxx.yyyy'
                    }
                    className="w-full h-9 px-3 text-xs rounded-xl border border-rose-500/20 bg-white text-foreground"
                  />
                </div>
              )}

              {/* Automated Email Triggers */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyNewOrder}
                    onChange={(e) => setNotifyNewOrder(e.target.checked)}
                    className="rounded border-rose-500 text-rose-600 focus:ring-rose-500"
                  />
                  Auto-send Order Confirmation Email
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyCourier}
                    onChange={(e) => setNotifyCourier(e.target.checked)}
                    className="rounded border-rose-500 text-rose-600 focus:ring-rose-500"
                  />
                  Auto-send Courier Tracking Email
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => saveEmailConfigMutation.mutate()}
                  disabled={saveEmailConfigMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {saveEmailConfigMutation.isPending ? 'Saving...' : 'Connect & Save Email Provider'}
                </button>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Live Transactional Email Composer */}
        <div className="lg:col-span-5">
          <DashboardCard
            title="Send Transactional / Customer Email"
            description="Dispatch order confirmations, courier updates, or custom emails immediately"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="buyer@example.com"
                  className="w-full h-9 px-3 text-xs rounded-xl border border-rose-500/20 bg-white text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Email Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full h-9 px-3 text-xs font-semibold rounded-xl border border-rose-500/20 bg-white text-foreground cursor-pointer"
                >
                  <option value="order_confirmation">Order Confirmation Template</option>
                  <option value="courier_dispatch">Courier Dispatched & Tracking</option>
                  <option value="invoice_receipt">Digital Invoice Receipt</option>
                  <option value="custom">Custom Merchant Message</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-xl border border-rose-500/20 bg-white text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Email Body
                </label>
                <textarea
                  rows={4}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-rose-500/20 bg-white text-foreground resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => sendEmailMutation.mutate()}
                disabled={sendEmailMutation.isPending || !recipientEmail}
                className="w-full inline-flex items-center justify-center gap-2 h-9 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer shadow-md shadow-rose-500/20 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {sendEmailMutation.isPending ? 'Dispatching Email...' : 'Send Email Now'}
              </button>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Recent Email Dispatch Log */}
      {emailLogs.length > 0 && (
        <DashboardCard
          title="Recent Email Delivery Logs"
          description="Real-time audit trail of transactional and customer emails sent from your organization"
        >
          <div className="overflow-x-auto -mx-5 -mb-5">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-500/6 border-y border-rose-500/12 uppercase font-extrabold text-slate-600">
                <tr>
                  <th className="px-4 py-2.5">Recipient</th>
                  <th className="px-4 py-2.5">Subject</th>
                  <th className="px-4 py-2.5">Template</th>
                  <th className="px-4 py-2.5">Provider</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-500/10">
                {emailLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-rose-500/4">
                    <td className="px-4 py-2.5 font-mono font-bold text-foreground">{log.to}</td>
                    <td className="px-4 py-2.5 font-medium text-foreground">{log.subject}</td>
                    <td className="px-4 py-2.5 capitalize text-muted-foreground">
                      {String(log.template || 'custom').replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-2.5 uppercase font-bold text-rose-600">
                      {log.provider}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Delivered
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(log.sent_at, 'short')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
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
              className="w-full h-9 px-3 text-sm rounded-xl border border-rose-500/20 bg-white text-foreground"
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
              className="w-full h-9 px-3 text-sm rounded-xl border border-rose-500/20 bg-white text-foreground"
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
              className="w-full h-9 px-3 text-sm rounded-xl border border-rose-500/20 bg-white text-foreground"
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
              className="w-full h-9 px-3 text-sm rounded-xl border border-rose-500/20 bg-white text-foreground"
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
            className="w-full h-9 px-3 text-sm rounded-xl border border-rose-500/20 bg-white text-foreground"
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
              className="w-full h-9 px-3 text-sm rounded-xl border border-rose-500/20 bg-white text-foreground cursor-pointer"
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
              className="w-full h-9 px-3 text-sm rounded-xl border border-rose-500/20 bg-white text-foreground tabular-nums"
            />
          </div>
        </div>
      </FormSection>
    </div>
  );
}
