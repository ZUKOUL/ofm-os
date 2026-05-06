'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  BarChart01,
  BookOpen01,
  Eye,
  Film02,
  Folder,
  Home01,
  LogOut01,
  MagicWand02,
  MessageChatCircle,
  Settings01,
  Target04,
  Users01,
  VideoRecorder,
} from '@untitledui/icons';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home01 },
  { separator: true, label: 'Sourcing' },
  { label: 'Models', href: '/models', icon: Users01 },
  { label: 'Templates', href: '/templates', icon: MessageChatCircle },
  { label: 'Questionnaires', href: '/questionnaires', icon: BookOpen01 },
  { separator: true, label: 'Knowledge Base' },
  { label: 'Niches', href: '/niches', icon: Target04 },
  { label: 'Différenciants', href: '/differenciants', icon: MagicWand02 },
  { label: 'Competitors', href: '/competitors', icon: Eye },
  { separator: true, label: 'Production' },
  { label: 'Content', href: '/content', icon: Film02 },
  { label: 'Video Tools', href: '/video-tools', icon: VideoRecorder },
  { separator: true, label: 'Analytics' },
  { label: 'Analytics', href: '/analytics', icon: BarChart01 },
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
    <aside className="flex h-full w-60 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight text-sidebar-foreground">
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
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
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
              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          )}
        >
          <Settings01 className="h-4 w-4" />
          Settings
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut01 className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
