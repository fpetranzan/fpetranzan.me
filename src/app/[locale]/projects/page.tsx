import ProjectsPage from "@/components/pages/ProjectsPage";
import Props from "@/components/utils/interface";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('metadata.projects');
  
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${t('url')}`,
      languages: {
        en: '/en/projects',
        it: '/it/progetti'
      }
    },
    openGraph: {
      title: `${t('title')} | Francesco Petranzan`,
      locale: `${locale}`,
      url: `/${locale}/${t('url')}`,
    },
  }
}

async function Projects() {

  return (<>
    <ProjectsPage />
  </>);
}

export default Projects;