import ExperiencesPage from '@/components/pages/ExperiencesPage';
import Props from '@/components/utils/interface';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('metadata.experiences');

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${t('url')}`,
      languages: {
        en: '/en/experiences',
        it: '/it/lavori'
      }
    },
    openGraph: {
      title: `${t('title')} | Francesco Petranzan`,
      locale: `${locale}`,
      url: `/${locale}/${t('url')}`,
      images: ["/og/experiences/opengraph-image.png"]
    },
    twitter: {
      images: ["/og/experiences/twitter-image.png"]
    },
  }
}

async function Experiences() {

  return (<>
    <ExperiencesPage />
  </>);
}

export default Experiences;