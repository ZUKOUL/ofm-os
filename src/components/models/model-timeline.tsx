'use client';

import { formatDistanceToNow } from '@/lib/utils';

type Activity = {
  id: string;
  type: string;
  content: string | null;
  createdAt: Date;
};

const typeIcons: Record<string, string> = {
  dm_sent: '📤',
  response_received: '📥',
  questionnaire_sent: '📋',
  questionnaire_received: '✅',
  call_scheduled: '📅',
  call_done: '📞',
  note: '📝',
  status_change: '🔄',
  photo_uploaded: '📷',
};

export function ModelTimeline({ activities }: { activities: Activity[] }) {
  if (!activities.length) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>;
  }

  return (
    <div className="space-y-3">
      {activities.map((a) => (
        <div key={a.id} className="flex gap-3 text-sm">
          <span className="mt-0.5 text-base">{typeIcons[a.type] ?? '•'}</span>
          <div className="flex-1">
            <p>{a.content || a.type.replace(/_/g, ' ')}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(a.createdAt))}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
