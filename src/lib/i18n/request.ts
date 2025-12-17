import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';
import { getContentForLocale } from '../content';

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({requestLocale}) => {
 
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }
 
  try {
    const messages = await getContentForLocale(locale);
    return {
      locale,
      messages
    };
  } catch (error) {
    console.error(`Failed to load content for locale ${locale}:`, error);
    const messages = await getContentForLocale(defaultLocale);
    return {
      locale: defaultLocale,
      messages
    };
  }
});