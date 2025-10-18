
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Performance optimizations
    experimental: {
        optimizeCss: false,
    },
    
    // Compilation optimizations (swcMinify is default in Next.js 15)
    
    // Image optimization
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/f/**'
            }
        ],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    },
    
    // Bundle analyzer (enable with ANALYZE=true)
    webpack: (config, { isServer, dev }) => {
        if (process.env.ANALYZE === 'true') {
            const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: true,
                })
            )
        }
        
        return config
    },
    
    // Headers for better caching and security
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
            {
                source: '/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ]
    },
};

export default nextConfig;
