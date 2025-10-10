'use client';

import {useTranslations} from 'next-intl';
import { FaExternalLinkAlt } from 'react-icons/fa';

export default function HomePage() {
  const t = useTranslations('home');

  // Get links from translations (if available)
  const links = t.raw('links') as Record<string, string> | undefined;

  // Create dynamic tag renderers for each link
  const tagRenderers = links
    ? Object.entries(links).reduce((acc, [key, url]) => {
        acc[key] = (chunks: any) => (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="items-baseline gap-1 underline break-words"
          >
            <span className="break-words">{chunks}</span>
          </a>
        );
        return acc;
      }, {} as Record<string, (chunks: any) => JSX.Element>)
    : {};

  return (<>
    <div>
      <p className="text-xl mb-3 sm:mb-5 sm:text-2xl">{t('title')}</p>
      {t.rich('content', {
        p: (chunks) => <p className='my-2 text-sm sm:my-3 sm:text-base'>{chunks}</p>,
        linkIcon: () => <FaExternalLinkAlt className="inline text-xs"/>,
        ...tagRenderers
      })}
    </div>
  </>);
}