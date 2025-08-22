import ThemeToggle from "../utils/ThemeToggle";
import LocaleSwitcher from "../utils/LocaleSwitch";
import { Link } from "@/lib/routing";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations('menu');
  
  return (
    <div className="flex gap-4 my-10 text-sm sm:gap-8 sm:my-14 md:my-20 sm:text-base">
      <Link href="/">{t('home')}</Link>
      <Link href="/experiences">{t('experiences')}</Link>
      <Link href="/projects">{t('projects')}</Link>
      <ThemeToggle />
      <LocaleSwitcher />
    </div>
  );
}