export type Language = 'fr' | 'en';

export interface Translation {
  fr: string;
  en: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}
