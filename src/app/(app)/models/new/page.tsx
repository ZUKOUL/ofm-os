'use client';

import { useRouter } from 'next/navigation';
import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createModel } from '../actions';

const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'modelmayhem', label: 'Model Mayhem' },
  { value: 'fanvue', label: 'Fanvue' },
  { value: 'other', label: 'Other' },
];

const edCategories = [
  { value: 'physical_trait', label: 'Physical Trait' },
  { value: 'makeup_hair', label: 'Makeup / Hair' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'behavior', label: 'Behavior' },
  { value: 'setting', label: 'Setting' },
];

export default function NewModelPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Add Model</h1>
      <form action={createModel} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" required placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pseudoHandle">Handle</Label>
                <Input id="pseudoHandle" name="pseudoHandle" placeholder="@handle" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platformSource">Platform *</Label>
                <select
                  id="platformSource"
                  name="platformSource"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue="instagram"
                >
                  {platforms.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="followersCount">Followers</Label>
                <Input
                  id="followersCount"
                  name="followersCount"
                  type="number"
                  min={0}
                  placeholder="10000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileUrl">Profile URL</Label>
              <Input
                id="profileUrl"
                name="profileUrl"
                type="url"
                placeholder="https://instagram.com/handle"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Élément Différentiel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ed_category">Category</Label>
              <select
                id="ed_category"
                name="ed_category"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">None</option>
                {edCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ed_description">Description</Label>
              <Textarea
                id="ed_description"
                name="ed_description"
                placeholder="What makes this model stand out visually..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            Create Model
          </Button>
        </div>
      </form>
    </div>
  );
}
