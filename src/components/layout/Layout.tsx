import type { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  onOpenSettings?: () => void;
}

export function Layout({ children, onOpenSettings }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header onOpenSettings={onOpenSettings} />
      <main className="flex-1 container mx-auto px-3 py-4 md:px-4 md:py-6 max-w-7xl">
        {children}
      </main>
      <footer className="py-3 md:py-4 text-center text-xs md:text-sm text-gray-500 border-t dark:text-gray-400 dark:border-gray-700">
        <p>Lịch Âm Việt Nam © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
