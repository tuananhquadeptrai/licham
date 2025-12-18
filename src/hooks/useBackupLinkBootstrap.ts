import { useState, useEffect } from 'react';
import { getBackupFromCurrentUrl, clearBackupHash } from '../utils/shareLink';
import type { BackupPayload } from '../types/backup';

export function useBackupLinkBootstrap() {
  const [pendingBackup, setPendingBackup] = useState<BackupPayload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const backup = getBackupFromCurrentUrl();
    if (backup) {
      setPendingBackup(backup);
      setIsModalOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    setPendingBackup(null);
    clearBackupHash();
  };

  const handleImportComplete = () => {
    setIsModalOpen(false);
    setPendingBackup(null);
    clearBackupHash();
  };

  return {
    pendingBackup,
    isModalOpen,
    handleClose,
    handleImportComplete,
  };
}
