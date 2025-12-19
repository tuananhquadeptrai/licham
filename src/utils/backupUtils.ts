import { useEventStore } from '../store/useEventStore';
import { useProfileStore } from '../store/useProfileStore';
import { useCalendarStore } from '../store/useCalendarStore';
import { BACKUP_VERSION, type BackupPayload } from '../types/backup';

export function createBackupPayload(): BackupPayload {
  const events = useEventStore.getState().events;
  const profiles = useProfileStore.getState().profiles;
  const { locale, theme } = useCalendarStore.getState();

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    events,
    profiles,
    settings: {
      locale,
      theme,
    },
  };
}

export function parseBackupJson(json: string): BackupPayload {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error('Không thể đọc file backup. File không đúng định dạng JSON.');
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Dữ liệu backup không hợp lệ.');
  }

  const payload = data as Record<string, unknown>;

  if (typeof payload.version !== 'number') {
    throw new Error('Thiếu thông tin phiên bản backup.');
  }

  if (payload.version > BACKUP_VERSION) {
    throw new Error(
      `Phiên bản backup (${payload.version}) mới hơn phiên bản ứng dụng (${BACKUP_VERSION}). Vui lòng cập nhật ứng dụng.`
    );
  }

  if (!Array.isArray(payload.events)) {
    throw new Error('Dữ liệu sự kiện không hợp lệ.');
  }

  if (!Array.isArray(payload.profiles)) {
    throw new Error('Dữ liệu hồ sơ không hợp lệ.');
  }

  if (!payload.settings || typeof payload.settings !== 'object') {
    throw new Error('Dữ liệu cài đặt không hợp lệ.');
  }

  return payload as unknown as BackupPayload;
}

export function downloadBackupFile(payload: BackupPayload): void {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split('T')[0];
  const filename = `lich-am-backup-${date}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function readBackupFile(file: File): Promise<BackupPayload> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.json')) {
      reject(new Error('Vui lòng chọn file .json'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') {
          throw new Error('Không thể đọc file.');
        }
        const payload = parseBackupJson(content);
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => {
      reject(new Error('Lỗi khi đọc file.'));
    };
    reader.readAsText(file);
  });
}
