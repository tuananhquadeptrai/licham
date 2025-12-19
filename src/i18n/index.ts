import { vi, type Translations } from './vi';
import { en } from './en';

export type Locale = 'vi' | 'en';

const translations: Record<Locale, Translations> = {
  vi,
  en,
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.vi;
}

export function t(locale: Locale, key: string): string {
  const trans = getTranslations(locale);
  const keys = key.split('.');
  let result: unknown = trans;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  
  return typeof result === 'string' ? result : key;
}

export { vi, en };
export type { Translations };
