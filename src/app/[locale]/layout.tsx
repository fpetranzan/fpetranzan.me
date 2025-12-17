import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getContentForLocale } from "@/lib/content";
import { Roboto_Condensed } from 'next/font/google'
import Footer from "@/components/pages/Footer";
import Header from "@/components/pages/Header";
import { host } from "@/lib/i18n/config";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  let messages;
  try {
    messages = await getContentForLocale(locale);
  } catch (error) {
    messages = await getContentForLocale('en'); // fallback
  }

  return {
    metadataBase: new URL(host),
    title: {
      default: "Francesco Petranzan - Software Engineer",
      template: "%s | Francesco Petranzan - Software Engineer"
    },
    description: messages.metadata.home?.description || "Francesco Petranzan Portfolio, Software developer. All about me, my career and my projects.",
    creator: "fpetranzan",
    publisher: "Francesco Petranzan",
    category: "Portfolio",
    keywords: [
      'Francesco Petranzan', 'Francesco', 'Petranzan', 'Portfolio', 'Software Engineer', 
      'Developer', 'Backend', 'Java', 'Spring Boot', 'SQL', 'Docker',
      'Software Development', 'Web Development', 'Full Stack Developer', 'Italy', 'Milan',
    ],
    authors: [
      {
        name: "Francesco Petranzan",
        url: "https://github.com/fpetranzan"
      }
    ],
    alternates: {
      canonical: locale === 'en' ? '/' : `/${locale}`,
      languages: {
        'en': '/en',
        'it': '/it',
        'x-default': '/en'
      }
    },
    openGraph: {
      type: "website",
      siteName: "Francesco Petranzan - Software Engineer",
      title: "Francesco Petranzan - Software Engineer",
      description: messages.metadata.home?.description || "Francesco Petranzan Portfolio, Software developer. All about me, my career and my projects.",
      locale: locale,
      alternateLocale: locale === 'en' ? ['it'] : ['en']
    },
    twitter: {
      card: "summary_large_image",
      title: "Francesco Petranzan - Software Engineer",
      description: messages.metadata.home?.description || "Francesco Petranzan Portfolio, Software developer. All about me, my career and my projects.",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    }
  };
}

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
})

export default async function RootLayout({
  children,
  params
}: LayoutProps) {
  const { locale } = await params;
  
  let messages;
  try {
    messages = await getContentForLocale(locale);
  } catch (error) {
    console.error(`Failed to load content for locale ${locale}:`, error);
    messages = await getContentForLocale('en');
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="canonical" href={`${host}/${locale}`} />
        <link rel="alternate" hrefLang="en" href={`${host}/en`} />
        <link rel="alternate" hrefLang="it" href={`${host}/it`} />
        <link rel="alternate" hrefLang="x-default" href={`${host}/en`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Francesco Petranzan",
              "jobTitle": "Software Engineer",
              "url": host,
              "sameAs": [
                "https://github.com/fpetranzan",
                "https://linkedin.com/in/francesco-petranzan"
              ],
              "knowsAbout": ["Software Engineering", "Java", "Spring Boot", "Backend Development", "Web Development", "SQL", "Docker"]
            })
          }}
        />
      </head>
      <body className={`mx-auto max-w-72 sm:max-w-lg md:max-w-2xl lg:max-w-4xl ${robotoCondensed.className}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" enableSystem={false}>
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}