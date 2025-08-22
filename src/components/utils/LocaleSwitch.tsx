'use client';

import { usePathname, useRouter } from '@/lib/routing';
import { locales } from '@/config';
import { useLocale } from 'next-intl';
import { ChangeEvent } from 'react';

const localeNames: Record<string, string> = {
  "en": "EN",
  "it": "IT",
};

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  function changeLocale(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as typeof locales[number];
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div>
      <select
        value={locale}
        onChange={changeLocale}
        className="bg-transparent"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc} className='dark:text-black'>
            {localeNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}