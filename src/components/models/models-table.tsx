'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { AlertTriangle, ArrowUpDown, Eye, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge, TierBadge } from './status-badge';

type Model = {
  id: string;
  name: string;
  pseudoHandle: string | null;
  platformSource: string;
  status: string;
  estimatedTier: string;
  elementDifferentiel: any;
  followersCount: number | null;
  geoCountry: string | null;
  createdAt: Date;
  updatedAt: Date;
  decision: string | null;
};

function isDanger(model: Model) {
  const now = Date.now();
  const updated = new Date(model.updatedAt).getTime();
  const daysSince = (now - updated) / (1000 * 60 * 60 * 24);
  if (model.status === 'dm_sent' && daysSince >= 5) return true;
  if (model.status === 'questionnaire_sent' && daysSince >= 3) return true;
  return false;
}

const columns: ColumnDef<Model>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {isDanger(row.original) && (
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
        )}
        <div>
          <p className="font-medium">{row.original.name}</p>
          {row.original.pseudoHandle && (
            <p className="text-xs text-muted-foreground">@{row.original.pseudoHandle}</p>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'platformSource',
    header: 'Platform',
    cell: ({ getValue }) => (
      <span className="text-xs capitalize">{(getValue() as string).replace('_', ' ')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
  },
  {
    accessorKey: 'estimatedTier',
    header: 'Tier',
    cell: ({ getValue }) => <TierBadge tier={getValue() as string} />,
  },
  {
    accessorKey: 'elementDifferentiel',
    header: 'Élément Diff.',
    cell: ({ getValue }) => {
      const ed = getValue() as any;
      if (!ed?.description) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="max-w-[200px] truncate text-xs">{ed.description}</span>
      );
    },
  },
  {
    accessorKey: 'followersCount',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Followers
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ getValue }) => {
      const v = getValue() as number | null;
      if (v == null) return <span className="text-muted-foreground">—</span>;
      return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Added
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ getValue }) =>
      new Date(getValue() as string).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
      }),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/models/${row.original.id}`}>
        <Button variant="ghost" size="icon-sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

const allStatuses = [
  'to_dm',
  'dm_sent',
  'responded',
  'questionnaire_sent',
  'questionnaire_received',
  'call_scheduled',
  'call_done',
  'signed',
  'on_hold',
  'killed',
];

const allPlatforms = [
  'twitter',
  'reddit',
  'modelmayhem',
  'instagram',
  'tiktok',
  'fanvue',
  'other',
];

export function ModelsTable({
  data,
  total,
  page,
  pageSize,
}: {
  data: Model[];
  total: number;
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const totalPages = Math.ceil(total / pageSize);

  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      params.delete('page');
      router.push(`/models?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search name or handle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateFilters({ search: search || undefined });
          }}
          className="w-64"
        />
        <Select
          value={searchParams.get('status') ?? ''}
          onValueChange={(v) => updateFilters({ status: v === 'all' ? undefined : v ?? undefined })}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {allStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={searchParams.get('platform') ?? ''}
          onValueChange={(v) => updateFilters({ platform: v === 'all' ? undefined : v ?? undefined })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All platforms</SelectItem>
            {allPlatforms.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <Link href="/models/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Model
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No models found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {total} model{total !== 1 ? 's' : ''} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', String(page - 1));
                router.push(`/models?${params.toString()}`);
              }}
            >
              Previous
            </Button>
            <span className="flex items-center text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', String(page + 1));
                router.push(`/models?${params.toString()}`);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
