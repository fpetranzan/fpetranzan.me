import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, pathnames } from './lib/i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  pathnames,
  localePrefix: 'always',
  // Disable cookie storage to avoid saving locale preferences
  localeDetection: false
});

export const config = {
  matcher: [
    '/',
    '/(en|it)/:path*',
    "/((?!api|_next|_vercel|admin|.*\\..*).*)",
  ]
};