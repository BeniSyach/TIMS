import ar from '@/translations/ar.json';
import en from '@/translations/en.json';
import id from '@/translations/id.json';

export const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
  id: {
    translation: id,
  },
};

export type Language = keyof typeof resources;
