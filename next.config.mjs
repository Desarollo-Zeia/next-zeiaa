
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/f/**'
            }
        ]
    },
    cacheComponents: true,
    experimental: {
        // Optimiza imports de barrel files para reducir bundle size
        // Impacto: 15-70% más rápido en dev, 28% builds más rápidos, 40% cold starts más rápidos
        optimizePackageImports: [
            'lucide-react',
            'date-fns', 
            'recharts',
            '@radix-ui/react-icons'
        ]
    }
};

export default nextConfig;
