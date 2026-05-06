'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  BarChart3,
  BookOpen,
  Eye,
  Film,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { separator: true, label: 'Sourcing' },
  { label: 'Models', href: '/models', icon: Users },
  { label: 'Templates', href: '/templates', icon: MessageSquare },
  { label: 'Questionnaires', href: '/questionnaires', icon: BookOpen },
  { separator: true, label: 'Knowledge Base' },
  { label: 'Niches', href: '/niches', icon: FolderOpen },
  { label: 'Différenciants', href: '/differenciants', icon: Sparkles },
  { label: 'Competitors', href: '/competitors', icon: Eye },
  { separator: true, label: 'Production' },
  { label: 'Content', href: '/content', icon: Film },
  { label: 'Video Tools', href: '/video-tools', icon: Video },
  { separator: true, label: 'Analytics' },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-neutral-950">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight">
          OFM-OS
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item, i) => {
            if ('separator' in item && item.separator) {
              return (
                <p key={i} className="mt-4 mb-1 px-3 text-xs font-semibold uppercase text-muted-foreground">
                  {item.label}
                </p>
              );
            }
            if (!('href' in item)) return null;
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-neutral-800 text-white'
                    : 'text-muted-foreground hover:bg-neutral-900 hover:text-white',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-t p-3">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
            pathname === '/settings'
              ? 'bg-neutral-800 text-white'
              : 'text-muted-foreground hover:bg-neutral-900 hover:text-white',
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 w-full justify-start gap-3 text-muted-foreground hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
