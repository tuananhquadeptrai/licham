import { useCallback } from 'react';
import { useEventStore } from '../store/useEventStore';
import { useProfileStore } from '../store/useProfileStore';
import { useCalendarStore } from '../store/useCalendarStore';
import type { BackupPayload } from '../types/backup';
import type { Locale, Theme } from '../store/useCalendarStore';

export interface HydrateOptions {
  merge: boolean;
}

export function useBackupImport() {
  const addEventsBulk = useEventStore((s) => s.addEventsBulk);
  const setLocale = useCalendarStore((s) => s.setLocale);
  const setTheme = useCalendarStore((s) => s.setTheme);

  const hydrateFromBackup = useCallback(
    (payload: BackupPayload, options: HydrateOptions) => {
      const eventStore = useEventStore.getState();
      const profileStore = useProfileStore.getState();

      if (options.merge) {
        addEventsBulk(payload.events, true);

        for (const profile of payload.profiles) {
          const exists = profileStore.profiles.some(
            (p) =>
              p.name === profile.name &&
              p.birthYear === profile.birthYear &&
              p.gender === profile.gender
          );
          if (!exists) {
            profileStore.addProfile({
              name: profile.name,
              birthYear: profile.birthYear,
              birthMonth: profile.birthMonth,
              birthDay: profile.birthDay,
              gender: profile.gender,
              relationship: profile.relationship,
            });
          }
        }
      } else {
        useEventStore.setState({ events: payload.events });
        useProfileStore.setState({
          profiles: payload.profiles,
          selectedProfileId: null,
        });
      }

      if (payload.settings.locale) {
        setLocale(payload.settings.locale as Locale);
      }
      if (payload.settings.theme) {
        setTheme(payload.settings.theme as Theme);
      }
    },
    [addEventsBulk, setLocale, setTheme]
  );

  return { hydrateFromBackup };
}
