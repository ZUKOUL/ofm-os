import { MobileSidebar } from '@/components/shared/mobile-sidebar';
import { Sidebar } from '@/components/shared/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b px-4 md:hidden">
          <MobileSidebar />
          <span className="ml-2 text-lg font-bold">OFM-OS</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
