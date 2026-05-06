import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
  to_dm: { label: 'To DM', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  dm_sent: { label: 'DM Sent', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  responded: { label: 'Responded', className: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  questionnaire_sent: { label: 'Quest. Sent', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  questionnaire_received: { label: 'Quest. Received', className: 'bg-violet-50 text-violet-700 border-violet-200' },
  call_scheduled: { label: 'Call Scheduled', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  call_done: { label: 'Call Done', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  signed: { label: 'Signed', className: 'bg-green-50 text-green-700 border-green-200' },
  on_hold: { label: 'On Hold', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  killed: { label: 'Killed', className: 'bg-red-50 text-red-700 border-red-200' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, className: '' };
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}

const tierColors: Record<string, string> = {
  S: 'bg-amber-50 text-amber-700 border-amber-300',
  A: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  B: 'bg-blue-50 text-blue-700 border-blue-300',
  C: 'bg-slate-100 text-slate-600 border-slate-300',
  unknown: 'bg-neutral-100 text-neutral-500 border-neutral-300',
};

export function TierBadge({ tier }: { tier: string }) {
  return (
    <Badge variant="outline" className={cn('text-xs font-bold', tierColors[tier] ?? '')}>
      {tier === 'unknown' ? '?' : tier}
    </Badge>
  );
}
