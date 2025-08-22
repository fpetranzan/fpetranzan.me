import type { Metadata } from 'next';
import { Roboto_Condensed } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Content management admin panel',
  robots: {
    index: false,
    follow: false,
  }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={robotoCondensed.className}>
        <ThemeProvider attribute="class" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}