import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        outputFileTracingIncludes: {
            '/**': ['./content/**/*'],
        },
    },
};
 
export default withNextIntl(nextConfig);