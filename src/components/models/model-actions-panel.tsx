'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  addNote,
  killModel,
  markAsDMSent,
  markAsResponded,
  markCallDone,
  markQuestionnaireReceived,
  putOnHold,
  scheduleCall,
  sendQuestionnaire,
  signModel,
} from '@/app/(app)/models/actions';

type Model = {
  id: string;
  status: string;
};

const killReasons = [
  { value: 'no_response', label: 'No response' },
  { value: 'no_questionnaire_returned', label: 'No questionnaire returned' },
  { value: 'tally_fail_disponibility', label: 'Tally fail: disponibility' },
  { value: 'tally_fail_limits', label: 'Tally fail: limits' },
  { value: 'tally_fail_ai_consent', label: 'Tally fail: AI consent' },
  { value: 'tally_fail_multi_account', label: 'Tally fail: multi account' },
  { value: 'tally_fail_expectations', label: 'Tally fail: expectations' },
  { value: 'tally_fail_previous_agencies', label: 'Tally fail: previous agencies' },
  { value: 'call_no_show', label: 'Call: no show' },
  { value: 'call_no_element_differentiel', label: 'Call: no element diff' },
  { value: 'call_bad_face_cam', label: 'Call: bad face cam' },
  { value: 'call_no_compat_perso', label: 'Call: no personal compat' },
  { value: 'call_bad_matos', label: 'Call: bad matos' },
  { value: 'decision_other', label: 'Other' },
];

export function ModelActionsPanel({ model }: { model: Model }) {
  const [note, setNote] = useState('');
  const [killReason, setKillReason] = useState('');
  const [callDate, setCallDate] = useState('');
  const [loading, setLoading] = useState(false);

  async function action(fn: () => Promise<any>) {
    setLoading(true);
    try {
      await fn();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase text-muted-foreground">Actions</h3>

      {model.status === 'to_dm' && (
        <Button
          className="w-full"
          onClick={() => action(() => markAsDMSent(model.id))}
          disabled={loading}
        >
          Mark DM Sent
        </Button>
      )}

      {model.status === 'dm_sent' && (
        <Button
          className="w-full"
          onClick={() => action(() => markAsResponded(model.id))}
          disabled={loading}
        >
          Mark Responded
        </Button>
      )}

      {model.status === 'responded' && (
        <Button
          className="w-full"
          onClick={() => action(() => sendQuestionnaire(model.id))}
          disabled={loading}
        >
          Send Questionnaire
        </Button>
      )}

      {model.status === 'questionnaire_sent' && (
        <Button
          className="w-full"
          onClick={() => action(() => markQuestionnaireReceived(model.id))}
          disabled={loading}
        >
          Questionnaire Received
        </Button>
      )}

      {model.status === 'questionnaire_received' && (
        <div className="space-y-2">
          <Label>Call Date</Label>
          <Input type="date" value={callDate} onChange={(e) => setCallDate(e.target.value)} />
          <Button
            className="w-full"
            onClick={() => action(() => scheduleCall(model.id, callDate))}
            disabled={loading || !callDate}
          >
            Schedule Call
          </Button>
        </div>
      )}

      {model.status === 'call_scheduled' && (
        <form
          action={async (fd) => {
            setLoading(true);
            await markCallDone(model.id, fd);
            setLoading(false);
          }}
          className="space-y-3"
        >
          <div className="space-y-1">
            <Label>Face Cam</Label>
            <select name="faceCamNatural" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
              <option value="good">Good</option>
              <option value="ok">OK</option>
              <option value="bad">Bad</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label>Personal Compat</Label>
            <select name="personalCompat" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="matosVerified" value="true" id="matos" />
            <Label htmlFor="matos">Matos verified</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="elementDifferentielConfirmed" value="true" id="edconf" />
            <Label htmlFor="edconf">Element diff confirmed</Label>
          </div>
          <div className="space-y-1">
            <Label>Call Notes</Label>
            <Textarea name="notesCall" rows={3} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            Mark Call Done
          </Button>
        </form>
      )}

      {model.status === 'call_done' && (
        <div className="space-y-2">
          <Button
            className="w-full"
            variant="default"
            onClick={() => action(() => signModel(model.id))}
            disabled={loading}
          >
            Sign Model
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => action(() => putOnHold(model.id, 'Need more time to decide'))}
            disabled={loading}
          >
            Put On Hold
          </Button>
        </div>
      )}

      {model.status === 'on_hold' && (
        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={() => action(() => signModel(model.id))}
            disabled={loading}
          >
            Sign Model
          </Button>
        </div>
      )}

      {!['signed', 'killed'].includes(model.status) && (
        <div className="space-y-2 border-t pt-4">
          <Label>Kill Reason</Label>
          <select
            value={killReason}
            onChange={(e) => setKillReason(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          >
            <option value="">Select reason...</option>
            {killReasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => action(() => killModel(model.id, killReason))}
            disabled={loading || !killReason}
          >
            Kill
          </Button>
        </div>
      )}

      <div className="space-y-2 border-t pt-4">
        <Label>Add Note</Label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Quick note..."
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={async () => {
            if (!note.trim()) return;
            await action(() => addNote(model.id, note));
            setNote('');
          }}
          disabled={loading || !note.trim()}
        >
          Save Note
        </Button>
      </div>
    </div>
  );
}
