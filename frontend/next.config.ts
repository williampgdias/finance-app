import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc', // allow images from this domain
            },
        ],
    },
    reactCompiler: true,
};

export default nextConfig;
