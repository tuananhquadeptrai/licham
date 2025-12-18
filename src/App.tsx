import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { CalendarPage } from './components/calendar/CalendarPage';
import { SettingsModal } from './components/settings/SettingsModal';
import { BackupImportModal } from './components/backup';
import { useCalendarStore } from './store/useCalendarStore';
import { useBackupLinkBootstrap } from './hooks/useBackupLinkBootstrap';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const theme = useCalendarStore((state) => state.theme);
  const {
    pendingBackup,
    isModalOpen: isBackupImportOpen,
    handleClose: handleBackupClose,
    handleImportComplete: handleBackupImportComplete,
  } = useBackupLinkBootstrap();

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return (
    <Layout onOpenSettings={() => setIsSettingsOpen(true)}>
      <CalendarPage />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <BackupImportModal
        isOpen={isBackupImportOpen}
        payload={pendingBackup}
        onClose={handleBackupClose}
        onImportComplete={handleBackupImportComplete}
      />
    </Layout>
  );
}

export default App;
