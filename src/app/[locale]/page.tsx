import HomePage from "@/components/pages/HomePage";
import Props from "@/components/utils/interface";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('metadata.home');

  return {
    description: t('description'),
    openGraph: {
      title: "Francesco Petranzan",
      locale: `${locale}`,
      url: `/${locale}`,
    },
  }
}

async function Home() {
  return (<>
    <HomePage />
  </>);
}

export default Home;