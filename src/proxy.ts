import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, pathnames } from './lib/i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  pathnames,
  localePrefix: 'always',
  localeDetection: false
});

export default intlMiddleware;

export const config = {
  matcher: [
    '/',
    '/(en|it)/:path*',
    "/((?!api|_next|_vercel|admin|.*\\..*).*)",
  ]
};