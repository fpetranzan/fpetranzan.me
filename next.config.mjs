import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
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