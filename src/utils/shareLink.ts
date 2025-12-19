import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { parseBackupJson } from './backupUtils';
import { BACKUP_VERSION, type BackupPayload } from '../types/backup';

const SHARE_PREFIX = 'backup=';
const MAX_URL_LENGTH = 2000;

export function encodeBackupToHash(payload: BackupPayload): string {
  const json = JSON.stringify(payload);
  const compressed = compressToEncodedURIComponent(json);
  return SHARE_PREFIX + compressed;
}

export function decodeBackupFromHash(hash: string): BackupPayload | null {
  try {
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
    
    if (!cleanHash.startsWith(SHARE_PREFIX)) {
      return null;
    }

    const compressed = cleanHash.slice(SHARE_PREFIX.length);
    const json = decompressFromEncodedURIComponent(compressed);

    if (!json) {
      return null;
    }

    return parseBackupJson(json);
  } catch {
    return null;
  }
}

export interface ShareUrlResult {
  url: string;
  isLong: boolean;
  charCount: number;
}

export function buildBackupShareUrl(payload: BackupPayload): ShareUrlResult {
  const hash = encodeBackupToHash(payload);
  const baseUrl = window.location.origin + window.location.pathname;
  const url = `${baseUrl}#${hash}`;

  return {
    url,
    isLong: url.length > MAX_URL_LENGTH,
    charCount: url.length,
  };
}

export function getBackupFromCurrentUrl(): BackupPayload | null {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) {
    return null;
  }
  return decodeBackupFromHash(hash);
}

export function clearBackupHash(): void {
  if (window.location.hash.includes(SHARE_PREFIX)) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}
