'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateModel } from '@/app/(app)/models/actions';

type Model = {
  id: string;
  name: string;
  pseudoHandle: string | null;
  platformSource: string;
  profileUrl: string | null;
  followersCount: number | null;
  hasExistingContent: boolean | null;
  visiblePhoneQuality: string | null;
  estimatedTier: string | null;
  geoCountry: string | null;
  nationality: string | null;
  age: number | null;
};

function InlineField({
  label,
  value,
  name,
  modelId,
  type = 'text',
}: {
  label: string;
  value: string | number | null;
  name: string;
  modelId: string;
  type?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value?.toString() ?? '');

  async function save() {
    setEditing(false);
    const fd = new FormData();
    fd.set('id', modelId);
    fd.set(name, val);
    await updateModel(fd);
  }

  if (editing) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <input
          type={type}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          autoFocus
          className="w-full rounded border border-input bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer space-y-1 rounded px-2 py-1 transition-colors hover:bg-muted/50"
      onClick={() => setEditing(true)}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value ?? '—'}</p>
    </div>
  );
}

function InlineSelect({
  label,
  value,
  name,
  modelId,
  options,
}: {
  label: string;
  value: string | null;
  name: string;
  modelId: string;
  options: { value: string; label: string }[];
}) {
  async function handleChange(newVal: string) {
    const fd = new FormData();
    fd.set('id', modelId);
    fd.set(name, newVal);
    await updateModel(fd);
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <select
        value={value ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded border border-input bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ModelDetailFields({ model }: { model: Model }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <InlineField label="Name" value={model.name} name="name" modelId={model.id} />
          <InlineField
            label="Handle"
            value={model.pseudoHandle}
            name="pseudoHandle"
            modelId={model.id}
          />
          <InlineField
            label="Profile URL"
            value={model.profileUrl}
            name="profileUrl"
            modelId={model.id}
          />
          <InlineField
            label="Followers"
            value={model.followersCount}
            name="followersCount"
            modelId={model.id}
            type="number"
          />
          <InlineField
            label="Country"
            value={model.geoCountry}
            name="geoCountry"
            modelId={model.id}
          />
          <InlineField
            label="Nationality"
            value={model.nationality}
            name="nationality"
            modelId={model.id}
          />
          <InlineField
            label="Age"
            value={model.age}
            name="age"
            modelId={model.id}
            type="number"
          />
          <InlineSelect
            label="Tier"
            value={model.estimatedTier}
            name="estimatedTier"
            modelId={model.id}
            options={[
              { value: 'unknown', label: '?' },
              { value: 'S', label: 'S' },
              { value: 'A', label: 'A' },
              { value: 'B', label: 'B' },
              { value: 'C', label: 'C' },
            ]}
          />
          <InlineSelect
            label="Platform"
            value={model.platformSource}
            name="platformSource"
            modelId={model.id}
            options={[
              { value: 'instagram', label: 'Instagram' },
              { value: 'twitter', label: 'Twitter' },
              { value: 'reddit', label: 'Reddit' },
              { value: 'tiktok', label: 'TikTok' },
              { value: 'modelmayhem', label: 'Model Mayhem' },
              { value: 'fanvue', label: 'Fanvue' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <InlineSelect
            label="Phone Quality"
            value={model.visiblePhoneQuality}
            name="visiblePhoneQuality"
            modelId={model.id}
            options={[
              { value: 'unknown', label: 'Unknown' },
              { value: 'iphone_recent', label: 'iPhone Recent' },
              { value: 'iphone_old', label: 'iPhone Old' },
              { value: 'android_premium', label: 'Android Premium' },
              { value: 'low_quality', label: 'Low Quality' },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
