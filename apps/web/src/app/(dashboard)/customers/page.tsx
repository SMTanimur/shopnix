'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ShieldCheck, Phone, Mail } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Customer } from '@shopnix/types';
import { api } from '../../../lib/api';
import {
  PageHeader,
  DataTable,
  SearchInput,
  Pagination,
} from '../../../components';
import { formatCurrency, formatDate } from '@shopnix/utils';

function resolveCustomerId(customer: Customer): string {
  return customer.id || (customer as any)._id || '';
}

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [highRiskFilter, setHighRiskFilter] = useState<boolean | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['customers', { page, search, is_high_risk: highRiskFilter }],
    queryFn: () =>
      api.customers.list({
        page,
        limit: 10,
        search: search || undefined,
        is_high_risk: highRiskFilter,
      }),
  });

  const customers = data?.data || [];
  const meta = data?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
    has_next_page: false,
    has_prev_page: false,
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: 'Customer Name',
      cell: ({ row }) => {
        const { name, phone_number, email } = row.original;
        const cid = resolveCustomerId(row.original);
        return (
          <div>
            {cid ? (
              <Link
                href={`/customers/${cid}`}
                className="font-bold text-foreground hover:text-primary hover:underline"
              >
                {name}
              </Link>
            ) : (
              <span className="font-bold text-foreground">{name}</span>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-0.5">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-rose-500" />
                {phone_number}
              </span>
              {email && (
                <span className="flex items-center gap-1 font-sans">
                  <Mail className="h-3 w-3" />
                  {email}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'total_spent',
      header: 'Lifetime Value (LTV)',
      cell: ({ row }) => (
        <span className="font-bold tabular-nums text-foreground">
          {formatCurrency(row.original.total_spent)}
        </span>
      ),
    },
    {
      accessorKey: 'total_orders',
      header: 'Orders Record',
      cell: ({ row }) => {
        const { total_orders, completed_orders, returned_orders } = row.original;
        return (
          <div className="text-xs space-y-0.5">
            <div>
              <span className="font-semibold text-foreground">{total_orders} total</span> (
              {completed_orders} delivered)
            </div>
            {returned_orders > 0 && (
              <div className="text-rose-600 font-medium">{returned_orders} returned</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'is_high_risk',
      header: 'Fraud & Return Risk',
      cell: ({ row }) => {
        const isHighRisk = row.original.is_high_risk;
        return isHighRisk ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/12 text-rose-700 border border-rose-500/25">
            <AlertTriangle className="h-3 w-3" />
            High Return Risk
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/12 text-emerald-700 border border-emerald-500/25">
            <ShieldCheck className="h-3 w-3" />
            Good Standing
          </span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Customer Since',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.created_at, 'short')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Intelligence (CRM)"
        description="Customer directory, lifetime value metrics, purchase volume, and COD return risk detection."
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl glass-card">
          <button
            type="button"
            onClick={() => setHighRiskFilter(undefined)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              highRiskFilter === undefined
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Customers
          </button>
          <button
            type="button"
            onClick={() => setHighRiskFilter(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              highRiskFilter === true
                ? 'bg-rose-600 text-white shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            High Risk Flagged
          </button>
        </div>

        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by customer name, phone, or email..."
          className="w-full sm:w-80"
        />
      </div>

      <DataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        onRowClick={(c) => {
          const cid = resolveCustomerId(c);
          if (cid && cid !== 'undefined') {
            router.push(`/customers/${cid}`);
          }
        }}
        emptyTitle="No customer profiles found"
        emptyDescription="Customer records are auto-compiled when buyers create orders."
      />

      {meta.total_pages > 1 && (
        <Pagination meta={meta} onPageChange={(newPage) => setPage(newPage)} />
      )}
    </div>
  );
}
