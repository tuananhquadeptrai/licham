import type { CalendarEvent } from './events';
import type { FamilyProfile } from './profile';

export const BACKUP_VERSION = 1;

export interface BackupPayload {
  version: number;
  exportedAt: string;
  events: CalendarEvent[];
  profiles: FamilyProfile[];
  settings: {
    locale: string;
    theme: string;
  };
}
