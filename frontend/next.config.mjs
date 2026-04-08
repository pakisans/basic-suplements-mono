/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        // Static assets have content-hash in filename — safe to cache 1 year
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Payload media uploads
        source: '/media/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
        ],
      },
      {
        // Auth / checkout / account pages — never cache
        source: '/(naplata|nalog|korpa|login)(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '46.225.222.58',
        port: '3001',
        pathname: '/api/media/**',
      },
      {
        protocol: 'http',
        hostname: '46.225.222.58',
        port: '3001',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
