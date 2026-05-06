import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
  to_dm: { label: 'To DM', className: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  dm_sent: { label: 'DM Sent', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  responded: {
    label: 'Responded',
    className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
  questionnaire_sent: {
    label: 'Quest. Sent',
    className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  questionnaire_received: {
    label: 'Quest. Received',
    className: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  },
  call_scheduled: {
    label: 'Call Scheduled',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  call_done: {
    label: 'Call Done',
    className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  signed: { label: 'Signed', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  on_hold: {
    label: 'On Hold',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  killed: { label: 'Killed', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
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
  S: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  A: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  B: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  C: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  unknown: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
};

export function TierBadge({ tier }: { tier: string }) {
  return (
    <Badge variant="outline" className={cn('text-xs font-bold', tierColors[tier] ?? '')}>
      {tier === 'unknown' ? '?' : tier}
    </Badge>
  );
}
