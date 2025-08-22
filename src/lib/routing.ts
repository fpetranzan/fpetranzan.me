import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { locales, defaultLocale, pathnames } from '@/config';

export const { Link, redirect, usePathname, useRouter, getPathname } = createLocalizedPathnamesNavigation({
  locales,
  pathnames,
  localePrefix: 'always'
});